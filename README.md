# TodoApp

Este projeto é uma aplicação de lista de tarefas (Todo) feita em Angular, com autenticação JWT e integração com uma API REST.

## Pré-requisitos

- Node.js 18+
- Angular CLI (`npm install -g @angular/cli`)
- Backend API rodando em `http://localhost:3000` (veja instruções do backend)

## Instalação

1. Clone o repositório e acesse a pasta do projeto:

   ```bash
   git clone <url-do-repo>
   cd todo_app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Certifique-se de que o backend está rodando em `localhost:3000`.

## Proxy para API

O projeto utiliza um arquivo `proxy.conf.json` para redirecionar as chamadas `/api` para o backend.  
O arquivo já está configurado para uso local.

## Rodando o projeto

Para iniciar o servidor de desenvolvimento com proxy:

```bash
npm start
```

Acesse [http://localhost:4200](http://localhost:4200) no navegador.

## Estrutura de pastas

- `src/app/components/login` — Tela de login
- `src/app/components/register` — Tela de cadastro
- `src/app/components/task` — Tela de tarefas

## Funcionalidades

- Cadastro e login de usuário (com validação de campos)
- Lista de tarefas pendentes
- Marcar tarefa como concluída (risca e atualiza)
- Criar, editar (clicando no nome), excluir tarefas (ícone de X)
- Prioridades coloridas (Alta/Vermelha, Média/Laranja, Baixa/Verde)
- Botão de logout (ícone de sair)
- Adicionar tarefa (ícone de +)
- Notificações toast para ações

## Observações

- O token JWT é salvo no `localStorage` após login.
- Todas as requisições à API passam o token no header.

## Dicas

- Se precisar alterar o endereço do backend, edite o arquivo `proxy.conf.json`.
- Atualize os imports caso mova componentes entre pastas.

## Recursos

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Documentação oficial Angular](https://angular.dev/)