pragma solidity ^0.5.5;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";


contract Artwork is ERC721, ERC721Enumerable, ERC721Metadata {

	address public steward;
	bool init = false;

    constructor (string memory name, string memory symbol) public ERC721Metadata(name, symbol) {
        // solhint-disable-previous-line no-empty-blocks
    }


	function _isApproverOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
		return (spender == steward);
	}

	function setup() public {
		require(!init, "Setup only possible during initialization, token already initialized.");
		init = true;
		steward = msg.sender;
	}

	function mint(address account, uint256 artId) public {
		require((steward == msg.sender), "Only Artist can create new art.");
		_mint(account, artId);
	}
}
