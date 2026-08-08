# CodeAtlas Multi-Tenancy Architecture Specification

## Resource Hierarchy

```
Organization
  └── Workspace
       └── Team
            └── Repository
                 └── Artifacts, Graphs, Intelligence
```

## Isolation Enforcement

- **Database Tier**: Row-Level Security (RLS) and mandatory `organization_id` foreign keys.
- **Graph Engine**: Graph queries scoped to single tenant subgraphs.
- **AI Context**: Vector retrieval scoped strictly to tenant embeddings.
