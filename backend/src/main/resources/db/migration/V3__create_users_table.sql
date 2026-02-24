create table if not exists users (
  id uuid primary key,
  username varchar(50) not null unique,
  email varchar(255) not null unique,
  password varchar(255) not null,
  role varchar(50) not null default 'ROLE_USER',
  created_at timestamp not null,
  updated_at timestamp not null
);

create index if not exists idx_users_username on users(username);
create index if not exists idx_users_email on users(email);
