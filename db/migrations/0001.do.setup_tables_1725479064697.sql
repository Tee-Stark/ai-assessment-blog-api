-- database migration file --
begin;

create or replace function on_update_timestamp()
    returns trigger as $$
    begin
        new.updated_at = now();
        return new;
    end;
$$ language 'plpgsql';

create table users (
    id uuid primary key not null default gen_random_uuid(),
    name text not null,
    email_address text not null unique,
    password text not null,
    role text not null default 'user' check(role in ('user', 'admin')),
    created_at timestamptz not null default current_timestamp
);

create table posts (
    id uuid primary key not null default gen_random_uuid(),
    title text not null,
    content_body text not null,
    author_id uuid not null references users,
    status text not null default 'pending' check(status in ('pending', 'published', 'rejected')),
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

create table post_updates (
    id serial primary key not null,
    post_id uuid references posts,
    title text,
    content_body text,
    author_id uuid not null references users,
    action text not null default 'update' check(action in ('update', 'delete')),
    status text not null default 'pending' check(status in ('pending', 'approved', 'rejected')),
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

create trigger posts_updated_at before update on posts for each row execute procedure on_update_timestamp();

create trigger posts_updated_at before update on post_updates for each row execute procedure on_update_timestamp();

commit; 