create table if not exists password_reset_tokens (
  id uuid primary key,
  user_id uuid not null,
  token varchar(255) not null unique,
  expires_at timestamp not null,
  used_at timestamp,
  created_at timestamp not null,
  constraint fk_password_reset_tokens_user
    foreign key (user_id) references users(id) on delete cascade
);

create index if not exists idx_password_reset_tokens_user_id
  on password_reset_tokens(user_id);

create index if not exists idx_password_reset_tokens_token
  on password_reset_tokens(token);
