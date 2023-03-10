import { NextPage } from "next";
import styles from "@styles/Home.module.css";
import styles2 from "@styles/Navbar.module.css";
import styles3 from "@styles/Card.module.css";
import { Button, Link, Spinner, VStack } from "@chakra-ui/react";
import { useAccount, useNetwork, useContractWrite } from "wagmi";
import myNFT from "@data/MyNFT.json";
import { useEffect, useState } from "react";
import presaleList from "@data/allowlists/presaleList.json";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Image from "next/image";
import web3 from "web3";
import { abridgeAddress } from "@utils/abridgeAddress";
import { generateMerkleProof } from "@utils/merkleProofs";
import ConnectWallet from "@components/web3/ConnectWallet";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const PRICE = 0.061;
const Mint: NextPage = () => {
  const { activeChain, switchNetwork } = useNetwork();
  const [payable, setPayable] = useState(BigInt(61000000000000000).toString());
  const [merkleProof, setMerkleProof] = useState([""]);
  const [numPresaleMint, setNumPresaleMint] = useState(1);
  const [hasMinted, setHasMinted] = useState(false);

  const handleChange = (value: number | string) => {
    setNumPresaleMint(Number(value));
    const payableInEth = PRICE * Number(value);
    const payableinWei = web3.utils.toWei(payableInEth.toString(10), "ether");
    setPayable(payableinWei);
  };

  const { data: account, isError: accountIsError } = useAccount();

  const {
    data: presaleMintData,
    error: presaleError,
    isError: presaleMintIsError,
    isLoading: presaleMintIsLoading,
    write: presaleMintWrite,
  } = useContractWrite(
    {
      addressOrName: CONTRACT_ADDRESS != null ? CONTRACT_ADDRESS : "0x6A52a56b4F398cd86cbE9ab074e0FB12e3A1BdfF",
      contractInterface: myNFT.abi,
    },
    "presaleMint",
    {
      overrides: {
        value: payable,
      },
      args: [numPresaleMint, merkleProof],
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log("Success", data);
        setHasMinted(true);
      },
    }
  );

  useEffect(() => {
    if (!accountIsError && account?.address) {
      const merkle = generateMerkleProof(presaleList, account.address);
      if (merkle.valid) {
        setMerkleProof(merkle.proof);
      } else {
        setMerkleProof([]);
      }
    }
  }, [account?.address]);

  const handleMint = async () => {
    try {
      await presaleMintWrite();
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
            {hasMinted ? (
              <VStack>
                <Image
                  alt="placeholder image for team members"
                  src={"/assets/tick.png"}
                  width={250}
                  height={250}
                />
                <p style={{ color: "white" }}>
                  You've successfully minted! Click here to view your newly minted NFT
                </p>
                <Link href="/mypage">
                  <div className={styles2.bcontainer} onMouseOver={() => setColor('#F7D268')}>
                    <a href="#" className={styles2.button}>
                      <div className={styles2.button__line}></div>
                      <div className={styles2.button__line}></div>
                      <span className={styles2.button__text}>SWITCH</span>
                      <div className={styles2.button__drow1}></div>
                      <div className={styles2.button__drow2}></div>
                    </a>

                  </div>
                </Link>
                {/* <Link href="/mypage">
                  <Button
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      color: "#4b4f56",
                      borderRadius: "0",
                    }}
                  >
                    View My NFT
                  </Button>
                </Link> */}
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
            <Image
              alt="placeholder image for team members"
              src={"/assets/wrong.png"}
              width={250}
              height={250}
            />
            <p style={{ color: "white" }}>You're on the wrong Network!</p>
            <div className={styles2.bcontainer} onMouseOver={() => setColor('#F7D268')} onClick={() => {
              switchNetwork && switchNetwork(CHAIN_ID);
            }}>
              <a href="#" className={styles2.button}>
                <div className={styles2.button__line}></div>
                <div className={styles2.button__line}></div>
                <span className={styles2.button__text}>SWITCH</span>
                <div className={styles2.button__drow1}></div>
                <div className={styles2.button__drow2}></div>
              </a>

            </div>
          </VStack>
          ) : (
          <VStack>
            <Image
              alt="placeholder image for team members"
              src={"/assets/nft1.png"}
              width={250}
              height={250}
            />
            {/* select # of tokens to mint */}
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
            <div className={styles2.bcontainer} onMouseOver={() => setColor('#F7D268')} onClick={handleMint}>
              <a href="#" className={styles2.button}>
                <div className={styles2.button__line}></div>
                <div className={styles2.button__line}></div>
                <span className={styles2.button__text}>MINT NFT</span>
                <div className={styles2.button__drow1}></div>
                <div className={styles2.button__drow2}></div>
              </a>

            </div>
            {presaleMintData && (
              <p style={{ color: "white" }}>
                Success:{" "}
                <a
                  href={`${BLOCK_EXPLORER || "https://goerli.etherscan.io"
                    }/tx/${presaleMintData.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {abridgeAddress(presaleMintData.hash)}
                </a>
              </p>
            )}
            {presaleMintIsError && (
              <p style={{ color: "red" }}>
                Error:{" "}
                {presaleError?.message.includes("Mint is not active") &&
                  "Public Mint is not Active yet!"}
                {presaleError?.message.includes("Not on white list") &&
                  "Your address is not in the whitelist!"}
                {/* this happens sometimes when there is a race condition on the payable state */}
                {presaleError?.message.includes("You sent the incorrect amount of ETH") &&
                  "Please try again. Incorrect ETH sent!"}
                {presaleError?.message.includes("Maximum mint exceeded!") &&
                  "Only 5 NFTs can be minted at a time!"}
                {presaleError?.message.includes("insufficient funds") &&
                  "Insufficient funds"}
                {presaleError?.message.includes(
                  "Exceeded maximum amount of tokens allowed for the wallet!"
                ) && "Exceeded maximum amount of tokens allowed for the wallet!"}
                {presaleError?.message.includes(
                  "Exceeded total token supply"
                ) && "Exceeded total token supply!"}
                {presaleError?.message.includes("user rejected transaction") &&
                  "Request is Rejected"}
              </p>
            )}
          </VStack>
            )}
      </div>
    </main>

      </div >
    </div >
  );
};

export default Mint;
