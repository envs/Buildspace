import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState, useEffect } from 'react';

const App = () => {

  // Use the hooks provided by @thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Hey!! 👋 Address: ", address);

  const editionDrop = useEditionDrop("0x1eFd0239C501815684736C479B111174dd5fDCF6"); // Initialize editionDrop contract
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);  // state variable to know if user has the NFT
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If user doesn't have connected wallet, exit
    if (!address) {
      return;
    }
    const checkBalance = async () => {
      try {

        const balance = await editionDrop.balanceOf(address, 0);

        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 User has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("👀 User doesn't have a membership NFT...😭");
        }

      } catch (error) {
        setHasClaimedNFT(false);
        console.log("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  // Mint NFT
  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // In case user hasn't connected, let them connect their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to MetaFit DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // This is what to display if the user is already connected and a member (has minted Membership NFT)
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🍪MetaFit DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }

  // This is what to display if the user is already connected but not a member (hasn't minted Membership NFT)
  return (
    <div className="mint-nft">
      <h1>Free 🍪MetaFit DAO Membership NFT</h1>
      <button disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "👀 Minting..." : "Mint your NFT"}
      </button>
    </div>
  );
};

export default App;
