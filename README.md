
# Executar código Python do usuário (API)




## Referência e inspirações

- [Tim Nolet](https://www.freecodecamp.org/news/running-untrusted-javascript-as-a-saas-is-hard-this-is-how-i-tamed-the-demons-973870f76e1c/), FreeCodeCamp
- [Documentação Dockerode](https://github.com/apocas/dockerode)
- [Codex API](https://github.com/Jaagrav/CodeX-API)

## Documentação da API

#### Retorna execução do código

```http
  POST /
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `code` | `string` | **Obrigatório**. Código|
| `input` | `string` | **Opcional**. `stdin` separado por `\n`|


## Por que Docker? O que poderia dar errado?

Com a intenção de rodar o código do usuário seguramente, entende-se que ele não poderá ter qualquer interação com os dados e arquivos do servidor.
Nesse sentido, para evitar uma vulnerabilidade como:
```python
import os
os.system('rm -rf /')
```
ou 
```python
while True: 
    pass
```
**A cada requisição** do usuário **cria-se um container**, uma 'máquina virtual', que se fecha ao final da execução do programa ou após 3 segundos.
Evitando o laço infinito e a deleção de arquivos no servidor.
  
  Outra possíveis vulnerabilidades como instalação de arquivos ou saídas do container são escapadas por meio da limitação de memória RAM, processamento e a remoção de privilégios, rede e escritas em disco (mesmo dentro do container). 
  Dessa maneira, remove-se grande parte das fragilidades, principalmente em conjunto com o rate limiter e o load balancer.

## Deploy

Para fazer o deploy desse projeto, tenha certeza de ter [Docker](https://www.docker.com/) e [Node.js](https://nodejs.org/en/) instalados, depois:

Puxe a imagem Python
```bash
  docker image pull python:latest
```
Instale as dependencias e inicie o servidor
```bash
  npm i && npm start
```

Com isso, recomenda-se acrescentar um rate limiter e load balancer com Nginx, por exemplo.



## Licença

[MIT](https://choosealicense.com/licenses/mit/)


## Stack utilizada

- [Dockerode](https://github.com/apocas/dockerode)
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Nginx](https://www.nginx.com/)


## Feedback

Se você tiver algum feedback, deixe-o em marcelorissette15@gmail.com

