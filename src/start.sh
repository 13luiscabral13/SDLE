#!/bin/bash

kill -9 $(lsof -ti :9000)
kill -9 $(lsof -ti :8000)
#kill -9 $(lsof -ti :9001)
#kill -9 $(lsof -ti :8001)

node proxy.js