import { useEffect, useState } from "react";
import "./Test.css";

const rootURL =
  import.meta.env.VITE_API_URL || "https://pokedict.onrender.com/";
const postURL = `${rootURL}postans`;

interface PokeArr {
  id: number;
  imgURL: string;
  engName: string;
  jpName: string;
  height: number;
  weight: number;
  type: string;
}
[];

function Retry() {
  const [pokemonData, setPokemonData] = useState<PokeArr[]>([]);
  const [inputVal, setInputVal] = useState<string | null>(null);
  const [correctFlag, setCorrectFlag] = useState<boolean | null>(null);

  const getTestPokeData = async () => {
    try {
      const res = await fetch(`${rootURL}retry`);
      const data = await res.json();
      await setPokemonData(data);
    } catch (error) {
      console.error("error");
    }
  };

  const getInputVal = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputVal(e.target.value);
  };

  const resetInput = () => {
    setInputVal(null);
    const answerInput = document.getElementsByClassName("answer")[0];
    if (answerInput instanceof HTMLInputElement) {
      answerInput.value = "";
    }
  };

  const postData = async (url: string, data: boolean | null) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: data,
          pokemon_id: pokemonData[0].id,
          img_url: pokemonData[0].imgURL,
          eng_name: pokemonData[0].engName,
          jp_name: pokemonData[0].jpName,
        }),
      });
      if (!res.ok) {
        throw new Error("error");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const sendAns = async () => {
    if (inputVal === null) return;
    if (
      inputVal === pokemonData[0].engName ||
      inputVal === pokemonData[0].jpName
    ) {
      await resetInput();
      await setCorrectFlag(true);
      await postData(postURL, true);
    } else {
      await resetInput();
      await setCorrectFlag(false);
      await postData(postURL, false);
    }
  };

  const reTry = () => {
    setCorrectFlag(null);
    resetInput();
    getTestPokeData();
  };

  useEffect(() => {
    getTestPokeData();
  }, []);

  return (
    <>
      <div className="top-q">⌛復習の時間だ⌛</div>
      <div className="top-q">だ～れだ？</div>
      {pokemonData.length > 0 && (
        <div className="test-card">
          <img src={pokemonData[0].imgURL} alt="pokefig" />
        </div>
      )}
      <input className="answer" type="text" onChange={getInputVal} />
      <button onClick={sendAns}>回答する</button>
      <div>{null}</div>
      {/* 正解かハズレかを表示 */}
      {correctFlag === null ? null : correctFlag ? (
        <>
          <img className="satoshi" src="/get.jpeg" alt="vite" />
          <div>getだぜ！</div>
        </>
      ) : (
        <>
          <img className="rocket" src="/yanakanji.jpeg" alt="vite" />
          <div>やな感じぃ〜！</div>
          <div>
            正解は：{pokemonData[0].engName} / {pokemonData[0].jpName} でした
          </div>
        </>
      )}
      <div>
        {correctFlag === null ? null : (
          <button onClick={reTry}>もう一回？</button>
        )}
      </div>
    </>
  );
}

export default Retry;
