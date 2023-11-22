import { useEffect, useState } from "react";
import "./List.css";

const rootURL =
  import.meta.env.VITE_API_URL || "https://pokedict.onrender.com/";
const dbGetURL = `${rootURL}table`;

interface DBTable {
  id: number;
  user_id: number;
  pokemon_id: number;
  eng_name: string;
  jp_name: string;
  img_url: string;
  correct_or_incorrect: boolean;
}
[];
function List() {
  const [data, setData] = useState<DBTable[]>([]);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const response = await fetch(dbGetURL);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };

    fetchDB();
  }, []);

  return (
    <>
      <div className="top-q">あなたが間違えたポケモンはこちらです</div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>図鑑番号</th>
              <th className="image-text">すがた</th>
              <th>日本語名</th>
              <th>英語名</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.pokemon_id}</td>
                <td className="image-cell">
                  <img src={item.img_url} alt={item.jp_name} />
                </td>
                <td>{item.jp_name}</td>
                <td>{item.eng_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default List;
