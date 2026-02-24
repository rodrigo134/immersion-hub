# Autenticação - Immersion Hub

## 🚀 Como Testar

### 1. Backend
- Inicie o PostgreSQL na porta 5434 (ou configure outra porta)
- Execute o backend: `./mvnw spring-boot:run`
- O backend estará rodando em `http://localhost:8080`

### 2. Frontend
- Copie `.env.example` para `.env`:
  ```bash
  cp .env.example .env
  ```
- Inicie o frontend:
  ```bash
  npm run dev
  ```
- Acesse `http://localhost:5173`

## 🔐 Funcionalidades Implementadas

### Backend
- ✅ JWT Authentication
- ✅ Spring Security
- ✅ Registro de usuários
- ✅ Login com token
- ✅ Proteção de endpoints
- ✅ Cada usuário só vê seus próprios decks/cards

### Frontend
- ✅ Tela de Login
- ✅ Tela de Registro
- ✅ Contexto de Autenticação
- ✅ Rotas Protegidas
- ✅ Header com logout
- ✅ Armazenamento de token

## 📱 Telas

### 1. Login (`/auth`)
- Campos: Usuário e Senha
- Validação de credenciais
- Redirecionamento automático após login

### 2. Registro (`/auth`)
- Campos: Usuário, E-mail, Senha
- Validações de formulário
- Criação automática de login

### 3. Dashboard (`/`)
- Apenas usuários autenticados
- Header com nome do usuário e logout
- Cards de navegação para decks, cards e progresso

## 🔧 Como Funciona

1. **Registro**: Usuário cria conta → backend gera token JWT → frontend armazena token
2. **Login**: Usuário faz login → backend valida → retorna token → frontend armazena
3. **Acesso**: Token enviado em `Authorization: Bearer <token>` para requisições protegidas
4. **Logout**: Token removido do localStorage → usuário redirecionado para login

## 🛡️ Segurança

- Senhas criptografadas com BCrypt
- Tokens JWT com expiração (24h)
- CORS configurado
- Endpoints protegidos por Spring Security
- Cada usuário isolado em seus dados

## 🔄 Fluxo da Aplicação

```
Acessar App → Verifica Token
├── Sem Token → Tela de Login/Registro
└── Com Token → Dashboard (se válido)
    ├── Criar/Ver Decks (só seus)
    ├── Criar/Ver Cards (só seus)
    └── Logout → Remove token → Tela de Login
```

## 🧪 Testes Manuais

1. **Teste de Registro**:
   - Abra o app
   - Clique em "Cadastre-se"
   - Preencha os campos
   - Verifique se redireciona para o dashboard

2. **Teste de Login**:
   - Faça logout
   - Faça login com as mesmas credenciais
   - Verifique se funciona

3. **Teste de Proteção**:
   - Tente acessar diretamente `/` sem token
   - Deve redirecionar para login

4. **Teste de Isolamento**:
   - Crie um deck com usuário A
   - Faça login com usuário B
   - Verifique que não vê o deck de A
