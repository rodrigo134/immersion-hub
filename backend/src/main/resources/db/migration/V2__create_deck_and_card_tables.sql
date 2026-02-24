create table if not exists decks (
  id uuid primary key,
  name varchar(255) not null,
  description text,
  language varchar(50) not null,
  created_at timestamp not null,
  updated_at timestamp not null
);

create table if not exists cards (
  id uuid primary key,
  deck_id uuid not null references decks(id) on delete cascade,
  language varchar(50) not null,
  front text not null,
  back text not null,
  context text,
  difficulty integer not null default 0,
  interval integer not null default 1,
  repetitions integer not null default 0,
  next_review timestamp not null,
  created_at timestamp not null,
  updated_at timestamp not null
);

create index if not exists idx_cards_deck_id on cards(deck_id);
create index if not exists idx_cards_language on cards(language);
create index if not exists idx_cards_next_review on cards(next_review);
