import { NextPage } from "next";
import styles from "@styles/Home.module.css";
import styles2 from "@styles/Navbar.module.css";
import styles3 from "@styles/Card.module.css";
import { Button, HStack, Link, VStack } from "@chakra-ui/react";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import myNFT from "@data/MyNFT.json";
import { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from "@chakra-ui/react";
import web3 from "web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import ConnectWallet from "@components/web3/ConnectWallet";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const PRICE = 0.061; // change to match the price on your contract

const Mint: NextPage = () => {
  const { data: account } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();

  const [payable, setPayable] = useState(BigInt(61000000000000000).toString());
  const [numPublicMint, setNumPublicMint] = useState(1);
  const [hasMinted, setHasMinted] = useState(false);

  const handleChange = (value: number | string) => {
    setNumPublicMint(Number(value));
    const payableInEth = PRICE * Number(value);
    const payableinWei = web3.utils.toWei(payableInEth.toString(10), "ether");
    setPayable(payableinWei);
  };

  const {
    data: publicSaleData,
    error: publicMintError,
    isError: publicSaleIsError,
    isLoading: publicSaleIsLoading,
    write: publicSaleWrite,
  } = useContractWrite(
    {
      addressOrName: "0x6A52a56b4F398cd86cbE9ab074e0FB12e3A1BdfF",
      contractInterface: myNFT.abi,
    },
    "mint",
    {
      overrides: {
        value: payable,
      },
      args: [numPublicMint],
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log(data);
        setHasMinted(true);
      },
    }
  );

  const handlePublicMint = async () => {
    try {
      await publicSaleWrite();
    } catch (err) {
      console.log(`Error minting ${err}`);
    }
  };

  function setColor(newColor: string) {
    document.documentElement.style.setProperty('--back_color', newColor);
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.glasscontainer}>

            {hasMinted && publicSaleData ? (
              <VStack>
                <p style={{ color: "white" }}>
                  Your transaction was sent! Click here to view your transaction:
                </p>
                <Link
                  href={`${BLOCK_EXPLORER || "https://goerli.etherscan.io"}/tx/${publicSaleData.hash
                    }`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "white",
                    borderRadius: "0",
                  }}
                >
                  Etherscan: {abridgeAddress(publicSaleData.hash)}
                </Link>
                <Link href="/mypage">
                  <Button
                    style={{
                      color: "#4b4f56",
                      borderRadius: "0",
                    }}
                  >
                    View My Collection
                  </Button>
                </Link>
              </VStack>
            ) : !account?.address ? (
              <VStack>
                <div className={styles.walletimage}>
                  <img className={styles.bounce2} src="/assets/wallet.png" alt="image" />
                  <div className={styles.wallettext}>
                    <p className={styles.heading}>wallet not connected</p>
                  </div>
                </div>
              </VStack>
            ) : activeChain?.id !== CHAIN_ID ? (
              <VStack>
                <p style={{ color: "white" }}>You're on the wrong Network!</p>
                <Button
                  style={{
                    color: "#4b4f56",
                    borderRadius: "0",
                  }}
                  onClick={() => {
                    switchNetwork && switchNetwork(CHAIN_ID);
                  }}
                >
                  Switch Network
                </Button>
              </VStack>
            ) : (
              <VStack>
                {/* select # of tokens to mint */}
                <div className={styles.mintContainer}>
                  <HStack>
                    <NumberInput
                      step={1}
                      defaultValue={1}
                      min={1}
                      max={5}
                      precision={0}
                      onChange={handleChange}
                      inputMode="numeric"
                      variant="filled"
                    >
                      <NumberInputField
                        _focus={{ bg: "white.300" }}
                        _active={{ bg: "white.300" }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <div className={styles3.outerContainer}>
                      <div className={styles3.wrapper}>
                        <div className={styles3.card}>
                          <h1>
                            <span className={styles3.enclosed}>MINT NFT</span>
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className={styles2.bcontainer} onMouseOver={() => setColor('#F7D268')} onClick={handlePublicMint}>
                      <a href="#" className={styles2.button}>
                        <div className={styles2.button__line}></div>
                        <div className={styles2.button__line}></div>
                        <span className={styles2.button__text}>MINT NFT</span>
                        <div className={styles2.button__drow1}></div>
                        <div className={styles2.button__drow2}></div>
                      </a>

                    </div>
                    {/* <Button
                      style={{
                        color: "#4b4f56",
                        borderRadius: "0",
                      }}
                      onClick={handlePublicMint}
                    >
                      Mint NFT
                      {publicSaleIsLoading && <Spinner marginLeft={2} />}
                    </Button> */}
                  </HStack>
                </div>

                {publicSaleIsError && (
                  <p className={styles.error}>
                    Error:{" "}
                    {publicMintError?.message.includes("Mint is not active") &&
                      "Public Mint is not Active yet!"}
                    {/* this happens sometimes when there is a race condition on the payable state */}
                    {publicMintError?.message.includes("You sent the incorrect amount of ETH") &&
                      "Please try again. Incorrect ETH sent!"}
                    {publicMintError?.message.includes("Maximum mint exceeded!") &&
                      "Only 5 NFTs can be minted at a time!"}
                    {publicMintError?.message.includes("insufficient funds") &&
                      "Insufficient funds"}
                    {publicMintError?.message.includes(
                      "Exceeded maximum amount of tokens allowed for the wallet!"
                    ) && "Exceeded maximum amount of tokens allowed for the wallet!"}
                    {publicMintError?.message.includes(
                      "Exceeded total token supply"
                    ) && "Exceeded total token supply!"}
                    {publicMintError?.message.includes("user rejected transaction") &&
                      "Request is Rejected"}
                  </p>
                )}
              </VStack>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mint;
