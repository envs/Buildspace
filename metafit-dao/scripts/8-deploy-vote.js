import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // Name of your governance contract
            name: "MetaFit DAO Voting",
            // Location of the governance token, our ERC-20 Contract
            voting_token_address: "0x4995818d1DDDaE65E763985955a3AC950492f242",
            // After a proposal is created, when can members start voting.
            // For now, we set it to immediately
            voting_delay_in_blocks: 0,
            // How long do members have in order to vote on a proposal whwn it's created
            // We will set it to 1 day = 6570 blocks (For Ethereum, there is a block every 13 seconds, so on average 6570 blocks a day)
            voting_period_in_blocks: 6570,
            // The minimum % of total supply that need to vote for the proposal, in order to be 
            // valid after the time the proposal has ended
            voting_quorum_fraction: 1,
            // The minimum # of tokens a user needs to be allowed to create a proposal
            // For now, we'll set it to 0
            proposal_token_threshold: 100,
        });

        console.log("✅ Successfully deployed vote contract, address:", voteContractAddress);

    } catch (error) {
        console.error("Failed to deploy vote contract", error);
    }
})();