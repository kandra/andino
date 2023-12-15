// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { ethers, AlchemyProvider } = require('ethers');

// Setup Ethereum provider using Alchemy
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);

// Relayer's wallet
const relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);

// Contract setup
const contractABI = [
  {
    "inputs": [
        {
            "internalType": "address",
            "name": "_account",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_eventId",
            "type": "uint256"
        }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
  "inputs": [],
  "name": "getEvents",
  "outputs": [
      {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
      }
  ],
  "stateMutability": "view",
  "type": "function"
}];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, relayerWallet);

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  try {
    // const { to, tokenId } = req.body;
    const { to, tokenId } = req.params;
    // console.log("to: " + to);
    // console.log("tokenId: " + tokenId);

    // TODO: Validate the event exists
    var events = await contract.getEvents();
    if(events.indexOf(BigInt(tokenId))<0){
      throw new Error("Event ID doesn't exist");
    }

    const tx = await contract.mint(to, tokenId);        
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

}