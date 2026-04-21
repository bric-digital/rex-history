# rex-history

REX module for collecting web browsing history via the `chrome.history` API.

## Overview

**rex-history** collects browsing history data for research purposes. It:

- Queries browser history at configurable intervals
- Filters URLs using allow lists and filter lists (requires **rex-lists** module)
- Categorizes URLs based on category lists (requires **rex-lists** module)
- Optionally generates top-visited domain lists
- Transmits data via webmunk-passive-data-kit

## Configuration

This module reads from the `history` section of the backend config.

### Configuration Source of Truth

- `rex-history` reads its module configuration from rex-core (`REXConfiguration.history`).
- It does **not** support a module-local configuration override key in storage.
- List behavior (`allow_lists`, `filter_lists`, `category_lists`, `domain_only_lists`) uses list names from `history` config and resolves entries from the shared lists database (`@bric/rex-lists`).
- As a result, user edits made through `rex-lists-front-end` are immediately visible to history matching for those configured list names.

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | Yes | - | Enable/disable history collection |
| `collection_interval_minutes` | number | No | 5 | How often to collect history (in minutes) |
| `lookback_days` | number | No | 1 | How far back to query history |
| `allow_lists` | string[] | No | [] | List names - only URLs matching these lists are collected. If empty, all URLs are collected. |
| `filter_lists` | string[] | No | [] | List names - matching URLs have their URL replaced with category placeholder |
| `category_lists` | string[] | No | [] | List names - used to attach category metadata to URLs |
| `domain_only_lists` | string[] | No | [] | List names - matching URLs have URL/title replaced with "DOMAIN ONLY" while preserving the domain field |
| `generate_top_domains` | boolean | No | false | Whether to generate a list of top-visited domains |
| `top_domains_count` | number | No | 100 | Number of domains to include in top domains list |
| `top_domains_list_name` | string | No | "top-visited-domains" | Name for the generated top domains list |
| `page_events_link_tolerance_ms` | number | No | 5000 | Optional linkage to **rex-page-events**. Tolerance (ms) for matching a `rex-history-visit` to a buffered `rex-page-url-active` record by `(url, visit_time ≈ url_shown_at)`. Set to `0` to disable matching. Has no effect when `rex-page-events` is not installed. |

### Example

```json
{
  "history": {
    "enabled": true,
    "collection_interval_minutes": 5,
    "lookback_days": 1,
    "allow_lists": ["news-sites", "ai-chatbots", "serp"],
    "filter_lists": ["history-filter"],
    "category_lists": ["ai-chatbots", "serp", "news-sites", "banking-sites"],
    "domain_only_lists": ["social-media-sites"],
    "generate_top_domains": false,
    "top_domains_count": 100,
    "top_domains_list_name": "top-visited-domains"
  }
}
```

### List Types and Behavior

This module supports four different types of lists, each with distinct behavior:

#### Allow Lists (`allow_lists`)

**Purpose**: Control which URLs are collected at all.

**Behavior**:
- If configured and non-empty, ONLY URLs matching at least one allow list are collected
- URLs not on any allow list are replaced with `CATEGORY:NOT_ON_ALLOWLIST` (URL, title, and domain all blanked)
- If empty or not configured, all URLs are collected (default behavior)

**Use case**: Restrict data collection to specific domains of interest (e.g., only news sites, AI chatbots, search engines)

#### Filter Lists (`filter_lists`)

**Purpose**: Privacy-preserving collection with category placeholders.

**Behavior**:
- URLs matching a filter list have their URL replaced with `CATEGORY:<category>` where `<category>` comes from the list entry's metadata
- Title and domain are also blanked for privacy
- Visit is still uploaded with all metadata except the actual URL

**Use case**: Collect visits to sensitive domains (e.g., health sites, banking) while preserving privacy

#### Domain-Only Lists (`domain_only_lists`)

**Purpose**: Collect domain information without exposing full URLs or page titles.

**Behavior**:
- URLs matching a domain-only list have their URL replaced with `DOMAIN ONLY`
- Title is replaced with `DOMAIN ONLY`
- **Domain field is preserved** (the registered domain extracted via psl)
- Visit metadata (timing, transitions, etc.) is still collected

**Use case**: Track visits to domains where the domain name itself is not sensitive, but specific pages/titles are (e.g., social media sites, video platforms)

#### Category Lists (`category_lists`)

**Purpose**: Tag URLs with category metadata without modifying them.

**Behavior**:
- URLs matching a category list get tagged with category metadata from the list entry
- URL, title, and domain are NOT modified
- Multiple categories can be attached if URL matches multiple lists

**Use case**: Classify URLs for analysis (e.g., tag all AI chatbots, all news sites, all search engines) while collecting full data

### List References

The `allow_lists`, `filter_lists`, `category_lists`, and `domain_only_lists` fields reference list names defined in the `lists` configuration section. See [rex-lists](https://github.com/bric-digital/rex-lists) for list format documentation.

## Dependencies

This module requires:

- **[@bric/rex-core](https://github.com/bric-digital/rex-core)** - Core REX framework (required)
- **[@bric/rex-lists](https://github.com/bric-digital/rex-lists)** - List management and URL filtering (required)
- **[@bric/webmunk-passive-data-kit](https://github.com/bric-digital/webmunk-passive-data-kit)** - Data transmission (required for data upload)

## Installation

Add to your extension's `package.json` dependencies:

```json
{
  "dependencies": {
    "@bric/rex-core": "github:bric-digital/rex-core#main",
    "@bric/rex-lists": "github:bric-digital/rex-lists#main",
    "@bric/webmunk-passive-data-kit": "github:bric-digital/webmunk-passive-data-kit#main",
    "@bric/rex-history": "github:bric-digital/rex-history#main"
  }
}
```

Then run `npm install`.

## Module Context Exports

- `./extension` - Extension UI context
- `./browser` - Browser/content script context
- `./service-worker` - Service worker context (main collection logic)

## Linking to rex-page-events (optional)

If **rex-page-events** is installed alongside rex-history in the same extension, each `rex-history-visit` record may additionally carry:

- `tab_id` — the tab the URL was observed in
- `window_id` — the window that tab belonged to
- `session_id` — the per-tab UUID minted by rex-page-events at `tab_open`
- `page_events_url_shown_at` — the `Date.now()` timestamp when rex-page-events saw that URL become active in the tab

These fields let analysts join `rex-history-visit` records with `rex-page-event` records exactly: by `session_id` within a tab, or by `(url, page_events_url_shown_at ≈ visit_time)` at the visit level.

**rex-history does not import `@bric/rex-page-events`.** At startup it probes `globalThis.__rexPageEventsUrlActive` — a tiny seam installed by rex-page-events' own service worker — and subscribes if present. If rex-page-events isn't bundled into the extension, the probe returns `undefined`, no subscription happens, and visits go out without the linkage fields. No error, no warning beyond a single info-level log line.

**Redacted URLs are never matched.** If rex-history's own filter/allow/domain_only lists would replace the visit's URL with `CATEGORY:…`, the linkage lookup short-circuits: no `tab_id` / `session_id` is stapled onto a redacted visit, even if a matching record exists in the buffer. Privacy-preserving by design.

**Tuning.** Set `page_events_link_tolerance_ms` to widen or narrow the time window. Default 5000ms comfortably covers `chrome.history`'s recording lag. Set to `0` to disable matching entirely while still buffering records (useful for debug telemetry).

## Coupling model

This module and `rex-page-events` use **two different kinds of coupling on purpose.**

**Code — loosely coupled.** Neither module imports the other. Neither lists the other in `package.json` dependencies. The only connection is a convention: `rex-page-events` installs a `subscribe` function on `globalThis.__rexPageEventsUrlActive` at service-worker startup, and `rex-history` probes for it at its own startup. If the probe returns undefined (because `rex-page-events` wasn't included in the extension build), `rex-history` proceeds without linkage fields. Either module can ship, update, or be removed independently. The only shared surface is the `RexPageUrlActiveEvent` type in `@bric/rex-types`.

**Data — tightly coupled.** Once both modules are present, every `rex-history-visit` record that matches a buffered `rex-page-url-active` gets `tab_id`, `window_id`, `session_id`, and `page_events_url_shown_at` stapled onto it. A visit's `session_id` means exactly the same thing as the page-event's `session_id` for the same tab lifetime — analysts can treat the two streams as one correlated dataset, joining on `session_id` for exact-within-tab analysis or on `(url, page_events_url_shown_at ≈ visit_time)` for visit-level analysis.

Put simply: loose at the code seam so each module is independently useful, tight at the data seam so the output is analyzable as a single story.

## License

Apache 2.0
