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

### Postgres functions and triggers

You can create the following functions/triggers on SQL Editor.

Speaker creation:

Function for trigger_add_user_to_speaker.

```
create or replace function add_user_to_speaker()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.speakers(uuid, name, email)
  values (gen_random_uuid(), new.email, new.email);
  return new;
end;
$$;
```

> See: Security definer vs invoker https://supabase.com/docs/guides/database/functions?queryGroups=language&language=sql#security-definer-vs-invoker

Triggered whenever auth.users was created.

```
create or replace trigger trigger_add_user_to_speaker
after insert on auth.users
for each row execute procedure add_user_to_speaker();
```

SQL for dropping `trigger_add_user_to_speaker`.

```
drop trigger if exists trigger_add_user_to_speaker on auth.users;
```
