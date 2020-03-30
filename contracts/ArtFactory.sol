pragma solidity ^0.5.0;

import "./Artwork.sol";

contract ArtFactory {

	Artwork public art;
	address payable public artist;

	// list of patrons
	mapping (uint256 => address) private _tokenPatrons;

	struct ArtPiece {
		string 	name;
		uint256 price;
		uint256 totalCollected;
		uint256 currentCollected;
		uint256 timeLastCollected;
		uint256 deposit;
		uint256 artistFund;
	}

	ArtPiece[] public artworks;
	
	constructor(address payable _artist, Artwork _artwork) public {
		art = _artwork;
		artist = _artist;
		art.setup();
	}

	modifier onlyArtist() {
        require(msg.sender == artist, "Only artist can do that");
        _;
    }

	function createNewArtwork(address patron, string memory name, uint256 price) public onlyArtist {
		// TODO We might want to have this set to address(0), actually
		// at least at creation. Do I want artwork to be always assigned at
		// creation?
		require(patron != address(0x0));

		uint256 artId = artworks.length;
		artworks.push(ArtPiece(name, price));
		// TODO is it better `steward` or `this.address` here?
		// just interested.
		// --> steward is not visible from here, because it is 
		// declared in ERC721.sol and not in IERC721Full.sol

		/*
		 * Error: CompileError: ParsedContract.sol:45:17: ParserError: Expected identifier but got 'address'
		 * art.mint(this.address, artId);
		*/
		art.mint(address(this), artId);
		_tokenPatrons[artId] = patron;

	}

	function addDeposit() public payable {
		
	}

	function buyArtwork(uint256 tokenId) public payable {
		require(msg.value > artworks[tokenId].price, "Not enough funds to buy and deposit");
		_tokenPatrons[tokenId] = msg.sender;
	}

	// TODO Remove this function, have been introduced
	// to facilitate testing during the development phase
	function getPatron(uint256 tokenId) public view returns (address pat) {
		return _tokenPatrons[tokenId];
	}

}
