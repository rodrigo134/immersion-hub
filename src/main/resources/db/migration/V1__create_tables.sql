create table if not exists cards (
  id uuid primary key,
  target_text text not null,
  native_text text,
  notes text,
  source_url text,
  created_at timestamptz not null,
  next_review_at timestamptz,
  last_review_at timestamptz,
  review_count int not null default 0,
  tags text[]
);

create table if not exists clips (
  id uuid primary key,
  source_url text,
  duration_seconds int not null default 20,
  audio_path text,
  transcript text,
  translation text,
  created_at timestamptz not null
);
