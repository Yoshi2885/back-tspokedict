const express = require("express");

const server = express();
server.use(express.json());

const PORT = process.env.PORT || 3000;

// 最初に20匹分の全体データを取得する
const getAllPokeObj = async (url) => {
  const simpleJSON = await fetch(url).then((res) => res.json());
  const nextURL = simpleJSON.next ?? null;
  const prevURL = simpleJSON.previous ?? null;
  const urlArr = await simpleJSON.results.map((poke) => poke.url);
  const promises = await urlArr.map((url) =>
    fetch(url).then((res) => res.json())
  );
  const litchDataArr = await Promise.all(promises);
  return [litchDataArr, nextURL, prevURL];
};
// urlから日本語名を探してくる
const getJPName = async (pokeObj) => {
  const urlArr = pokeObj.map((poke) => poke.species.url);
  const promises = urlArr.map((url) => fetch(url).then((res) => res.json()));
  const JPNameJSON = await Promise.all(promises);
  return JPNameJSON.map(
    (jpName) => jpName.names.find((name) => name.language.name === "ja")?.name
  ).filter((name) => name !== undefined);
};
// 20匹分のデータから必要な情報だけ抜き出したobjArrを作成
// 引数：lichDataとjpNameArr
const makePokeObj = (litchDataArr, jpNameArr, nextURL, prevURL) => {
  let resArr = [];
  litchDataArr.map((poke, i) => {
    let pokeObj = {};
    pokeObj.id = poke.id;
    pokeObj.engName = poke.name;
    pokeObj.jpName = jpNameArr[i];
    pokeObj.height = poke.height;
    pokeObj.weight = poke.weight;
    pokeObj.type = poke.types.map((t) => t.type.name).join(", ");
    pokeObj.next = nextURL;
    pokeObj.prev = prevURL;
    resArr.push(pokeObj);
  });
  return resArr;
};

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

server.get("/", (req, res) => {
  res.status(200);
  res.send("connect");
});

server.get("/pokedict", async (req, res) => {
  try {
    const [litchDataArr, nextURL, prevURL] = await getAllPokeObj(req.query.url);
    const jpNameArr = await getJPName(litchDataArr);
    const resData = await makePokeObj(
      litchDataArr,
      jpNameArr,
      nextURL,
      prevURL
    );
    res.status(200).send(resData);
  } catch (error) {
    res.status(500).send("error");
  }
});

server.get("/error", (req, res) => {
  res.render("pages/error");
});
