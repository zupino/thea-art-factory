# thea-art-factory

Art selling fund for our daughter. Based on Simon de la Rouvier work TAIAOS (thisartworkisalwaysonsale.com).

More details on `docs` branch, `master` contains for the moment only the bolier-plate 
code with the basic skelethon for Artwork and ArtFactory contracts.

Not completed but intended to be always compiling.

## Installation steps

1. Clone this repository

2. In the project root folder, install Open Zeppelin ERC721 and related contracts
```
npm install @openzeppelin/contracts
```

3. Compile and migrate the contracts (local ganache instance running on 127.0.0.1:7545 expected)
```
truffle compile
truffle migrate
```

4. Run the test

[x] Include test from previous project

```
truffle test
```

## Truffle settings

The project is initialized with truffle suite, and a local instance of ganache is expected 
to run on 127.0.0.1:7545 

`truffle-config.js` needs to have the `development` network explicitly mentioned,
otherwise the `truffle test` command will fail (see https://github.com/trufflesuite/truffle/issues/1976)



