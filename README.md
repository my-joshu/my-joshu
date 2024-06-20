# MyJoshu

## Setup

### Supabase

```bash
pnpm supabase login
pnpm supabase link --project-ref xxx
```

Start Supabase

```bash
$ pnpm supabase start

Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
```

Setup Database

```bash
pnpm supabase migration up
pnpm supabase db reset --debug
```
