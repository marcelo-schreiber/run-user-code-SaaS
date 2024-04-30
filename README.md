# API For Python Execution

<p id="start" align="center">
<a href="#start">
  <img height="130rem" align="center" src="https://raw.githubusercontent.com/marcelo-schreiber/run-user-code-SaaS/master/img/logo.jpg" alt="logo">
</a>
<br>
<br>
<a href="https://github.com/marcelo-schreiber/run-user-code-SaaS/blob/master/LICENSE.md">
  <img src="https://img.shields.io/github/license/marcelo-schreiber/run-user-code-SaaS?style=for-the-badge"  align="center" alt="License MIT" />
</a>
</p>

## Table of Contents

* [Getting Started](#getting-started)
  * [Pre requisites](#pre-requisites)
  * [Installation](#installation)
  * [Run with docker](#run-with-docker)
  * [Run in production](#run-in-production)
* [Testing](#testing)
* [API Reference](#api-reference)
  * [Returns python code output](#returns-python-code-output)
* [Why Docker? What could go wrong?](#why-docker-what-could-go-wrong)
* [Inspirations and References](#inspirations-and-references)
* [Technologies](#technologies)
* [Feedback](#feedback)

## Getting Started

### Pre requisites

Make sure you have [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/en/) Installed.

### Installation

Pull the 3.9-slim python image

```bash
  docker image pull python:3.9-slim
```

Install all dependencies

```bash
  npm i
```

Start the server in development mode, every change in the code will restart the server

```bash
  npm run dev
```

Your server will be running at `http://localhost:3000`. You can test it with the following command:

```bash
  curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{"code": "print('Hello, World!')"}'
```

### Run with docker

Pull the 3.9-slim python image

```bash
  docker image pull python:3.9-slim
```

Create a docker image

```bash
  docker build -t python-exec .
```

Run the docker image

```bash
  docker run -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock --name python-exec python-exec
```

### Run in production

```bash
  npm start
```

## Testing

To run the tests, run the following command:

```bash
  npm test
```

## API Reference

### Returns python code output

```http
  POST /
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

```python
while True: 
    pass # A thread is blocked forever
```

**With each user request**, a **container** is created (similar to a virtual machine) which closes at the end of the program execution or after 3 seconds.
Avoiding infinite loops and file deletion on the server.
  
Other possible vulnerabilities such as file installation or container exits are escaped by limiting RAM memory, processing. Also, It removes privileges, network and disk writes (even within the container).
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
