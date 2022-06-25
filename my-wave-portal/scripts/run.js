// NB: To test a smart contract, we have to do things like compile, deploy and execute
// Our script is more of automating those steps

const main = async () => {

    // const [owner, randomPerson] = await hre.ethers.getSigners(); //*************

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.01"),  // deploying the contract and funding it.
    });
    await waveContract.deployed();

    console.log("Contract deployed to: ", waveContract.address);
    // console.log("Contract deployed by: ", owner.address); //*************

    // ***** Get Contract Balance
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    // Manually call our functions (just like we would any normal API) - To simulate call from the Front-End client
    let waveCount;
    waveCount = await waveContract.getTotalWaves(); // To get total wave count from our backend server (blockchain)
    //console.log(waveCount.toNumber());

    // Wave functionality from backend server (blockchain) - SEND WAVE
    let waveTxn = await waveContract.wave("New Message!!");
    await waveTxn.wait();   // Wait for transaction to be mined

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave("A New Message From Another Person!!"); //*************
    await waveTxn.wait();   // Wait for transaction to be mined

    // ***** Get Contract Balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance))

    // Get all waves
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

    waveCount = await waveContract.getTotalWaves(); // Grab waveCount again
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