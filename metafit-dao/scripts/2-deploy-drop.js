import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            // Collection details: name, description, image ...
            name: "MetaFit DAO",
            description: "A DAO for Fitness Enthusiasts and Experts",
            image: readFileSync("scripts/assets/MetaFit_DAO.png"),
            // We need to pass in the address of the person who will be receiving the proceeds from the sales of the nfts in the contract
            // The plan is not to charge members for the drop. Hence, we will pass in the 0x0 address
            // If you want to charge for the drop, you can put your wallet address here.
            primary_sale_recipient: AddressZero
        });

        // This initialization returns the address of our contract. We use this to initialize the contract on the thirdweb sdk
        const editionDrop = sdk.getEditionDrop(editionDropAddress);
        // We get the metadata of our contract
        const metadata = await editionDrop.metadata.get();

        console.log("✅ Successfully deployed editionDrop contract, address:", editionDropAddress);
        console.log("✅ editionDrop metadata:", metadata);

    } catch (error) {
        console.log("Failed to deploy editionDrop contract", error);
    }
})();