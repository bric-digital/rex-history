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

## License

Apache 2.0
