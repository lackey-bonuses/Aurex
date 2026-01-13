// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AurexAuditProbe {
    // Stable, read-only fields for documentation + CI assertions
    string public constant NAME = "AurexAuditProbe";
    string public constant VERSION = "1.0.0";
    string public constant PURPOSE =
        "CI/audit probe: bytecode presence, stable reads, optional event ping";

    uint256 public pingCount;
    bytes32 public lastPingId;
    address public lastCaller;

    event Ping(address indexed caller, bytes32 indexed pingId, uint256 indexed count, string note);

    /// @notice Deterministic value suitable for "expected output" comparisons.
    function fingerprint() external pure returns (bytes32) {
        return keccak256("AUREX:AUDIT_PROBE:FINGERPRINT:V1");
    }

    /// @notice Compact snapshot to log in scripts.
    function snapshot()
        external
        view
        returns (bytes32 fp, uint256 blockNumber, uint256 timestamp, address caller, uint256 count)
    {
        return (this.fingerprint(), block.number, block.timestamp, lastCaller, pingCount);
    }

    /// @notice Optional write path for signing + explorer indexing checks.
    function ping(string calldata note) external {
        bytes32 id = keccak256(abi.encodePacked(note, msg.sender, block.number));
        pingCount += 1;
        lastPingId = id;
        lastCaller = msg.sender;
        emit Ping(msg.sender, id, pingCount, note);
    }
}
