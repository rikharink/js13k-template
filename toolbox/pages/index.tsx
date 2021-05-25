import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>JS13K Toolbox</title>
        <meta name="description" content="Tools for Tiny Games" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>JS13k Toolbox</h1>
        <nav>
          <ul className={styles.list}>
            <li>
              <a href="/pixel">Pixel Sprite Creator</a>
            </li>
            <li>
              <a href="/wfc">Wave Function Collapse</a>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
