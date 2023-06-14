import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [audienceInput, setAudienceInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [copyInput, setCopyInput] = useState("");
  const [copyOutput, setCopyOutput] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/checkcopy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audience: audienceInput,
          country: countryInput,
          tone: toneInput,
          copy: copyInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setCopyOutput(data.result.trim());
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Copy Check</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Check Your Copy</h3>
        <form onSubmit={onSubmit}>
          <input type="text" name="audience" placeholder="Enter audience" value={audienceInput} onChange={(e) => setAudienceInput(e.target.value)} />
          <input type="text" name="country" placeholder="Enter country" value={countryInput} onChange={(e) => setCountryInput(e.target.value)} />
          <select name="tone" value={toneInput} onChange={(e) => setToneInput(e.target.value)}>
            <option value="">--Select Tone--</option>
            <option value="business">Business</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
          <textarea name="copy" placeholder="Enter copy" value={copyInput} onChange={(e) => setCopyInput(e.target.value)} />
          <input type="submit" value="Check Copy" />
        </form>
        <div className={styles.result}>
          <h4>Output</h4>
          <p>{copyOutput}</p>
        </div>
      </main>
    </div>
  );
}
