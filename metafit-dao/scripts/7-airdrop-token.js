import sdk from "./1-initialize-sdk.js";

// Address of our ERC-1155 Membership NFT contract
const editionDrop = sdk.getEditionDrop("0x1eFd0239C501815684736C479B111174dd5fDCF6");

// This is the address of our ERC-20 contract
const token = sdk.getToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

(async () => {
    try {
        // Grab all the addresses of people who own the MetaFitDAO Membership NFT
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet. Get more people to claim the FREE NFTs");
            process.exit(0);
        }

        // Loop through the array of addresses
        const airdropTargets = walletAddresses.map((address) => {
            // Pick a random # between 1_000 and 10_000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Airdroping ", randomAmount, " tokens to ", address);

            // Set up the target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };
            return airdropTarget;
        });

        // Call transferBatch on all our airdrop targets
        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");

    } catch (error) {
        console.error("Failed to airdrop tokens ", error);
    }
})();