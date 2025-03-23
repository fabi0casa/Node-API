# Gerenciamento de Jogos - Node.js  <img src= "https://github.com/user-attachments/assets/f1489fbb-d95f-4556-ad6c-2925080948ab" style="height: 60px;">

Este é um projeto de uma loja de jogos online desenvolvido com Node.js, Express e MongoDB. O objetivo do projeto é permitir o gerenciamento de jogos em uma plataforma onde 
o usuário pode adicionar, listar, atualizar e deletar jogos. Além disso, o projeto inclui uma interface simples usando `.ejs`, com estilização básica.

Este projeto foi desenvolvido puramente por curiosidade e para testar a tecnologia Node.js. Não há compromisso com a manutenção ou desenvolvimento contínuo deste projeto, 
ele é apenas um experimento pessoal para explorar a stack e entender melhor suas funcionalidades.


## Funcionalidades

- **Cadastro de Jogos:** Permite adicionar novos jogos à loja com informações como título, descrição, preço, gênero, plataforma, estoque e imagem.
- **Listagem de Jogos:** Exibe todos os jogos cadastrados, com a possibilidade de visualizar detalhes sobre cada jogo.
- **Edição de Jogos:** Permite editar as informações de um jogo existente.
- **Exclusão de Jogos:** Permite excluir jogos da loja.

## Tecnologias Utilizadas

- **Node.js:** Ambiente de execução JavaScript do lado do servidor.
- **Express:** Framework web para Node.js.
- **MongoDB:** Banco de dados NoSQL para armazenar informações sobre os jogos.
- **EJS (Embedded JavaScript):** Motor de template para renderizar HTML no servidor.

## Como rodar o Projeto?

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/loja-de-jogos.git
cd loja-de-jogos
```

### 2. Instale as dependências
Execute o comando abaixo para instalar as dependências do projeto:

```bash
npm install
```

### 3. Configuração do MongoDB
Certifique-se de ter uma instância do MongoDB em execução ou configure uma conexão com o MongoDB Atlas (cloud).

Crie um arquivo chamado `.env` na raiz do projeto e adicione a variável de ambiente `MONGODB_URI`

da seguinte maneira:
```.env
MONGODB_URI=<SeuLinkDeConexaoAoBanco>
```

### 4. Execute o Projeto
Abra um terminal na raiz do projeto e insira o comando:
```bash
npm run dev
```

## Aprimoramentos Futuros

Embora este projeto esteja funcional em sua forma atual, há várias melhorias planejadas para o futuro:

- **Integração com React:** A principal melhoria será a adição do React para o frontend.
- **Otimização de mensagens:** Atualmente o sistema não exibe mensagens de erro ou de sucesso no front-end, por mais que tenha havido uma tentativa.
- **Aprimoramento na UI/UX:** Melhorias no design da interface para uma experiência de usuário mais fluida e intuitiva.
