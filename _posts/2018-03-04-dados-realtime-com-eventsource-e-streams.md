---
layout: post
title: "Dados em Realtime com Event Source e Streams"
description: Obtendo dados realtime com Event Source e Streams.
image: 'https://imgur.com/Arx6MNe'
category: ['nodejs', 'servidores', 'arquitetura', 'realtime']
twitter_text: "Dados em Realtime com Event Source e Streams."
introduction: 'Quando existe a necessidade de obter dados em realtime, talvez executar várias requisições em intervalos curtos seja uma má idéia por questões de sobrecarga de memória e processamento, essas não só da parte do cliente mas também do servidor. Para evitar transtornos podemos optar por sistemas de notificações de dados, entre eles o PubSub via Websockets ou EventSource/Stream. Neste artigo vou falar sobre o EventSource Stream. '
---
Quando existe a necessidade de obter dados em realtime, talvez executar várias requisições em intervalos curtos seja uma má idéia por questões de sobrecarga de memória e processamento, essas não só da parte do cliente mas também do servidor. Para evitar transtornos podemos optar por sistemas de notificações de dados, entre eles o **PubSub via WebSockets** ou **EventSource/Stream**. Neste artigo vou falar sobre o **EventSource/Stream**.

Durante o desenvolvimento da **API** na empresa em que trabalho, para facilitar a comunicação entre o administrativo e a **API**, cogitei várias soluções para que os dados entregues em realtime não sobrecarregassem a mesma ou o navegador em que o administrativo estivesse sendo executado. Entre as principais estavam um sistema de notificações usando **WebSockets (PubSub)** e o **EventSource/Stream**. No caso do PubSub, o **API Gateway** da **Amazon** não suporta **WebSockets**, algo semelhante pode ser implementado usando outros recursos da AWS como o **SNS** ou o **SQS**. Porém por já ter configurado o **DynamoDBStreams** para disparar eventos para a API sempre que algo fosse incluído no banco de dados **DynamoDB** e pela questão de não precisar de algo bi-direcional como o **PubSub**, resolvi optar por utilizar outro recurso: o **EventSource/Stream**.

Usando um esquema desse tipo, você precisa puxar todos os dados da **API** uma uníca vez e sempre que houver atualizações você incluir no cache local apenas o novo item notificado pelo **Stream**. A grande vantagem desse recurso é que o Stream é manipulado diretamente no navegador e o cliente apenas precisa conectar-se ao mesmo para receber as mensagens de atualização. Dessa forma fica bem simples saber quando um item foi incluído, editado ou excluído do banco; ou quando o cliente deve realizar alguma ação.

## Emitindo um Stream no servidor
Para exemplificar a implementação do recurso de emissão de **Streams**, vamos montar um pequeno servidor em `NodeJS`, no exemplo abaixo estou usando a porta 3000 para acesso http.
```
var http = require('http');
http.createServer(function(req, res) {
  // Headers do Servidor HTTP que serão entregues
  headers = {'Content-Type': 'text/plain'}
  // Define o Status de Resposta e os Headers
  res.writeHead(200, headers);
  // Define a resposta
  res.write('Hello World');
  res.end();
}).listen(3000);
```

### Criando um endpoint para os streams
Agora que já temos um servidor de base para implementar nosso **Stream**, é importante que tenhamos um `endpoint` ou rota exclusiva para o acesso dos **Streams**. Dessa forma podemos diferencia-lo do que é seria conteúdo "normal" do servidor. Para criar o `endpoint` é importante que os headers passados pelo cliente contenham o parametro `accept` com o mime-type: `text/event-stream`; e que a url requisitada seja nosso endpoint em `/streams`. Caso contrário o conteúdo "normal" do servidor será exibido.
```
var http = require('http');
http.createServer(function(req, res) {
  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    if (req.url == '/streams') {
      // Conteúdo do Stream
    }
  }
  else {
    // Headers do Servidor HTTP que serão entregues
    headers = {'Content-Type': 'text/plain'}
    // Define o Status de Resposta e os Headers
    res.writeHead(200, headers);
    // Define a resposta
    res.write('Hello World');
    res.end();
  }
}).listen(3000)
```

### A Emissão
Agora que temos o servidor e o endpoint configurado para o acesso. Vamos emitir dados ramdomicos de forma ciclíca (a cada 5 segundos) para popular nosso stream.
```
var http = require('http');
http.createServer(function(req, res) {
  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    if (req.url == '/streams') {
      meusStreams(req, res);
    }
    else {
     res.writeHead(404); // Erro 404 caso tente acessar outro nó usando o content-type text/event-stream
     res.end();
    }
  }
  else {
    // Headers do Servidor HTTP que serão entregues
    headers = {'Content-Type': 'text/plain'}
    // Define o Status de Resposta e os Headers
    res.writeHead(200, headers);
    // Define a resposta
    res.write('Hello World');
    res.end();
  }
}).listen(3000)

function meusStreams(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var id = 'novo_stream'; // Cria um id randomico baseado no timestamp

  // Envia uma notificação de stream a cada 5 segundos
  setInterval(function() {
    res.write('id: ' + id + '\n');
    res.write("data: " + new Date()).toLocaleTimeString() + '\n\n');
  }, 5000);

  // Envia a primeira notificação
  res.write('id: ' + id + '\n');
  res.write("data: " + new Date()).toLocaleTimeString() + '\n\n');  
}
```

Pronto, nosso primeiro servidor com emissão de streams está concluído, no exemplo acima usei um formato de relógio mas você pode usar outros dados e criar outros ids de notificação para cada ação que desejar.

## Recebendo os Streams no navegador
Receber os streams no navegador é uma tarefa fácil graças ao `EventSource()`. Para configurar uma conexão entre o navegador e nosso servidor vocẽ basicamente precisa de uma linha (pode testar no console do `Google Chrome`):
```
var source = new EventSource('/streams');
```
Vualá, estamos conectados!

### Exibindo uma mensagem ao se conectar no servidor
Para nosso exemplo ficar bonitinho podemos adcionar um `eventListener` para exibir uma mensagem assim que nos conectarmos ao nosso servidor de streams. Let's Try:
```
source.onopen = function(e) {
  document.body.innerHTML += 'Conectado... Iniciando o Relógio!' + '<br>';
};
```

### Exibindo os dados do Stream
Agora que já temos uma mensagem bonitinha para saber que estamos conectados, podemos exibir as mensagens enviadas pelo Stream usando outro eventListener.
```
source.onmessage = function(e) {
  document.body.innerHTML += e.data + '<br>';
};
```

Sensacional não? Agora temos dados realtime com baixo consumo de rede, memória e processamento. Adeus Sobrecargas.
Espero que tenham gostado e até a próxima! ;)
