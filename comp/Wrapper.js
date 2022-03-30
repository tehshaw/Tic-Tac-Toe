import React from 'react'
import styles from "../styles/Home.module.css";


export default function Wrapper(props) {
  return (
    <main className={styles.main}>
        {props.children}
    </main>
  )
}
