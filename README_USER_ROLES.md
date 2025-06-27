# Sistema de Roles de Usuário - Fardo Fashion

## Visão Geral

O sistema possui dois tipos de usuários:
- **Clientes (userRole: 0)** - Usuários normais que podem fazer compras
- **Administradores (userRole: 1)** - Usuários com acesso ao painel administrativo

## Como Funciona

### Cadastro de Clientes (Padrão)
- Todos os novos usuários são automaticamente registrados como **clientes**
- Endpoint: `POST /api/signup`
- Não requer autenticação
- Sempre cria usuários com `userRole: 0`

### Cadastro de Administradores
- Apenas administradores existentes podem criar novos administradores
- Endpoint: `POST /api/admin-signup`
- Requer autenticação de administrador
- Cria usuários com `userRole: 1`

## Primeiro Administrador

Para criar o primeiro administrador do sistema:

1. Execute o script:
```bash
node server/scripts/createFirstAdmin.js
```

2. Isso criará um administrador com:
   - Email: `admin@fardo.com`
   - Senha: `admin123`

3. **IMPORTANTE**: Altere a senha após o primeiro login!

## Endpoints Disponíveis

### Públicos
- `POST /api/signup` - Cadastro de clientes
- `POST /api/signin` - Login de usuários

### Protegidos (Requerem autenticação de admin)
- `POST /api/admin-signup` - Cadastro de administradores
- `POST /api/user` - Listar todos os usuários
- `POST /api/isadmin` - Verificar se usuário é admin

## Segurança

- Apenas administradores podem criar outros administradores
- Tokens JWT são usados para autenticação
- Middleware protege rotas administrativas
- Validação de dados em todos os endpoints

## Estrutura do Token JWT

```json
{
  "_id": "user_id",
  "role": 0 // 0 para cliente, 1 para admin
}
```

## Mudanças Implementadas

1. **Correção do bug**: Novos usuários agora são criados como clientes por padrão
2. **Segurança**: Apenas admins podem criar outros admins
3. **Separação de responsabilidades**: Rotas separadas para clientes e admins
4. **Script de setup**: Criação automática do primeiro administrador
5. **Correção de middlewares**: Retornos adequados em caso de erro 