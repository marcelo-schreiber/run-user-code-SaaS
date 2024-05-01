# API For Code Execution

[![MIT License](https://img.shields.io/github/license/marcelo-schreiber/run-user-code-SaaS?style=social?logo=github)](https://github.com/marcelo-schreiber/run-user-code-SaaS/blob/master/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/marcelo-schreiber/run-user-code-SaaS/test-backend.yml?style=social?logo=github)](https://github.com/marcelo-schreiber/run-user-code-SaaS/actions/workflows/test-backend.yml)

This is an API for running code in different languages, such as Python, Javascript and Ruby. It uses Docker to run the code in a safe environment, avoiding vulnerabilities and security breaches.

## Getting Started

### Pre requisites

Make sure you have [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/en/) Installed.

### Installation

In the project folder, install all dependencies:

```bash
  npm install
```

Pull the docker images, make sure your docker cli works without sudo:

```bash
  npm run pull-images
```

Start the server in development mode, every change in the code will restart the server:

```bash
  npm run dev
```

### Run with docker

In the project folder, install all dependencies:

```bash
  npm install
```

Pull the docker images, make sure your docker CLI works without sudo:

```bash
  npm run pull-images
```

Create a docker image:

```bash
  docker build -t code-exec .
```

Run the docker image:

```bash
  docker run -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock --name code-exec code-exec
```

### Run in production

Follow the installation steps, then run the following command instead of `npm run dev`:

```bash
  npm start
```

## Testing

To run the tests, run the following command:

```bash
  npm test
```

Make sure you have installed all dependencies before running the tests.

## API Reference

### Returns python code output

```http
  POST /run/python
```

| Paramter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `code` | `string` | **Mandatory**.|
| `input` | `string` | **Optional**. `stdin` separated by `\n`|

### Returns javacript code output

```http
  POST /run/javascript
```

| Paramter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `code` | `string` | **Mandatory**.|

### Returns ruby code output

```http
  POST /run/ruby
```

| Paramter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `code` | `string` | **Mandatory**.|
| `input` | `string` | **Optional**. `stdin` separated by `\n`|

## Why Docker? What could go wrong?

With the intention of running the user's code safely, it is understood that the user will not be able to have any interaction with the data and files on the server.
In this sense, to avoid a vulnerability such as:

```python
import os
os.system('shutdown -f') # shutdown the server
```

or

```javascript
while (true) {} // infinite loop
```

or

```ruby
File.delete('important_file.txt') # delete a file
```

**With each user request**, a **container** is created (similar to a virtual machine) which closes at the end of the program execution or after 3 seconds, avoiding infinite loops.
  
Other possible vulnerabilities such as file installation or container exits are escaped by limiting RAM memory and processing. Also, It removes privileges, network and disk writes (even within the container).
In this way, a large part of the weaknesses are removed, especially in conjunction with a rate limiter (by IP, by Path, etc), load balancer, a queue system such that the server can run more than one container at a time and other security measures.

## Inspirations and References

* [Tim Nolet](https://www.freecodecamp.org/news/running-untrusted-javascript-as-a-saas-is-hard-this-is-how-i-tamed-the-demons-973870f76e1c/) - [@FreeCodeCamp](https://www.freecodecamp.org/)
* [Codex API](https://github.com/Jaagrav/CodeX-API) - [Jaagrav](https://github.com/Jaagrav)

## Technologies

* [Docker](https://www.docker.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Vitest](https://vitest.dev/)

## Feedback

If you have any feedback, please reach out at `marcelorissette15@gmail.com`
