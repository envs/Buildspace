import sdk from "./1-initialize-sdk.js";

// ERC-20 contract
const token = sdk.getToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

(async () => {
    try {
        // Log the current roles
        const allRoles = await token.roles.getAll();
        console.log("👀 These are roles that exist right now:", allRoles);

        // Revoke the super role on your wallet for ERC-20 contract
        await token.roles.setAll({
            admin: [],
            minter: []
        });
        console.log("🎉 Roles after revoking ourselves", await token.roles.getAll());

    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();