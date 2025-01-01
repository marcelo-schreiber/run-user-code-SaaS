# API para Execução de Código

[![Licença MIT](https://img.shields.io/github/license/marcelo-schreiber/run-user-code-SaaS?style=social?logo=github)](https://github.com/marcelo-schreiber/run-user-code-SaaS/blob/master/LICENSE)  
[![Status do Workflow do GitHub](https://img.shields.io/github/actions/workflow/status/marcelo-schreiber/run-user-code-SaaS/test-backend.yml?style=social?logo=github)](https://github.com/marcelo-schreiber/run-user-code-SaaS/actions/workflows/test-backend.yml)

Esta é uma API para executar códigos em diferentes linguagens, como Python, Javascript e Ruby. Ela utiliza Docker para executar o código em um ambiente seguro, evitando vulnerabilidades e brechas de segurança.

---

## Índice

- [Introdução](#introdução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executar com Docker](#executar-com-docker)
  - [Executar em Produção](#executar-em-produção)
- [Testes](#testes)
- [Referência da API](#referência-da-api)
  - [Retorna a saída de código Python](#retorna-a-saída-de-código-python)
  - [Retorna a saída de código Javascript](#retorna-a-saída-de-código-javascript)
  - [Retorna a saída de código Ruby](#retorna-a-saída-de-código-ruby)
- [Por que Docker? O que pode dar errado?](#por-que-docker-o-que-pode-dar-errado)
- [Inspirações e Referências](#inspirações-e-referências)
- [Tecnologias](#tecnologias)
- [Feedback](#feedback)

## Introdução

### Pré-requisitos

Certifique-se de ter [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/en/) instalados.

### Instalação

Na pasta do projeto, instale todas as dependências:

```bash
  npm install
```

Baixe as imagens do Docker. Certifique-se de que sua CLI do Docker funciona sem `sudo`:

```bash
  npm run pull-images
```

Inicie o servidor em modo de desenvolvimento. Cada alteração no código reiniciará o servidor:

```bash
  npm run dev
```

### Executar com Docker

Na pasta do projeto, instale todas as dependências:

```bash
  npm install
```

Baixe as imagens do Docker. Certifique-se de que sua CLI do Docker funciona sem `sudo`:

```bash
  npm run pull-images
```

Crie uma imagem Docker:

```bash
  docker build -t code-exec .
```

Execute a imagem Docker:

```bash
  docker run -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock --name code-exec code-exec
```

### Executar em Produção

Siga os passos de instalação, então execute o seguinte comando em vez de `npm run dev`:

```bash
  npm start
```

## Testes

Para executar os testes, rode o seguinte comando:

```bash
  npm test
```

Certifique-se de ter instalado todas as dependências antes de rodar os testes.

## Referência da API

### Retorna a saída de código Python

```http
  POST /run/python
```

| Parâmetro  | Tipo       | Descrição                          |
| :---------- | :--------- | :---------------------------------- |
| `code`      | `string`   | **Obrigatório**.                     |
| `input`     | `string`   | **Opcional**. `stdin` separado por `\n` |

### Retorna a saída de código Javascript

```http
  POST /run/javascript
```

| Parâmetro  | Tipo       | Descrição                          |
| :---------- | :--------- | :---------------------------------- |
| `code`      | `string`   | **Obrigatório**.                     |

### Retorna a saída de código Ruby

```http
  POST /run/ruby
```

| Parâmetro  | Tipo       | Descrição                          |
| :---------- | :--------- | :---------------------------------- |
| `code`      | `string`   | **Obrigatório**.                     |
| `input`     | `string`   | **Opcional**. `stdin` separado por `\n` |

## Por que Docker? O que pode dar errado?

Com a intenção de executar o código do usuário de forma segura, garante-se que o usuário não terá interação com dados e arquivos do servidor. Para evitar vulnerabilidades como:

```python
import os
os.system('shutdown -f') # desliga o servidor
```

ou

```javascript
while (true) {} // loop infinito
```

ou

```ruby
File.delete('important_file.txt') # exclui um arquivo
```

**Com cada requisição do usuário**, um **container** é criado (semelhante a uma máquina virtual) e fechado ao final da execução do programa ou após 3 segundos, evitando loops infinitos.

Outras vulnerabilidades, como instalação de arquivos ou saída do container, são mitigadas ao limitar o uso de memória RAM e processamento. Também são removidos privilégios, conexão de rede e escrita no disco (mesmo dentro do container). Assim, grande parte das fraquezas é eliminada, especialmente com medidas adicionais, como rate limiter (por IP, Path, etc.), load balancer, sistema de filas para execução concorrente e outras proteções de segurança.

## Inspirações e Referências

- [Tim Nolet](https://www.freecodecamp.org/news/running-untrusted-javascript-as-a-saas-is-hard-this-is-how-i-tamed-the-demons-973870f76e1c/) - [@FreeCodeCamp](https://www.freecodecamp.org/)
- [Codex API](https://github.com/Jaagrav/CodeX-API) - [Jaagrav](https://github.com/Jaagrav)

## Tecnologias

- [Docker](https://www.docker.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Vitest](https://vitest.dev/)

## Feedback

Se você tiver algum feedback, entre em contato em `marcelorissette15@gmail.com`
