-- Corrigir problema de user_id null em decks existentes

-- Criar um usuário padrão para decks existentes
INSERT INTO users (id, username, email, password, role, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'system_user',
    'system@immersionhub.com',
    '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ',
    'USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Atualizar decks existentes para usar o usuário padrão
UPDATE decks 
SET user_id = '00000000-0000-0000-0000-000000000001'
WHERE user_id IS NULL;

-- Agora tornar a coluna NOT NULL
alter table decks 
alter column user_id set not null;
