// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AurexConfigRegistry {
    address public owner;

    // An external reference you can compute off-chain (commit hash, config JSON hash, etc.)
    bytes32 public latestConfigHash;
    uint256 public latestUpdatedAt;
    address public latestUpdater;

    event ConfigPublished(bytes32 indexed configHash, address indexed updater, uint256 indexed timestamp, string label);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(bytes32 initialConfigHash, string memory label) {
        owner = msg.sender;
        _publish(initialConfigHash, label);
    }

    function publish(bytes32 configHash, string calldata label) external onlyOwner {
        _publish(configHash, label);
    }

    function _publish(bytes32 configHash, string memory label) internal {
        latestConfigHash = configHash;
        latestUpdatedAt = block.timestamp;
        latestUpdater = msg.sender;
        emit ConfigPublished(configHash, msg.sender, block.timestamp, label);
    }

    function configSnapshot()
        external
        view
        returns (bytes32 configHash, uint256 updatedAt, address updater)
    {
        return (latestConfigHash, latestUpdatedAt, latestUpdater);
    }
}
