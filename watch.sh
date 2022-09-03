#!/bin/bash
task () {
	ETHEREUM_RPC_URL="" NETWORK=localhost yarn deploy;
	cd subgraph && yarn deploy-local -l v0.0.3 && cd -
}

task
while inotifywait -e modify ./contracts ./scripts ./subgraph/*; do
	task
done