import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { createPublicClient, createWalletClient, custom, formatEther, http, isAddress } from "viem";
import { base } from "viem/chains";

const NETWORK = {
  name: "Base Mainnet",
  chainId: 8453,
  rpcUrl: "https://mainnet.base.org",
  explorer: "https://basescan.org",
};

function explorerAddress(address) {
  return `${NETWORK.explorer}/address/${address}`;
}

function explorerBlock(block) {
  return `${NETWORK.explorer}/block/${block}`;
}

function explorerCode(address) {
  return `${NETWORK.explorer}/address/${address}#code`;
}

function short(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function run() {
  const sdk = new CoinbaseWalletSDK({
    appName: "Aurex",
    darkMode: false,
  });

  const provider = sdk.makeWeb3Provider(NETWORK.rpcUrl, NETWORK.chainId);

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(NETWORK.rpcUrl),
  });

  console.log("Built for Base");
  console.log(`Network: ${NETWORK.name}`);
  console.log(`chainId: ${NETWORK.chainId}`);
  console.log(`Explorer: ${NETWORK.explorer}`);
  console.log("");

  let addresses = [];
  try {
    addresses = await walletClient.getAddresses();
  } catch {
    console.log("Wallet connection unavailable, continuing with RPC-only reads");
  }

  if (addresses.length) {
    console.log("Balances:");
    for (const addr of addresses) {
      const bal = await publicClient.getBalance({ address: addr });
      console.log(`- ${short(addr)}: ${formatEther(bal)} ETH`);
      console.log(`  ${explorerAddress(addr)}`);
    }
    console.log("");
  }

  const blockNumber = await publicClient.getBlockNumber();
  const block = await publicClient.getBlock({ blockNumber });

  console.log("Block data:");
  console.log(`- Latest block: ${blockNumber}`);
  console.log(`  ${explorerBlock(blockNumber)}`);
  console.log(`- Timestamp: ${new Date(Number(block.timestamp) * 1000).toISOString()}`);

  const gasPrice = await publicClient.getGasPrice();
  console.log(`- Gas price: ${Number(gasPrice) / 1e9} gwei`);
  console.log("");

  const targets = [
    "0x0000000000000000000000000000000000000000",
    "0x1111111111111111111111111111111111111111",
  ];

  console.log("Bytecode checks:");
  for (const t of targets) {
    if (!isAddress(t)) continue;
    const code = await publicClient.getBytecode({ address: t });
    const hasCode = code && code !== "0x";
    console.log(`- ${short(t)}: ${hasCode ? "bytecode found" : "no bytecode"}`);
    console.log(`  ${explorerCode(t)}`);
  }
}

run().catch((e) => {
  console.error(e);
});
