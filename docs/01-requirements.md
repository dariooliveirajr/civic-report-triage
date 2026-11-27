[Project](../README.md) › [Docs](README.md) › 01 Requirements

# 01 Requirements

v0.1 is due on 2 Dec 2026. A reviewer opens the live URL, picks a real Köln report and reads a reply draft with its sources. Why the project exists and how this idea was chosen is in the [project README](../README.md#the-idea).

## Functional

| ID | Requirement |
| --- | --- |
| F1 | A script imports Köln reports from the Open311 API into Postgres for a given date range. |
| F2 | The web app lists the imported reports with category, district, status and date. |
| F3 | Opening a report shows a reply draft based only on the pages in `service-pages/sources.yaml`. |
| F4 | Every draft shows the chunks it used, each with a link to the original page. |
| F5 | The UI shows the "data as of" time of the last successful import. |
| F6 | The rules step exists in the request path but passes reports through unchanged. |

## Non-functional

| ID | Requirement |
| --- | --- |
| N1 | No city API is called during a user request; the API reads only from Postgres. |
| N2 | The import queries small date windows (one day to one week), pages through results, and retries with backoff. |
| N3 | Every report and every chunk stores its source, licence and fetch time. |
| N4 | Report text and fetched pages are untrusted input; instructions found in them are never followed. |
| N5 | Drafts are suggestions for a person and are never sent anywhere. |
| N6 | The app is deployable at every commit on `main`; CI runs lint and tests. |

Later releases and what they add are in [Project management](project-management.md#releases).

---

[← Docs index](README.md) · [02 Use cases →](02-use-cases.md)
