const zmq = require('zeromq');

async function run() {
  const requester = new zmq.Request();

  requester.connect('tcp://localhost:5559');
  console.log('Connected to port 5559');

  while (1) {
    console.log('Sending request...');
    await requester.send('Hello');
    const [response] = await requester.receive();
    console.log(`Received reply: ${response.toString()}`);
  }

  requester.close();
}

run().catch((err) => {
  console.error(err);
});