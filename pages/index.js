import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [documentInput, setDocumentInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [audienceInput, setAudienceInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
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
          audience: audienceInput,
          country: countryInput,
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
        <p style={{ paddingBottom: '40px' }}><strong>DISCLAIMER:</strong> We are using a public tool. Do not put any confidential information in the form below as once you hit submit, it is being shared externally.</p>
        <form onSubmit={onSubmit}>
          <input type="text" name="audience" placeholder="Enter audience" value={audienceInput} onChange={(e) => setAudienceInput(e.target.value)} />
          <input type="text" name="country" placeholder="Enter country" value={countryInput} onChange={(e) => setCountryInput(e.target.value)} />
          <textarea name="document" style={{ height: '300px', width: '98%', margin: '0 auto', display: 'block'}} placeholder="Enter document" value={documentInput} onChange={(e) => setDocumentInput(e.target.value)} />
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

        <div className={styles.explanation}>
          <h4>How It Works</h4>
          <p>
            This tool leverages the capabilities of OpenAI's GPT-4, a powerful language model, to evaluate and suggest improvements to your document copy. It takes into consideration the tone you intend to convey: whether it's business casual, business fun, or business formal, and the copy you've provided. Based on these inputs, it generates tailored recommendations to enhance the effectiveness of your communication.
            <br />
            It's important to understand that our code is simply instructing the AI model and that you can do all of this yourself by visiting openai.com and using their APIs. AI isn't replacing us, but marketers that use AI will have an advantage over those who don't. To learn more about AI, visit <a href="https://platform.openai.com/">https://platform.openai.com/</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
