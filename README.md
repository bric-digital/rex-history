# rex-history

REX module for collecting web browsing history via the `chrome.history` API.

## Overview

**rex-history** collects browsing history data for research purposes. It:

- Queries browser history at configurable intervals
- Records every visit with the address and title as Chrome reports them, and the registered domain
- Tags each visit with categories from category lists (requires **rex-lists** module)
- Optionally generates top-visited domain lists
- Transmits data via webmunk-passive-data-kit

## Configuration

This module reads from the `history` section of the backend config.

### Configuration Source of Truth

- `rex-history` reads its module configuration from rex-core (`REXConfiguration.history`).
- It does **not** support a module-local configuration override key in storage.
- Category matching (`category_lists`) uses list names from `history` config and resolves entries from the shared lists database (`@bric/rex-lists`).
- The extension must import `@bric/rex-lists/service-worker`, which loads the `lists` section of the configuration into that database. Collection does not wait for the lists.
- User edits made through `rex-lists-front-end` are immediately visible to category matching for those configured list names.

### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | Yes | - | Enable/disable history collection |
| `collection_interval_minutes` | number | No | 5 | How often to collect history (in minutes) |
| `lookback_days` | number | No | 1 | How far back to query history |
| `collect_after_install` | boolean | No | true | When false, collection stops at the install time reported by rex-core, so only history from before install (back to `lookback_days`) is collected. Without an install time, the time of the first collection is used and stored. |
| `collection_page_size` | number | No | 1000 | Per-request page size for the collection loop's `chrome.history.search` calls. Not a collection cap: the loop paginates by visit-time cursor until a page is empty, so every record is still collected. Smaller pages reduce per-request memory/latency in the service worker at the cost of more iterations. |
| `category_lists` | string[] | No | [] | List names - used to attach category metadata to URLs |
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
    "category_lists": ["ai-chatbots", "serp", "news-sites", "banking-sites"],
    "generate_top_domains": false,
    "top_domains_count": 100,
    "top_domains_list_name": "top-visited-domains"
  }
}
```

### Recorded fields

Every visit produces a `rex-history-visit` record. Its `url`, `recorded_url` and `title` are what Chrome reports, and `domain` is the registered domain, or the host itself when the host has no registered domain (an IP address, `localhost`), or `not available` when the address has no host. A visit above `max_visits_per_url` is recorded as a `rex-history-visit-aggregate` record with the same fields. rex-history does not hide, shorten or replace any part of an address, and no list changes a record's address, title or domain. A record collected before its category lists have loaded has an empty `categories` list.

### Category Lists (`category_lists`)

**Purpose**: Tag URLs with category metadata without modifying them.

**Behavior**:
- URLs matching a category list get tagged with category metadata from the list entry
- URL, title, and domain are NOT modified
- Multiple categories can be attached if URL matches multiple lists

**Use case**: Classify URLs for analysis (e.g., tag all AI chatbots, all news sites, all search engines)

### Reducing what is recorded

To keep less of an address, add a content processor that runs after collection. The settings `allow_lists`, `filter_lists` and `domain_only_lists` are no longer part of the `history` configuration; they moved to the `content_processing_redaction_url` configuration of [rex-content-processing-redaction-url](https://github.com/bric-digital/rex-content-processing-redaction-url).

### List References

The `category_lists` field references list names defined in the `lists` configuration section. See [rex-lists](https://github.com/bric-digital/rex-lists) for list format documentation.

## Dependencies

This module requires:

- **[@bric/rex-core](https://github.com/bric-digital/rex-core)** - Core REX framework (required)
- **[@bric/rex-lists](https://github.com/bric-digital/rex-lists)** - List storage, matching and loading of the `lists` configuration section (required). Import `@bric/rex-lists/service-worker` in the extension's service worker.
- **[@bric/webmunk-passive-data-kit](https://github.com/bric-digital/webmunk-passive-data-kit)** - Data transmission (required for data upload)

`@bric/rex-types` supplies the `RexVisitRecord` type that `rex-history-visit` shares with `rex-browsing-visit`. `package.json` pins it to a commit on an unmerged rex-types branch; once that pull request merges, pin rex-types' release tag, or the merge commit on its main while rex-types has no tags.

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
