const main = async () => {

    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contract with account: ", deployer.address);
    console.log("Account Balance: ", accountBalance.toString());

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001"),
    });
    await waveContract.deployed();

    console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {

    try {
        await main();
        process.exit(0);    // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1);    // exit Node process while indicating "Uncaught Fatal Exception" error
    }
};

runMain();