create table if not exists user_favorite_sources (
  user_id uuid not null,
  source_id uuid not null,
  created_at timestamp not null default current_timestamp,
  primary key (user_id, source_id),
  constraint fk_user_favorite_sources_user
    foreign key (user_id) references users(id) on delete cascade,
  constraint fk_user_favorite_sources_source
    foreign key (source_id) references sources(id) on delete cascade
);
