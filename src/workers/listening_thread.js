const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require('zeromq');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));



if (!isMainThread) {
    let { httpPort } = workerData;

    
}