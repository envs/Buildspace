import { useAddress, useMetamask, useEditionDrop, useToken } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from 'react';

const App = () => {

  // Use the hooks provided by @thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("Hey!! 👋 Address: ", address);

  const editionDrop = useEditionDrop("0x1eFd0239C501815684736C479B111174dd5fDCF6"); // Initialize editionDrop contract
  const token = useToken("0x4995818d1DDDaE65E763985955a3AC950492f242");

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);  // state variable to know if user has the NFT
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // The arrray holding all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // An helper function to shorten user's wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of members holding an NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // Grab the users who hold the NFT with tokenId of 0.
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);

      } catch (error) {
        console.error("Failed to get members' list", error);
      }
    };
    getAllAddresses();

  }, [hasClaimedNFT, editionDrop.history]);

  // This useEffect grabs the # of toekn each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);

      } catch (error) {
        console.error("Failed to get members' balances");
      }
    };
    getAllBalances();

  }, [hasClaimedNFT, token.history]);

  // Now, we combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // If we find address in memberTokenAmounts array, return token amount
      // otherwise, return 0
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);


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
        <h1>Welcome to MetaFit DAO 🚀🚀</h1>
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
        <h1>MetaFit DAO Member Page 🚀🚀</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

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
