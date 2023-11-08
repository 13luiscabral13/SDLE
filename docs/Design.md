# Design Choices

## Topics -> TODO: rever isto em forma de relatório, pode ter subsecções ou não...

- [Technology](#technology)
- [Local First](#local-first)
    - [Overview](#overview)
    - [Client-side fault tolerance](#client-side-fault-tolerance)
    - [Cloud connection](#cloud-connection)
    - [Database](#database)
        - [Schema](#schema)
        - [ACID](#acid)
- [Cloud](#cloud)
    - [CRDT]()
    - [Sharding]()
    - [Server-side fault tolerance](#server-side-fault-tolerance)
- [References](#references)
- [Members](#members)

## Technology

We have selected the technologies for our project with a strong focus on simplicity and user-friendliness. Our goal is to create a seamless experience for our users, particularly in web applications, where ease of installation and use is paramount. Therefore, the technologies used were: 

- `Node.js` for client and server side applications;
- `SQLite3` for database management system;
- `ZeroMQ.js` for high-performance asynchronous messaging;
- // Adicionar UUID em Node js, se se verificar seguro;

This way, our project can be run with simple commands:

```bash
$ node client.js <PORT>     # client
$ node proxy.js             # proxy
$ node server.js <PORT>     # server
```

## Local First

![Local First Schema](../imgs/Local.png)
<p align=center>Figure 1: Local First Approach</p>

### Overview

The initial priority is to achieve a "Local First" behavior for the application. To do this, it's important to persist data from known lists. In the first phase, the web application will check if a local database exists:

- If it exists, it loads its content (lists and items);
- If it doesn't exist, it creates an empty one based on the pre-established [schema](#schema);

All subsequent user interactions with the application will be controlled by the main thread, which is also responsible for [client-side fault tolerance](#client-side).

To enable the sharing of shopping lists between users, two requirements must be met simultaneously:

- The list must be instantiated locally, following the Local First approach;
- The URL must be unique throughout the system and serve as the identifier for that specific list;

Se o URL for construído baseado no list name e/ou no timestamp da criação, poderá haver conflitos no sistema. Por esse motivo, uma possível implementação baseia-se em UUIDs. UUIDs são identificadores únicos globalmente que garantem exclusividade em todo o sistema. No nosso caso, iremos optar por usar a versão 4, que garante alta probabilidade de unicidade, pois é baseada em dados aleatórios, tornando-a adequada para a geração de URLs únicos em um sistema distribuído onde os nós não podem se comunicar inicialmente.

If the URL were just  list name, there would likely be conflicts in the system. However, adding entropy from a creation timestamp doesn't necessarily solve the issue, as there could be situations where two users instantiate two lists with the same name at the same time. Therefore, the entropy of a random string is added to potentially create a unique URL in the system:

```js
const { v4: uuidv4 } = require('uuid');
let url = baseUrl + uuid4();
```

### Client-side fault tolerance

The web application will periodically store the manipulated information in the local file. This way, even if there is an error in the application or connectivity issues, most, if not all, of the user's changes will be saved.

### Cloud connection

In general, the approach previously described will make the web application function well, even without a connection to the cloud and, therefore, without the ability to back up or transfer information. For this purpose, the application will periodically attempt to establish a connection with the cloud and will run two more threads:

- Updating local information according to what is received from the cloud;
- Sending modified local information to the cloud to propagate it throughout the system;

### Database

#### Schema

![Database schema](../imgs/Schema.png)

In addition to the standard attributes, we've chosen to add two more:

- `timestamp` - this allows you to view the timestamp of the item or list's creation or last modification. It is relevant if **Last-Writer-Wins** is necessary.
- `changed` - a boolean that indicates whether the item or list has been modified since the last sync with the cloud. This is relevant because it ensures that only the modified contents are sent to the cloud, reducing bandwidth usage.

#### ACID 

Since the client-side system involves multithreading, it is necessary to establish concurrency control to achieve the ACID properties (atomicity, consistency, isolation, durability) of the local database. o achieve this, we will use SQLite3 transactions for each operation.

## Cloud

Intro. TODO.

### Server-side fault tolerance

TODO.

## References

- [Local First](https://www.inkandswitch.com/local-first/)
- [ZeroMQ.js](https://github.com/zeromq/zeromq.js#examples)

# For US

- [Diagrams](https://app.diagrams.net/?title=SDLE&client=1#G1agWQFztshaIb5v3dHwP1MBTlk_1rd5jp)

## Members

- André Costa, up201905916@up.pt
- Bárbara Carvalho, up202004695@up.pt
- Fábio Sá, up202007658@up.pt
- Luís Cabral, up202006464@up.pt