<div align="center">
  <h1 align="center" style="color: #3b6eea; font-size: 50px;">Zetta Calendar 📅</h1>
</div>

<p align="center">
  <em>Reserva inteligente de salas de reunião — elimine conflitos de agendamento na sua empresa.</em>
</p>

<br>

## O Problema que Resolve

Em ambientes corporativos, a falta de um sistema centralizado para reserva de salas gera conflitos frequentes — duas equipes marcando a mesma sala no mesmo horário, reuniões canceladas de última hora e perda de produtividade.

O **Zetta Calendar** nasceu para resolver esse problema. Com ele, qualquer colaborador pode reservar uma sala de reunião e visualizar em tempo real quais horários e salas já estão ocupados.

## Índice

- [O Problema que Resolve](#o-problema-que-resolve)
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Testes](#testes)
- [Começando](#começando)

## Sobre o Projeto

O **Zetta Calendar** é um sistema de reserva de salas de reunião desenvolvido pela **Zetta** para solucionar a desorganização de horários em ambientes corporativos.

A solução oferece uma interface moderna e intuitiva onde os colaboradores conseguem verificar a disponibilidade das salas em tempo real, fazer reservas com poucos cliques e garantir que o restante da equipe já visualize imediatamente o horário como ocupado. Sem planilhas compartilhadas, sem grupos de WhatsApp, sem conflitos.

## Funcionalidades

**Reserva de Salas**

- [x] Reserva de salas por data, horário de início e fim
- [x] Visualização de disponibilidade em tempo real
- [x] Prevenção automática de conflitos de agendamento
- [x] Criação, edição e cancelamento de reservas

**Calendário & Visualização**

- [x] Visualização mensal, semanal e diária
- [x] Categorização de compromissos
- [x] Interface responsiva para desktop e mobile

**Autenticação & Segurança**

- [x] Cadastro e login seguro de usuários
- [x] Proteção de rotas e sessões autenticadas

**Qualidade & Testes**

- [x] Testes unitários com Jest
- [x] Conversão e validação de horários (`timeToMinutes`, `isValidTimeRange`)
- [x] Detecção de conflitos de reserva (`checkTimeConflict`)
- [x] Geração de slots e opções de horário (`generateTimeSlots`, `getTimeOptions`)
- [x] Formatação de datas em pt-BR (`formatDate`)

## Stack Tecnológica

| Tecnologia                                          | Descrição                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| **[Next.js](https://nextjs.org/)**                  | Framework React com SSR/SSG e otimizações avançadas de performance |
| **[Better Auth](https://www.better-auth.com/)**     | Autenticação completa e segura para aplicações modernas            |
| **[Prisma](https://www.prisma.io/)**                | ORM robusto para consultas rápidas e intuitivas ao banco de dados  |
| **[Tailwind CSS](https://tailwindcss.com/)**        | Framework CSS utilitário para layouts responsivos e customizáveis  |
| **[Shadcn/ui](https://ui.shadcn.com/)**             | Componentes pré-construídos e acessíveis baseados em Tailwind      |
| **[React Hook Form](https://react-hook-form.com/)** | Gerenciamento de formulários performático e flexível               |
| **[Zod](https://zod.dev/)**                         | Validação de esquemas TypeScript-first                             |
| **[Jest](https://jestjs.io/)**                      | Framework de testes unitários em JavaScript/TypeScript             |

## Testes

O projeto utiliza **[Jest](https://jestjs.io/)** para garantir a confiabilidade das funcionalidades principais.

### Executar os testes

```sh
# Rodar todos os testes
npm run test

# Rodar em modo watch (reexecuta ao salvar)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### O que é testado

Todos os testes estão em `reservation-utils.test.ts` e cobrem as funções utilitárias do arquivo `lib/reservation-utils.ts`:

| Função              | Casos de teste                                                        |
| ------------------- | --------------------------------------------------------------------- |
| `timeToMinutes`     | Conversão de string `HH:MM` para minutos totais                       |
| `isValidTimeRange`  | Valida faixa mínima de 30min, horário mínimo 07:00 e ordem início/fim |
| `getTimeOptions`    | Geração da lista de opções de horário (inclui 07:00 até 17:00+)       |
| `formatDate`        | Formatação de datas no padrão pt-BR (`dd/mm/aaaa`)                    |
| `checkTimeConflict` | Detecção de sobreposição de reservas por sala e data                  |
| `generateTimeSlots` | Geração de slots de 30 em 30 minutos a partir de 07:00                |

## Começando

### Pré-requisito

Antes de começar a usar o projeto, certifique-se de que seu ambiente atenda aos seguintes requisitos:

- **Node.js** (versão 18 ou superior)
- **Git** (para clonar o repositório)
- **Banco de Dados Relacional** — recomenda-se PostgreSQL
- **Gerenciador de Pacotes**: npm ou pnpm

### Instalação

**1. Clone o repositório:**

```sh
git clone https://github.com/zetta/zetta-calendar
cd zetta-calendar
```

**2. Instale as dependências:**

```sh
npm install
# ou
pnpm install
```

**3. Configure as variáveis de ambiente:**

- Crie um arquivo `.env` na raiz do projeto.
- Copie as variáveis do arquivo `.env.example` para o `.env`.
- Edite o `.env` com suas configurações (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).

**4. Configure o banco de dados com Prisma:**

```sh
npx prisma generate
npx prisma migrate dev
```

### Uso

Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

- Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Zetta

**Zetta** — Soluções corporativas de software.
