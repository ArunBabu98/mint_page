import { useAccount, useNetwork, useDisconnect } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import styles from "../../styles/Navbar.module.css";
import styles2 from "@styles/Navbar.module.css";

function setColor(newColor: string) {
  document.documentElement.style.setProperty('--back_color', newColor);
}

type ConnectWalletProps = {
  isMobile?: boolean;
  size?: string;
};

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const ConnectWallet = ({ isMobile, size }: ConnectWalletProps) => {
  const { data } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();
  const {
    isOpen: connectIsOpen,
    onOpen: connectOnOpen,
    onClose: connectOnClose,
  } = useDisclosure();

  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (activeChain?.id !== CHAIN_ID && switchNetwork) switchNetwork(CHAIN_ID);
  }, [activeChain]);

  return (
    <>
      {!isMobile ? (
        <>
          {!data ? (
            <div className={styles.bcontainer} onMouseOver={() => setColor('#FFFFFF')} onClick={connectOnOpen}>
              <a href="#" className={styles.button}>
                <div className={styles.button__line}></div>
                <div className={styles.button__line}></div>
                <span className={styles.button__text}>Wallet Connect</span>
                <div className={styles.button__drow1}></div>
                <div className={styles.button__drow2}></div>
              </a>

            </div>
          ) : activeChain?.id === CHAIN_ID ? (
            <Menu>
              {({ isOpen }) => (
                <>
                  <div className={styles.bcontainer} onMouseOver={() => setColor('#FFFFFF')}>
                    <a href="#" className={styles.button}>
                      <div className={styles.button__line}></div>
                      <div className={styles.button__line}></div>
                      <span className={styles.button__text}><MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        style={{
                          color: "#4b4f56",
                          backgroundColor: "transparent",
                          borderRadius: "0",
                          overflow: "hidden",
                        }}
                      >
                        {abridgeAddress(data?.address)}
                      </MenuButton></span>
                      <div className={styles.button__drow1}></div>
                      <div className={styles.button__drow2}></div>
                    </a>

                  </div>

                  <MenuList
                    color="black"
                    style={{
                      color: "#4b4f56",
                      borderRadius: "0",
                      width: "100%",
                    }}
                  >
                    <MenuItem>
                      <Link
                        href="/mypage"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        View My Collection
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        disconnect();
                      }}
                    >
                      Disconnect Wallet
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          ) : (
            <div className={styles2.bcontainer} onMouseOver={() => setColor('#FFFFFF')} onClick={() => {
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
          )}
        </>
      ) : (
        <>
          {!data ? (
            <VStack marginTop="20" spacing="24px" alignItems="flex-start">
              <button className={styles.button} onClick={connectOnOpen}>
                Connect Wallet
              </button>
            </VStack>
          ) : (
            <VStack marginTop="20" spacing="24px" alignItems="flex-start">
              <Link href="/mypage">
                <button className={styles.button}>View My Collection</button>
              </Link>
              <Link
                onClick={() => {
                  disconnect();
                }}
              >
                <button className={styles.button}>Disconnect Wallet</button>
              </Link>
            </VStack>
          )}
        </>
      )}
      <WalletModal isOpen={connectIsOpen} closeModal={connectOnClose} />
    </>
  );
};

export default ConnectWallet;
