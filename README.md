# Aurex

## Overview
Aurex is a read-only inspection repository designed to validate Base network visibility, explorer reachability, and RPC responsiveness. It is intended for environments where safety and determinism matter more than interaction.

Built for Base.

## Purpose
This repository exists to provide a clean reference for:
- confirming Base RPC connectivity
- reading public chain data without side effects
- validating that deployed contracts are visible on the explorer
- producing copyable explorer links for reviews and reports

Aurex is suitable for audits, CI checks, documentation validation, and early-stage infrastructure testing.

## Operational Scope
Aurex operates strictly in read-only mode.
- No transactions are sent
- No messages are signed
- No onchain state is modified
- No private keys are required

## Internal Flow
1) Initialize Base network configuration  
2) Create a Coinbase Wallet provider for address discovery  
3) Create a public RPC client for chain reads  
4) Read wallet balances if addresses are available  
5) Fetch latest block and gas data  
6) Check bytecode existence at known addresses  
7) Emit explorer links for all inspected data  

## Base Mainnet Details
- Network: Base Mainnet  
- chainId (decimal): 8453  
- Explorer: https://basescan.org  

## Repository Structure
- README.md  
- app/Aurex.mjs  
- package.json  
- contracts/AurexAuditProbe.sol - a minimal probe contract for CI and audit checklists: stable read-only metadata, deterministic fingerprinting, and an optional ping() that emits an event
- contracts/AurexConfigRegistry.sol - a tiny configuration hash registry for documentation validation and early infra testing: store a bytes32 configHash (e.g., commit hash, deployment config hash, env hash), timestamp it, and emit a traceable event
- config/base-mainnet.json  
- samples/targets.json  

## Author Contacts
- GitHub: https://github.com/lackey-bonuses

- X: https://x.com/kimkimber09

- Email: lackey.bonuses.0h@icloud.com 

## License
MIT License

## testnet deployment (base sepolia)
the following deployments are used only as validation references.

network: base sepolia  
chainId (decimal): 84532  
explorer: https://sepolia.basescan.org  

contract AurexAuditProbe.sol address:  
0x8E1B4A7C2D9F0A6C3E5B7D1A4F8C2B6D9A0E3F7B

deployment and verification:
- https://sepolia.basescan.org/address/0x8E1B4A7C2D9F0A6C3E5B7D1A4F8C2B6D9A0E3F7B
- https://sepolia.basescan.org/0x8E1B4A7C2D9F0A6C3E5B7D1A4F8C2B6D9A0E3F7B/0#code  

contract AurexConfigRegistry.sol address:  
0x3C7A1D9E5B2F8A6C0D4E9B1A7C2D6F8E0A5B4C9D

deployment and verification:
- https://sepolia.basescan.org/address/0x3C7A1D9E5B2F8A6C0D4E9B1A7C2D6F8E0A5B4C9D
- https://sepolia.basescan.org/0x3C7A1D9E5B2F8A6C0D4E9B1A7C2D6F8E0A5B4C9D/0#code  

these deployments provide a controlled environment for validating base tooling and read-only onchain access prior to base mainnet usage.
