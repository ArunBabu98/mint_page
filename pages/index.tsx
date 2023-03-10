import type { NextPage } from "next";
import Head from "next/head";
import SplashBanner from "@components/landing/Splash";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT Minting Dapp</title>
        <meta
          name="description"
          content="NFT Miniting Dapp"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SplashBanner />
    </div>
  );
};

export default Home;
