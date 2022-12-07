// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.3;

import "./RewardToken.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC20/utils/SafeERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/utils/cryptography/ECDSA.sol";
import "OpenZeppelin/openzeppelin-contracts@4.1.0/contracts/access/Ownable.sol";

contract NFTToken is Ownable, ERC721URIStorage, ERC721Enumerable {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    struct RewardCheckpoint {
        uint256 value;
        uint256 timestamp;
    }

    mapping (address => uint256) public dailyRewards;
    mapping (address => RewardCheckpoint) internal _rewardBalances;
    mapping (uint256 => uint256) public tokenRewards;

    uint256 constant SECONDS_IN_DAY = 60 * 60 * 24;
    uint256[] internal _countriesMinted;
    uint256[] internal _planetsMinted;
    RewardToken rewardToken;

    constructor(RewardToken rewardToken_) ERC721("NFTToken", "NFT") {
        rewardToken = rewardToken_;
        dailyRewards[address(0)] = 2**256 - 1;
    }

    function mint(uint256 tokenId, uint256 price, uint256 dailyReward, string memory uri, bytes memory sig) public payable {
        require(keccak256(abi.encodePacked(msg.sender, tokenId, price, dailyReward, uri, address(this))).toEthSignedMessageHash().recover(sig) == owner(), "invalid signature");
        require(msg.value >= price, "value is not enough");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        tokenRewards[tokenId] = dailyReward;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        if (tokenId < 1000000) {
            _countriesMinted.push(tokenId);
        } else {
            _planetsMinted.push(tokenId);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
        _saveRewards(from);
        _saveRewards(to);
        dailyRewards[from] -= tokenRewards[tokenId];
        dailyRewards[to] += tokenRewards[tokenId];
    }

    function rewardBalance(address user) public view returns (uint256 balance) {
        RewardCheckpoint memory check = _rewardBalances[user];

        if (check.timestamp == 0)
            return 0;

        return check.value + (block.timestamp - check.timestamp) / SECONDS_IN_DAY * dailyRewards[user];
    }

    function _saveRewards(address user) internal {
        RewardCheckpoint storage check = _rewardBalances[user];
        check.value = rewardBalance(user);
        check.timestamp = block.timestamp;
    }

    function claimReward() public {
        uint256 value = rewardBalance(msg.sender);
        require(value > 0, "nothing to claim");
        RewardCheckpoint storage check = _rewardBalances[msg.sender];
        check.value = 0;
        check.timestamp = block.timestamp;
        rewardToken.mint(msg.sender, rewardBalance(msg.sender));
    }

    function countriesMinted() public view returns (uint256[] memory) {
        return _countriesMinted;
    }

    function planetsMinted() public view returns (uint256[] memory) {
        return _planetsMinted;
    }

    // fix multiple inheritance

    function tokenURI(uint256 tokenId) public view virtual override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal virtual override (ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
