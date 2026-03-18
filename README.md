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

- [x] Cadastro e login seguro de usuários via Supabase Auth
- [x] Proteção de rotas e sessões autenticadas
- [x] Row Level Security (RLS) no banco de dados

## Stack Tecnológica

| Tecnologia                                                   | Descrição                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| **[React](https://react.dev/)**                              | Biblioteca para construção de interfaces de usuário               |
| **[Vite](https://vitejs.dev/)**                              | Build tool ultrarrápida para desenvolvimento moderno              |
| **[React Router DOM](https://reactrouter.com/)**             | Roteamento client-side para SPAs                                  |
| **[Supabase](https://supabase.com/)**                        | Backend-as-a-Service: autenticação, banco de dados e APIs REST    |
| **[Tailwind CSS](https://tailwindcss.com/)**                 | Framework CSS utilitário para layouts responsivos e customizáveis |
| **[Shadcn/ui](https://ui.shadcn.com/)**                      | Componentes pré-construídos e acessíveis baseados em Tailwind     |
| **[React Hook Form](https://react-hook-form.com/)**          | Gerenciamento de formulários performático e flexível              |
| **[Zod](https://zod.dev/)**                                  | Validação de esquemas TypeScript-first                            |

## Começando

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **Git** (para clonar o repositório)
- **Conta no [Supabase](https://supabase.com/)** (gratuita)
- **Gerenciador de Pacotes**: npm ou pnpm

### Configuração do Supabase

**1. Crie um projeto no [Supabase](https://supabase.com/).**

**2. Execute o script de migração** no **SQL Editor** do Supabase:

- Abra o arquivo `supabase/migrations/001_init.sql`
- Cole o conteúdo no SQL Editor e execute

**3. Promova o primeiro administrador** (substitua pelo seu e-mail):

```sql
UPDATE profiles SET role = 'ADMIN' WHERE email = 'admin@zetta.com.br';
```

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
- Preencha com as credenciais do seu projeto Supabase (encontradas em **Project Settings → API**):

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Uso

Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

- Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

### Deploy na Vercel

O projeto inclui `vercel.json` com as regras de rewrite para SPA. Basta conectar o repositório na Vercel e adicionar as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas configurações do projeto.

## Sobre

Desenvolvido pela **Zetta** — Soluções corporativas de software.
