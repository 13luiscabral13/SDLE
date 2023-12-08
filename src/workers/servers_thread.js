const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require('zeromq');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

let skip = 0;
let updated = 0;
let timedOut = false;

//Enviar cart para um vizinho
async function updateNeighboor(neighborPort, cart) {
    //Servidor atual conecta-se ao vizinho
    const requester = new zmq.Request;
    requester.connect(`tcp://localhost:${neighborPort}`);
    console.log(`\nSending update to server ${neighborPort}`);

    // Servidor atual envia cart ao vizinho
    requester.send(cart);

    // Promessa para o timeout
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Task timeout error happened'));
        }, 2000);
    });

    try {
        // Espera pela resposta do servidor vizinho ou timeout
        const [response] = await Promise.race([requester.receive(), timeoutPromise]);

        console.log(`Received ACK from server ${neighborPort}`);
        updated++;
    } catch (error) {
        console.error(error.message);
        skip++;
    } finally {
        // Certifique-se de fechar o socket após o uso
        requester.close();
    }
}

//Enviar cart para todos os vizinhos
async function updateAllNeighboors(httpPort, cart) {
    skip = 0;
    updated = 0;
    while (updated !== config.neighbors) {
        let pos = config.servers.indexOf(parseInt(httpPort));
        let neighbor = config.servers[(pos + updated + skip + 1) % config.servers.length];

        if(neighbor === parseInt(httpPort)) {
            skip++;
        }

        await updateNeighboor(neighbor, cart);
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
            console.log(`\nReceived update`);

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
            await updateAllNeighboors(httpPort, message.cart);
        }
    })
}