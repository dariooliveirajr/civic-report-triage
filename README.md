# cologne-civic-report-triage

A triage service for citizen reports to the city of Köln (potholes, illegal dumping, broken street lights). It imports real reports from Köln's public Open311 API, a rules engine assigns each report a department, priority and target response time, and a RAG component drafts a reply from the city's own service information, citing the passages each reply is based on.

## Data sources

| Source | API | Licence |
| --- | --- | --- |
| Köln, "Sag's uns" | `https://sags-uns.stadt-koeln.de/georeport/v2/` (Open311 GeoReport v2) | Datenlizenz Deutschland – Zero – Version 2.0 |

The reports are published anonymised by the city. This project stores a snapshot of them and does not write anything back to the city's systems.

## Documentation

- [Design overview](docs/DESIGN.md): options considered, architecture, components and data flow
- [Repository layout](docs/DESIGN.md#repository-layout): where each component lives and why
- [Knowledge base](knowledge/README.md): which public pages the reply drafts are based on
