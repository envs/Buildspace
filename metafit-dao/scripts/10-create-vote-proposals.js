import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Governance contract
const vote = sdk.getVote("0x42c715c6c136A91F3CA060C83DC1D9421fFcE966");
// ERC-20 contract
const token = sdk.getToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

(async () => {
    try {
        // Create proposal to mint 500,000 new token to treasury
        await token.delegateTo(process.env.WALLET_ADDRESS);
        const amount = 500_000;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
        const executions = [
            {
                // Token contract that actually executes the mint
                toAddress: token.getAddress(),
                // nativeToken is ETH. Hence, nativeTokenValue is the amount of ETH we want to send in this proposal.
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    "mintTo", [
                    vote.getAddress(),
                    ethers.utils.parseUnits(amount.toString(), 18),
                ]
                ),
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");

    } catch (error) {
        console.error("Failed to create first proposal", error);
        process.exit(1);
    }

    try {
        // Create proposal to transfer ourselves 5,000 tokens for being awesome.
        const amount = 5_000;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
            process.env.WALLET_ADDRESS + " for being awesome?";
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    // We are doing transfer from the treasury to our wallet
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!");

    } catch (error) {
        console.error("Failed to create second proposal", error);
    }

})();