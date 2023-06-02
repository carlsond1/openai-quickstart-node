import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [themeInput, setThemeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: themeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setThemeInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Generate an email subject line</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="theme"
            placeholder="Enter a theme for the subject line"
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
          />
          <input type="submit" value="Generate subject line" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
