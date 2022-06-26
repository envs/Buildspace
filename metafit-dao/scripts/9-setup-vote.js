import sdk from "./1-initialize-sdk.js";

// Governance contract
const vote = sdk.getVote("0x42c715c6c136A91F3CA060C83DC1D9421fFcE966");
// ERC-20 contract
const token = sdk.getToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

(async () => {
    try {
        // Give our treasury the power to mint additional token if needed.
        await token.roles.grant("minter", vote.getAddress());

        console.log("Successfully gave vote contract permissions to act on token contract");

    } catch (error) {
        console.error("Failed to grant vote contract permissions on token contract", error);
        process.exit(1);
    }

    try {
        // Grab wallet's token balance -- remember we basically hold the entire supply right now!
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);
        // Grab 90% of the supply that we hold
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;
        // Transfer 90% of the supply to our voting contract
        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");

    } catch (error) {
        console.error("Failed to transfer tokens to vote contract", error);
    }
})();