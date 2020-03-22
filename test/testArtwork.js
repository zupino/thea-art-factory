// TODO Some test are sequence dependent, need to 
// double check if this is an issue

const Artwork = artifacts.require("Artwork");
const ArtFactory = artifacts.require("ArtFactory")

contract("Artwork", accounts => {

	let ArtworkInstance;
	let ArtFactoryInstance;
	let deployer = accounts[0];
	let steward = accounts[1];
	let artist = accounts[2];
	let patron1 = accounts[3];
	let patron2 = accounts[4];
	let patron3 = accounts[5];

	let catchRevert = require("./exceptions.js").catchRevert;

	before( async function() {
		ArtworkInstance = await Artwork.new("Thea Art Factory", "THEA", {from: deployer});
	});

	it("Should not have steward assigned until linked to ArtFactory", async function()  {
		let steward = await ArtworkInstance.steward();
		assert.equal(steward, 0, "Steward is assigned before setup()");
	});

	it("Should prevent minting new coin until setup", async function() {
		// ArtworkInstance.mint(accounts[2], 1);
		await catchRevert( ArtworkInstance.mint(patron1, 1, {from: patron1}) );
	});

	it("Should allow minting new coin for the caller of setup", async function() {
		await ArtworkInstance.setup({from: artist});
		await catchRevert( ArtworkInstance.mint(patron1, 1, {from: deployer}) );
		let totalCoins = await ArtworkInstance.totalSupply();
		
		// expected to be 0, as previous mint() should have failed
		assert.equal(totalCoins.toNumber(), 0, "A coin was minted by un-authorized person.");

		await ArtworkInstance.mint(patron1, 1, {from: artist});
		totalCoins = await ArtworkInstance.totalSupply();
		
		// now new coin is expected to be there, since it was minted by the caller of setup()
		assert.equal(totalCoins.toNumber(), 1, "The coin was not minted by artist.");
	});

	it("Should fail create ArtFactory with account addreess", async function() {
		// This throw exception as expected
		await catchRevert( ArtFactory.new(artist, artist) );
	});

	it("Should create a Factory, assigning art and artist", async function() {
		ArtworkInstance = await Artwork.new("Thea Art Factory 2", "TH2");
		ArtFactoryInstance = await ArtFactory.new(artist, ArtworkInstance.address, {from: deployer});

		let _art = await ArtFactoryInstance.art();
		let _artist = await ArtFactoryInstance.artist();

		assert.equal( _art, ArtworkInstance.address, "Artwork address and art in ArtFactory do not match" );
		assert.equal( _artist, artist, "Artist associated to ArtFactory does not match" );
	});

	it("Should fail creation from someone else than artist", async function() {
		await catchRevert( ArtFactoryInstance.createNewArtwork(patron1, "Girotondo", 50000) );
	});

	it("Should create a new masterpiece", async function() {
        let supply = await ArtworkInstance.totalSupply();
        assert.equal( supply.toNumber(), 0, "Token supply not empty after factory creation" );

        ArtFactoryInstance.createNewArtwork(patron1, "Girotondo", 50000, {from: artist});
        ArtFactoryInstance.createNewArtwork(patron1, "Girotondo2", 150000, {from: artist});
        ArtFactoryInstance.createNewArtwork(patron2, "Girotondo3", 250000, {from: artist});

        supply = await ArtworkInstance.totalSupply();

        assert.equal(supply.toNumber(), 3, "CreateNewArtwork does not mint new token");

    });

});
