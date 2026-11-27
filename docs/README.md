[Project](../README.md) › Docs

# Documentation

Start with the [project README](../README.md#the-idea): the goal, the options considered and the product idea. Then read these files in order; each one answers one question and links to the next.

| File | Answers |
| --- | --- |
| [01 Requirements](01-requirements.md) | What v0.1 must do: functional and non-functional requirements |
| [02 Use cases](02-use-cases.md) | Who uses the app and what they do with it |
| [03 Data flow](03-data-flow.md) | Which external systems the app talks to, their limits, and what other cities' data looks like |
| [04 Architecture](04-architecture.md) | The components inside the app, the data model and the repository layout |
| [Decisions](decisions/README.md) | Architecture Decision Records (ADRs): what was decided, against which options, and when to revisit |
| [Working with Claude](working-with-claude.md) | How the project is built with an AI assistant, and where I overruled it |
| [Project management](project-management.md) | Goal date, releases, schedule, time budget and how scope is cut |

Files 03 and 04 follow the [C4 model](https://c4model.com/): 03 is the system context (the app as one box with the systems around it), 04 the container and component view (what is inside the box).

## Glossary

The same words are used in the code, the docs and the UI (the ubiquitous language from DDD). The naming rule: data is named after the domain (report, service page), steps after what they do (import, index), and technique words such as "knowledge base" or "query" only where that technique is meant.

| Term | Meaning |
| --- | --- |
| Report | A citizen's report of a problem (illegal dumping, a blocked drain), imported from the Köln Open311 API. The input of the app. |
| Open311 | The GeoReport v2 standard many cities use to publish reports. Köln, Zürich and San Francisco all use it, with differences (see [03](03-data-flow.md#other-cities)). |
| Adapter | The code that turns one city's Open311 records into the app's report schema. Today only the Köln adapter exists. |
| Ingestion | Umbrella word for getting outside data into the app. Two pipelines: report import and service page indexing. Both run as scripts, never during a request. |
| Import | Copying Köln reports into the `reports` table: fetch a date window, map the fields, upsert. Command: `npm run import-reports`. |
| Import run | One run of the import over a date window. Its finish time is the "data as of" time shown in the UI. |
| Service page | A public page on stadt-koeln.de that explains a city service (who is responsible, what happens next). Listed in [`service-pages/sources.yaml`](../service-pages/sources.yaml). |
| Indexing | Making service pages searchable: fetch, extract the text, split into chunks, embed, store. Command: `npm run index-service-pages`. Reports are never indexed. |
| Knowledge base | RAG role word: the indexed service pages as the drafter sees them. The only material a draft may use. Not used as a folder or table name. |
| Chunk | A short piece of a service page (a few paragraphs), stored in `service_page_chunks` with its embedding, URL and fetch time. Chunks are what the drafter retrieves and cites. Older text calls them "passages". |
| Query | RAG role word: the opened report's text, embedded once to find the closest chunks. |
| Embedding | A list of numbers that represents the meaning of a text. Texts with similar meaning have embeddings that are close together, which is how chunks are found for a report. |
| Triage | Sorting reports by urgency and suggesting who handles them. Done by the rules engine (pass-through in v0.1, real rules in v0.2). |
| Draft | A suggested reply to a report, written by the LLM from retrieved chunks only and shown with those chunks as sources. Never sent anywhere. |

---

[← Project README](../README.md) · [01 Requirements →](01-requirements.md)
