# EasyWay Backend - v2.0

Backend otimizado com **banco de dados inicializado automaticamente**!

## 🆕 O Que Mudou

✅ **Banco de dados criado automaticamente** ao iniciar
✅ **Usuários padrão inseridos automaticamente**
✅ **Sem necessidade de script de seed**
✅ **Pronto para usar imediatamente**

## 🚀 Quick Start

### Local Development

```bash
npm install
npm start
```

Acesse: `http://localhost:5000/api/health`

### Deploy no Railway

1. **Copie os arquivos** para seu repositório GitHub
2. **Faça commit e push**
3. **No Railway, clique em "Redeploy"**
4. **Aguarde ficar verde ✅**

## 📋 Credenciais Padrão (Criadas Automaticamente)

### Professor
```
Email: professor@easyway.com
Senha: senha123
```

### Aluno 1
```
Email: aluno1@easyway.com
Senha: senha123
```

### Aluno 2
```
Email: aluno2@easyway.com
Senha: senha123
```

## 🔗 API Endpoints

### Health Check
```
GET /api/health
```
Resposta:
```json
{
  "status": "OK",
  "message": "🚀 EasyWay Backend is running!",
  "timestamp": "2026-02-28T..."
}
```

### Autenticação
```
POST /api/auth/teacher/login
POST /api/auth/student/login
```

Body:
```json
{
  "email": "professor@easyway.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Professor",
    "email": "professor@easyway.com",
    "type": "teacher"
  }
}
```

### Dados
```
GET /api/teachers/:id
GET /api/teachers/:id/students
GET /api/students/:id
```

## 🗄️ Banco de Dados

- **SQLite** (automático)
- **Arquivo:** `/tmp/easyway.db`
- **Tabelas:** teachers, students
- **Usuários padrão:** Criados automaticamente

## 🔐 Segurança

- JWT Token (24h expiry)
- CORS habilitado
- Validação de entrada
- Senhas em plain text (APENAS PARA DESENVOLVIMENTO)

## 🐛 Troubleshooting

### "Invalid credentials"
- Verificar email/senha (veja credenciais acima)
- Limpar localStorage no navegador
- Fazer login novamente

### "Database error"
- Verificar permissões de arquivo
- Verificar espaço em disco
- Reiniciar serviço

### "Cannot find module"
```bash
npm install
```

## 📝 Notas

- Este é um backend para **desenvolvimento**
- Para produção, adicionar:
  - Autenticação mais robusta
  - Validação de dados
  - Rate limiting
  - Logging
  - Backup automático
  - Senhas com hash (bcrypt)

## 🔄 Atualizar URL no Frontend

Em `easyway-website/js/api-helper.js`:

```javascript
baseURL: 'https://easyway-backend-production-4094.up.railway.app/api',
```

---

**Versão:** 2.0.0 (Com Database Initialization)
**Última atualização:** 28 de Fevereiro de 2026
