const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require('zeromq');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//Enviar cart para um vizinho
async function updateNeighboor(neighborPort, cart) {
    //Servidor atual conecta-se ao vizinho
    const requester = new zmq.Request;
    requester.connect(`tcp://localhost:${neighborPort}`);
    console.log(`\nSending update to server ${neighborPort} => cart=${cart}`);

    // Servidor atual envia cart ao vizinho
    requester.send(cart);

    // Define um timeout para esperar pela resposta do servidor vizinho
    const timeoutId = setTimeout(() => {
      console.error(`Timeout waiting for ACK from server ${neighborPort}`);
      return -1;
    }, 3000);
    
    // Espera pela resposta do servidor vizinho
    while (true) {
      const [response] = await requester.receive();
      clearTimeout(timeoutId);
      console.log(`Received ACK from server ${neighborPort}`);
      requester.close();
      break;
    }

    return 0;
}

//Enviar cart para todos os vizinhos
async function updateAllNeighboors(httpPort, cart) {
    let skip = 0;
    for(let i=0; i<config.neighbors; i++) {
        let pos = config.servers.indexOf(parseInt(httpPort));
        let neighbor = config.servers[(pos + i + skip + 1) % config.servers.length];

        const success = await updateNeighboor(neighbor, cart);

        if(success === -1) {
            console.log("Failed to update neighbor");
            skip += 1;
        }
    }
}

async function listeningToUpdates(httpPort) {
    const responder = new zmq.Reply();
    await responder.bind(`tcp://127.0.0.1:${httpPort}`);
    console.log(`Listening for updates on port ${httpPort}`);

    while (true) {
        // Worker thread recebe update vindo de outro server
        const messages = await responder.receive();

        if (messages.length > 0) {
            const [request] = messages;
            console.log(`\nReceived update: [${request.toString()}]`);

            // Worker thread avisa a main thread de que recebeu um novo update e precisa de fazer merge do cart
            parentPort.postMessage({ type: 'updateCart', cart: request.toString()});
        }
        // Envia acknowledgement para o server que enviou o update
        responder.send("ACK");
    }
}

if (!isMainThread) {
    let { httpPort } = workerData;

    // Worker thread está atenta a updates mandados por outros servers
    listeningToUpdates(httpPort);

    parentPort.on('message', async (message) => {
        if(message.type === "updateNeighbors") {
            updateAllNeighboors(httpPort, message.cart);
        }
    })
}