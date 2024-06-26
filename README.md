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

### Postgres Functions and Triggers for Speakers

You can create the following functions/triggers on SQL Editor.

`add_user_to_speaker`: Function for trigger_add_user_to_speaker

```
create or replace function add_user_to_speaker()
returns trigger
language plpgsql
security definer set search_path = ‘’
as $$
begin
  insert into public.speakers(uuid, name, email)
  values (new.id, new.email, new.email);
  return new;
end;
$$;
```

> The insert operation is executed by supabase_auth_admin who does not have access to public schema so that we need to grant permission to it. This might not best practice but one way.
>
> See: Security definer vs invoker https://supabase.com/docs/guides/database/functions?queryGroups=language&language=sql#security-definer-vs-invoker

`trigger_add_user_to_speaker`: Invoked whenever auth.users was created

```
create or replace trigger trigger_add_user_to_speaker
after insert on auth.users
for each row execute procedure add_user_to_speaker();
```

SQL for dropping `trigger_add_user_to_speaker`. As for the auth schema, it is managed by Supabase and is read-only through the dashboard and needs to operate it on SQL Editor.

```
drop trigger if exists trigger_add_user_to_speaker on auth.users;
```
