const zmq = require('zeromq');

async function run() {
  const responder = new zmq.Request();

  responder.connect('tcp://localhost:5560');
  console.log('Connected to port 5560');

  while (true) {
    const [request] = await responder.receive();
    console.log(`Received request: [${request.toString()}]`);

    setTimeout(() => {
      responder.send('World');
    }, 1000);
  }
}

run().catch((err) => {
  console.error(err);
});