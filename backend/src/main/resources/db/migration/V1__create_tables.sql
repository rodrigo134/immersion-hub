create table if not exists sources (
  id uuid primary key,
  name varchar(255) not null,
  url text not null,
  description text not null,
  category varchar(50) not null,
  language varchar(50) not null
);
