import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [documentInput, setDocumentInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: documentInput,
          tone: toneInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.trim());
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Copy Checker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Check Your Document Copy</h3>
        <form onSubmit={onSubmit}>
          <textarea name="document" placeholder="Enter document" value={documentInput} onChange={(e) => setDocumentInput(e.target.value)} />
          <select name="tone" value={toneInput} onChange={(e) => setToneInput(e.target.value)}>
            <option value="">--Select Tone--</option>
            <option value="business casual">Business Casual</option>
            <option value="business fun">Business Fun</option>
            <option value="business formal">Business Formal</option>
          </select>
          <input type="submit" value="Check Copy" />
        </form>
        <div className={styles.result}>
          <p>{result}</p>
        </div>
      </main>
    </div>
  );
}
