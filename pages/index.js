import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [audienceInput, setAudienceInput] = useState("");
  const [subjectLineInput, setSubjectLineInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [emailCopyInput, setEmailCopyInput] = useState("");
  const [numLinesInput, setNumLinesInput] = useState("");
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audience: audienceInput,
          subjectLine: subjectLineInput,
          tone: toneInput,
          emailCopy: emailCopyInput,
          numLines: numLinesInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.trim().split("\n"));
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Email Subject Line Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Generate an Email Subject Line</h3>
        <form onSubmit={onSubmit}>
          <input type="text" name="audience" placeholder="Enter audience" value={audienceInput} onChange={(e) => setAudienceInput(e.target.value)} />
          <input type="text" name="subjectLine" placeholder="Enter proposed subject line" value={subjectLineInput} onChange={(e) => setSubjectLineInput(e.target.value)} />
          <select name="tone" value={toneInput} onChange={(e) => setToneInput(e.target.value)}>
            <option value="">--Select Tone--</option>
            <option value="business casual">Business Casual</option>
            <option value="business fun">Business Fun</option>
            <option value="business formal">Business Formal</option>
          </select>
          <textarea name="emailCopy" placeholder="Enter email copy" value={emailCopyInput} onChange={(e) => setEmailCopyInput(e.target.value)} />
          <input type="number" name="numLines" placeholder="Enter number of subject lines" value={numLinesInput} onChange={(e) => setNumLinesInput(e.target.value)} />
          <input type="submit" value="Generate subject lines" />
        </form>
        <div className={styles.result}>
          {result.map((subjectLine, index) => <p key={index}>{subjectLine}</p>)}
        </div>
        <div className={styles.explanation}>
          <h4>How This Works</h4>
          <p>
            This tool uses OpenAI's GPT-4, a large language model, to generate creative and engaging email subject lines based on the inputs you provide: the intended audience, the desired tone, and the email copy. Under the hood, we use OpenAI's API and give it specific instructions on what to do. 
            <br />
            It's important to understand that our code is simply instructing the AI model and that you can do all of this yourself by visiting openai.com and using their APIs. AI isn't replacing us, but marketers that use AI will have an advantage over those who don't. To learn more about AI, visit https://platform.openai.com/
          </p>
        </div>
      </main>
    </div>
  );
}
