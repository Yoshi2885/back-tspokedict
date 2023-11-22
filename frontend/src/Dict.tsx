import { useEffect, useState } from "react";
import "./Dict.css";
import { orgObj2 } from "./ObjData";

function Dict() {
  const rootURL =
    import.meta.env.VITE_API_URL || "https://pokedict.onrender.com/";
  const initURL = "https://pokeapi.co/api/v2/pokemon/";

  const [pokeDataArr, setPokeDataArr] = useState<PokeArr[] | orgArr[]>([]);
  const [nextURL, setNextURL] = useState<null | string>(null);
  const [prevURL, setPrevURL] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputVal, setInputVal] = useState<number | string | null>(null);

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
  interface orgArr {
    id: string;
    imgURL: string;
    engName: string;
    jpName: string;
    height: string;
    weight: string;
    type: string;
  }
  [];

  const getAllPokemonData = async (url: string | null) => {
    try {
      const res = await fetch(`${rootURL}pokedict?url=${url}`);
      const data = await res.json();
      await setPokeDataArr(data);
      await setNextURL(data[0].next);
      await setPrevURL(data[0].prev);
    } catch (error) {
      console.error("error");
    }
  };
  const handlePrevClick = async () => {
    if (prevURL) {
      setIsLoading(true);
      await getAllPokemonData(prevURL);
      setIsLoading(false);
    }
  };

  const handleNextClick = async () => {
    if (nextURL) {
      setIsLoading(true);
      await getAllPokemonData(nextURL);
      setIsLoading(false);
    }
  };
  const getInputVal = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputVal(e.target.value);
  };
  const sendnum = async () => {
    if (inputVal === null) return;
    if (inputVal === "BTC5") {
      setIsLoading(true);
      setPokeDataArr(orgObj2);
      setIsLoading(false);
    } else if (0 < Number(inputVal && Number(inputVal) < 998)) {
      let serchURL = "";
      serchURL = `https://pokeapi.co/api/v2/pokemon/?offset=${
        Number(inputVal) - 1
      }&limit=20`;
      setIsLoading(true);
      await getAllPokemonData(serchURL);
      setIsLoading(false);
    } else return;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllPokemonData(initURL);
      await setIsLoading(false);
      // console.log(orgObj2);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading">ロード中…</div>
      ) : (
        <>
          <div className="search-area">
            <input
              className="search-num"
              type="text"
              placeholder="1~997の半角数字"
              onChange={getInputVal}
            />
            <button onClick={sendnum}>探す</button>
          </div>
          <div className="top-button">
            <button className="prev" onClick={handlePrevClick}>
              戻る
            </button>
            <button className="next" onClick={handleNextClick}>
              次へ
            </button>
          </div>
          <div className="cards-container">
            {pokeDataArr.map((poke, i) => (
              <div key={i} className="card">
                <div className="id">図鑑番号: {poke.id}</div>
                <img src={poke.imgURL} alt="pokefig" />
                <div className="name">
                  {poke.engName} / {poke.jpName}
                </div>
                <div className="size">大きさ: {poke.height}</div>
                <div className="weight">重さ: {poke.weight}</div>
                <div className="type">タイプ: {poke.type}</div>
              </div>
            ))}
          </div>
          <div>
            <button className="prev" onClick={handlePrevClick}>
              戻る
            </button>
            <button className="next" onClick={handleNextClick}>
              次へ
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Dict;
