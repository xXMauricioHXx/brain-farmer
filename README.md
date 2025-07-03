# Brain Farmer

API em NestJS para gerenciamento de produtores rurais, fazendas e outros recursos relacionados.

[![Coverage Status](https://img.shields.io/badge/coverage-XX%25-brightgreen)](#coverage-report)

---

## 🔎 Descrição

Este projeto oferece endpoints REST para gerir produtores e fazendas, com suporte a criação, listagem, atualização e deleção(soft-delete).

### Invariantes de domínio

- Um produtor rural deve ter um `document` único e válido entre registros _ativos_.
- A soma da área agricultável e de vegetação não deve ultrapassar o a área total da fazenda.

---

## 🛠️ Setup local

### Com Node.js (sem Docker)

1. Clone o repositório:

   ```bash
    git clone https://github.com/xXMauricioHXx/brain-farmer.git
    cd brain-farmer

   ```

2. Instale dependências:

```bash
  npm install
```

3. Configure variáveis de ambiente (.env).

4. Ajuste banco (ex: configure PostgreSQL local) e rode as migrations:

```bash
  npm run typeorm migration:run
```

5. Inicie a API:

```bash
    npm run start:dev
```

### Com Docker

1. Instale Docker & Docker Compose.

2. Ajuste .env se necessário.

3. Inicie:

```bash
docker-compose up --build
```

4. A API estará rodando em http://localhost:3000.

### Testes & Coverage

1. Executar testes:

```bash
npm run test
```

2. Gerar cobertura:

```bash
npm run test:cov
```

3. Visualizar relatório em coverage/lcov-report/index.html.

### Endpoints principais & Fluxos

Consulte a documentação completa em `/api`.

| Método | Rota                   | Descrição                                 |
| ------ | ---------------------- | ----------------------------------------- |
| POST   | `/rural-producers`     | Cria produtor rural                       |
| GET    | `/rural-producers`     | Lista produtores (somente ativos)         |
| DELETE | `/rural-producers/:id` | Soft-delete de produtor                   |
| POST   | `/farms`               | Cria fazenda (precisa de produtor válido) |
| GET    | `/farms`               | Lista fazendas                            |
| DELETE | `/farms/:id`           | Remove fazenda                            |
