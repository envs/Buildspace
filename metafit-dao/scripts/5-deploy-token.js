import sdk from "./1-initialize-sdk.js";
import { AddressZero } from "@ethersproject/constants";

(async () => {
    try {
        // Deploy a standard ERC-20 contract
        const tokenAddress = await sdk.deployer.deployToken({
            // Token Name
            name: "MetaFitDAO Governance Token",
            // Token Symbol
            symbol: "METAF",
            // Because our token is free, we would keep it as AddressZero
            primary_sale_recipient: AddressZero,
        });
        console.log("✅ Successfully deployed token module, address: ", tokenAddress);
    } catch (error) {
        console.error("Failed to deply token module", error);
    }
})();