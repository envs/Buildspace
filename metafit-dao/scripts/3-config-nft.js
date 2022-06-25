import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x1eFd0239C501815684736C479B111174dd5fDCF6");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "MetaFitDAO Verified Membership NFT",
                description: "This NFT will confirm your membership and access to MetaFitDAO!",
                image: readFileSync("scripts/assets/MetaFit_Member.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("Failed to create the new NFT", error);
    }
})();
