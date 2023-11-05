const zmq = require('zeromq');

async function run() {

  // Frontend (clients to proxy)
  const frontend = new zmq.Router();
  frontend.bind('tcp://*:12300');
  console.log('Frontend bound to port 5555');

  // Backend (proxy to servers)
  const backend = new zmq.Router();
  backend.bind('tcp://*:12301');
  console.log('Backend bound to port 5556');

  const clients = [];
  const servers = [];

  // Create a simple load balancer
  while (true) {

      await Promise.all([
        await frontend.receive(),
        await backend.receive(),
      ])

    }
}

run().catch((err) => {
  console.error(err);
});
