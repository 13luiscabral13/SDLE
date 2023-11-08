# Design Choices

## Topics

- [1. Technology](#1-technology)
- [2. Local First](#2-local-first)
    - [2.1 Client Request Management](#21-client-request-management)
    - [2.2 Fault tolerance](#22-fault-tolerance)
    - [2.3 Cloud connection](#23-cloud-connection)
- [3. Cloud](#cloud)
- [4. CRDT](#crdt)
- [5. References](#references)
- [6. Members](#members)

## 1. Technology

Selected client-side technologies prioritize simplicity and user-friendliness, emphasizing a seamless experience, particularly in web applications where ease of installation and use is crucial. The chosen technologies are:

- `Node.js`, for client and server side applications;
- `SQLite3`, for database management system;

This ensures the project runs seamlessly with straightforward commands:

```bash
$ node client.js <PORT>     # client
$ node proxy.js             # proxy
$ node server.js <PORT>     # server
```

Furthermore, selected technologies and libraries will be employed for the implementation of distributed system connections, cloud infrastructure management, and the maintenance of integrity and consistency:

- `ZeroMQ.js`, for high-performance asynchronous messaging;
- `UUID`, for the generation of unique identifiers across the entire system;

## 2. Local First

![Local First Schema](../imgs/Local.png)
<p align=center>Figure 1: Local First Approach</p>

The primary focus initially is to attain a `Local First` [1] behavior. To achieve this, persisting data from recognized lists is crucial. In the initial phase, the web application checks for the existence of a local database:

- If present, loads its content (lists and items);
- If absent, creates an empty database following the predefined schema presented in [Figure 2];

![Database schema](../imgs/Schema.png)
Figure 2: Database schema

Note that the boolean attribute changed is crucial for identifying, in adverse conditions, which lists or items have been modified by the client but are not yet in the cloud backup. 

To enable the sharing of shopping lists between users, two requirements must be met simultaneously when they are created:

- The list must be instantiated locally, following the Local First approach;
- The URL must be unique throughout the system and serve as the identifier for that specific list;

If the URL construction relies on the list name and/or creation timestamp, conflicts may arise in the system. To address this concern, a potential implementation is based on `UUIDs`[2]. UUIDs (Universally Unique Identifiers) are globally unique identifiers that ensure uniqueness throughout the system. In our case, we will opt to use version 4 UUIDs, which provide a high probability of uniqueness as they are based on random data. This makes them suitable for generating unique URLs in a distributed system where nodes cannot communicate initially.

O sistema terá

O sistema terá em si três threads a correr em simultâneo. 

### 2.1 Client Request Management



### 2.2 Fault tolerance

The web application will periodically store the manipulated information in the local file. This way, even if there is an error in the application or connectivity issues, most, if not all, of the user's changes will be saved.

### 2.3 Cloud connection

In general, the approach previously described will make the web application function well, even without a connection to the cloud and, therefore, without the ability to back up or transfer information. For this purpose, the application will periodically attempt to establish a connection with the cloud and will run two more threads:

- Updating local information according to what is received from the cloud;
- Sending modified local information to the cloud to propagate it throughout the system;

### 2.4 Concurrency



#### ACID 

Since the client-side system involves multithreading, it is necessary to establish concurrency control to achieve the ACID properties (atomicity, consistency, isolation, durability) of the local database. o achieve this, we will use SQLite3 transactions for each operation.

## Cloud

Intro. TODO.

### Server-side fault tolerance

TODO.

## References

- [Local First](https://www.inkandswitch.com/local-first/)
- [ZeroMQ.js](https://github.com/zeromq/zeromq.js#examples)
- [uuid](https://www.npmjs.com/package/uuid)
- 

## Members

- André Costa, up201905916@up.pt
- Bárbara Carvalho, up202004695@up.pt
- Fábio Sá, up202007658@up.pt
- Luís Cabral, up202006464@up.pt

#### T05, SDLE 2023/24