import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

import dotenv from "dotenv";
dotenv.config();

// Check to ensure .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("🛑 Private key not found.");
}
if (!process.env.STAGING_ALCHEMY_KEY || process.env.STAGING_ALCHEMY_KEY === "") {
    console.log("🛑 Alchemy API URL not found.");
}
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("🛑 Wallet Address not found.");
}

// Let's get our .env variables
const provider = new ethers.providers.JsonRpcProvider(process.env.STAGING_ALCHEMY_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("👋 SDK initialized by address: ", address);
    } catch (error) {
        console.error("Failed to get apps from the sdk ", error);
        process.exit(1)
    }
})();

// Let's export the initialized SDK, in order to use it in other scripts
export default sdk;