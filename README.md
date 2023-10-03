nestjs-langchain-chatbot
========================

This is of a ChatBot using HTTP streaming with LangChain and NestJs. Its turbo repo mono repo with a frontend react client and a backend nestjs server.

## Installation and Usage

You need docker running on your machine for the database.
You also need an OpenApi api key
Copy .env.dist file to .env and fill in your OpenApi api key

```bash
yarn install
yarn dev
```

The React client should now be available at http://localhost:5173/

## CLI

To interact with the chatbot in the terminal, from the api directory, run:

```bash
yarn chat
```

