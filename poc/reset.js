const zmq = require('zeromq');
  
  // Frontend (clients to proxy)
  const frontend = new zmq.Router();
  frontend.unbind('tcp://localhost:5559');
  console.log('Frontend bound to port 5555');

  // Backend (proxy to servers)
  const backend = new zmq.Router();
  backend.unbind('tcp://localhost:5560');
  console.log('Backend bound to port 5556');