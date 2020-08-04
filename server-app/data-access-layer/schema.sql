drop schema public cascade;
create schema public;
create extension unaccent;

create or replace function f_concat_suggest_query(text)
    returns text language sql immutable as 'select array_to_string(string_to_array(lower(unaccent($1)), '' ''), ''%'')';

create table cities (
    id bigint not null constraint cities_pkey primary key,
    name text   not null
);

create index cities_name_index on cities (name);
