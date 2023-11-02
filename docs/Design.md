# Design Choices

## Topics

- [Technology](#technology)
- [Local First](#local-first)
    - [Main design]()
    - [Database]()
    - [Fault Tolerance]()
- [Cloud]()
    - [CRDT]()
    - [Sharding]()
- [References]()

## Technology

We have selected the technologies for our project with a strong focus on simplicity and user-friendliness. Our goal is to create a seamless experience for our users, particularly in web applications, where ease of installation and use is paramount. Therefore, the technologies used were: 

- `Node.js` for client and server side applications;
- `SQLite3` for database management system;

This way, our project can be run with simple commands

```bash
$ node client.js <PORT>
$ node proxy.js <PORT_CLIENTS> <PORT_SERVERS>
$ node server.js <PORT>
```

## Local First



![](../imgs/Local.png)


### Database

Controlo de concorrência. Locks or transactions.

### Fault Tolerance



## Cloud

## References


## Members




https://app.diagrams.net/?title=SDLE&client=1#G1agWQFztshaIb5v3dHwP1MBTlk_1rd5jp