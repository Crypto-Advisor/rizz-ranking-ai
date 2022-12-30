import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [pickupLine, setPickupLine] = useState("");
  const [prevPickup, setPrevPickup] = useState();
  const [result, setResult] = useState();

  function getRank() {
    if(result > 900){
      return "GIGA CHAD"
    }
    else if(result > 750){
      return "Sigma male"
    }
    else if(result > 500){
      return "Mid-rizzer"
    }
    else if(result > 250){
      return "BOTTOM G"
    }
    else{
      return "simp"
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickup_line: pickupLine }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log(data)
      setPrevPickup(pickupLine);
      setResult(data.result);
      setPickupLine("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className = {styles.back}>
      <Head>
        <title>Test Your Rizz</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <h3>TEST YOUR <span className={styles.rizz}>RIZZ</span><h1 className = {styles.ai}><span>with AI</span></h1></h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="pickupline"
            placeholder="Enter a pickup line"
            value={pickupLine}
            onChange={(e) => setPickupLine(e.target.value)}
          />
          <input type="submit" value="CLICK HERE FOR RESULTS" />
        </form>
        <div className={styles.result}>{prevPickup}</div>
        <div className={styles.result}>{result}</div>
        {
          prevPickup ? 
          <div className={styles.myProgress}>
            <div className={styles.myBar} style={{width: result/10 + '%'}}></div>
          </div>
          :
          null
        }
        {
          prevPickup ? <div className={styles.result}>Your rank is: {getRank()}</div> : null
        }     
      </main>
    </div>
  );
}
