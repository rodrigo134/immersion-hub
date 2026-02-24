-- Adicionar coluna user_id como nullable
alter table decks 
add column user_id uuid references users(id) on delete cascade;

-- Criar índice
create index if not exists idx_decks_user_id on decks(user_id);
