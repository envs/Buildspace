import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x1eFd0239C501815684736C479B111174dd5fDCF6");

(async () => {
    try {
        const claimConditions = [
            {
                // When people would be able to start claiming the NFT (answer -> NOW)
                startTime: new Date(),
                // Maximum number of NFTs that can be claimed
                maxQuantity: 50_000,
                // Price of NFT (free)
                price: 0,
                // Amount of NFT that can be claimed in one transaction
                quantityLimitPerTransaction: 1,
                // The wait between transactions is set to MaxUint256, which means users can only claim once
                waitInSeconds: MaxUint256,
            }
        ]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("✅ Successfully set claim condition!");

    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();