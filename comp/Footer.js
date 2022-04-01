import React from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Powered by: </p>
      <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
        Next JS
        <span className={styles.logo}>
          <Image src="/next.svg" alt="Next Logo" width={16} height={16} />
        </span>
      </a>
      |
      <a href="https://chakra-ui.com/" target="_blank" rel="noopener noreferrer">
        Chakra UI
        <span className={styles.logo}>
          <Image src="/chakra.svg" alt="Next Logo" width={16} height={16} />
        </span>
      </a>
      |
      <a href="https://socket.io/" target="_blank" rel="noopener noreferrer">
        Socket.io
        <span className={styles.logo}>
          <Image src="/socket.svg" alt="Next Logo" width={16} height={16} />
        </span>
      </a>
      |
      <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">
        Express
        <span className={styles.logo}>
          <Image src="/express.svg" alt="Next Logo" width={16} height={16} />
        </span>
      </a>
    </footer>
  );
}
