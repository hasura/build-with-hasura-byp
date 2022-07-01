import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Image from "next/image";
import styles from "../styles/Home.module.css";

type Data = {
  friend: Record<string, string>[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let friends;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT as string,
      {
        method: "POST",
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET as string,
        },
        body: JSON.stringify({
          query: `query {
          friend {
            name
          }
        }`,
        }),
      }
    );

    const result = await response.json();
    const data: Data = result.data;

    friends = data.friend;
  } catch (e) {
    console.log(e);
  }

  return {
    props: { friends },
  };
};

const Home: NextPage = ({
  friends,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {friends.map((friend: { name: string }) => (
          <p>{friend.name}</p>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
