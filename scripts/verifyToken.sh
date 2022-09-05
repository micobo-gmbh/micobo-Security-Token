echo Please enter address of token you want verify

read address

echo Now the network name please, it must be in truffle-config!

read network

echo Verifying token at "$address" on "$network" network

truffle run verify SecurityToken@$address --network $network --debug
