var Artwork = artifacts.require("./Artwork.sol");
var ArtFactory = artifacts.require("./ArtFactory.sol");

const deploymentAccount = '0x0ffdE52b604D7F3e31552C9e455Bcf5eAc389916'; 
const artistAccount = '0x69499a45817afa667F5bEDB515A7513833FbC91C';

/*
	This migration script deploy first an Artwork (modified ERC721Full)
	to the blockchain, then deploy an ArtFactory and initialize it with 
	the Artist's address and Artwork itself.
*/

// add here a `network` parameter
// to have different deployment steps for
// different network (i.e. development, testnet or mainnet)
module.exports = function(deployer) {

	deployer.deploy(Artwork, "Thea's Art Factory", "TAF")
		.then((deployedArtwork) => {
			return deployer.deploy(ArtFactory, artistAccount, deployedArtwork.address);
		});

};
