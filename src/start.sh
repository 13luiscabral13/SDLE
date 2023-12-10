#!/bin/bash

kill -9 $(lsof -ti :9000)
kill -9 $(lsof -ti :8000)
#kill -9 $(lsof -ti :5000)
#kill -9 $(lsof -ti :5001)
#kill -9 $(lsof -ti :5002)
#kill -9 $(lsof -ti :5003)

node proxy.js