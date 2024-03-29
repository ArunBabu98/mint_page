import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Spacer,
  Stack,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import styles from "../styles/Navbar.module.css";
import ConnectWallet from "./web3/ConnectWallet";
import Mint from "pages/presale-mint";




const FaOpensea = () => (
  <Box
    width="48px"
    height="48px"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Image width="18px" height="18px" src="assets/opensea.png" />
  </Box>
);

function setColor(newColor: string) {
  document.documentElement.style.setProperty('--back_color', newColor);
}

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={styles.background}>
      <div className={styles.navbar}>
        <div className={styles.leftPartition}>
          <div className={styles.bcontainer} onMouseOver={() => setColor('#EB8EAC')}>
            <a href="#" className={styles.button}>
              <div className={styles.button__line}></div>
              <div className={styles.button__line}></div>
              <span className={styles.button__text}>HOME</span>
              <div className={styles.button__drow1}></div>
              <div className={styles.button__drow2}></div>
            </a>

          </div>
          <Link href="/" passHref>
          <div className={styles.bcontainer} onMouseOver={() => setColor('#1099A3')}>
            <a href="" className={styles.button}>
              <div className={styles.button__line}></div>
              <div className={styles.button__line}></div>
              <span className={styles.button__text}>MINT</span>
              <div className={styles.button__drow1}></div>
              <div className={styles.button__drow2}></div>
            </a>

          </div>
          </Link>
          <Link href="/presale-mint" passHref>
            <div className={styles.bcontainer} onMouseOver={() => setColor('#F7D268')}>
              <a href="#" className={styles.button}>
                <div className={styles.button__line}></div>
                <div className={styles.button__line}></div>
                <span className={styles.button__text}>PRE SALE</span>
                <div className={styles.button__drow1}></div>
                <div className={styles.button__drow2}></div>
              </a>

            </div>
          </Link>

        </div>
        <div className={styles.rightPartition}>
          <ConnectWallet size="md" />
        </div>
        <div className={styles.mobilePartition}>
          <IconButton
            aria-label="hamburger menu icon"
            icon={<HamburgerIcon />}
            colorScheme="white"
            onClick={onOpen}
          />
        </div>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent background="black">
            <DrawerCloseButton />
            <DrawerBody>
              <Stack marginTop="20" spacing="24px">
                <Link href="/" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Home
                  </button>
                </Link>
                <Link href="/viewer" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Explorer
                  </button>
                </Link>
                <ConnectWallet isMobile size="xs" />
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div >
  );
};

export default NavBar;
