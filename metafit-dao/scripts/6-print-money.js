import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract
const token = sdk.getToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

(async () => {
    try {
        // The max supply
        const amount = 100_000_000;
        // Intereact with your deployed ERC-20 contract and mint the tokens
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Print out how many of our tokens are out there
        console.log("✅ There now is", totalSupply.displayValue, "$METAF in circulation");
    } catch (error) {
        console.error("Failed to print money ", error);
    }
})();