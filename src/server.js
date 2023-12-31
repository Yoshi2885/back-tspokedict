const express = require("express");
const cors = require("cors");
const path = require("path");

const setupServer = () => {
  // knexのセットアップ
  const environment = process.env.NODE_ENV || "development";
  const knexConfig = require("../knexfile")[environment];
  const db = require("knex")(knexConfig);

  const server = express();
  server.use(express.json());
  const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  };

  server.use(cors(corsOptions));
  server.use(express.static("public"));

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
  const randomePokeObj = async () => {
    const randomNo = Math.floor(Math.random() * 1017);
    const urlArr = [`https://pokeapi.co/api/v2/pokemon/${randomNo}`];
    const promises = await urlArr.map((url) =>
      fetch(url).then((res) => res.json())
    );
    const litchDataArr = await Promise.all(promises);
    return [litchDataArr, null, null];
  };
  const selectedPokeObj = async (poke_id) => {
    const urlArr = [`https://pokeapi.co/api/v2/pokemon/${poke_id}`];
    const promises = await urlArr.map((url) =>
      fetch(url).then((res) => res.json())
    );
    const litchDataArr = await Promise.all(promises);
    return [litchDataArr, null, null];
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
  // urlからポケモンの画像を取得するurlのArrを作る
  const getImgURL = (pokeObj) =>
    pokeObj.map((poke) => poke.sprites.other["official-artwork"].front_default);

  // 20匹分のデータから必要な情報だけ抜き出したobjArrを作成
  // 引数：lichDataとjpNameArr
  const makePokeObj = (
    litchDataArr,
    jpNameArr,
    imgURLArr,
    nextURL,
    prevURL
  ) => {
    let resArr = [];
    litchDataArr.map((poke, i) => {
      let pokeObj = {};
      pokeObj.id = poke.id;
      pokeObj.imgURL = imgURLArr[i];
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

  server.get("/", (req, res) => {
    res.status(200);
    // res.send("connect");
    res.sendFile("/index.html");
  });

  server.get("/pokedict", async (req, res) => {
    try {
      const [litchDataArr, nextURL, prevURL] = await getAllPokeObj(
        req.query.url
      );
      const jpNameArr = await getJPName(litchDataArr);
      const imgURLArr = await getImgURL(litchDataArr);
      const resData = await makePokeObj(
        litchDataArr,
        jpNameArr,
        imgURLArr,
        nextURL,
        prevURL
      );
      res.status(200).send(resData);
    } catch (error) {
      res.status(500).send("error");
    }
  });

  server.get("/randomtest", async (req, res) => {
    try {
      const [litchDataArr, nextURL, prevURL] = await randomePokeObj();
      const jpNameArr = await getJPName(litchDataArr);
      const imgURLArr = await getImgURL(litchDataArr);
      const resData = await makePokeObj(
        litchDataArr,
        jpNameArr,
        imgURLArr,
        nextURL,
        prevURL
      );
      res.status(200).send(resData);
    } catch (error) {
      res.status(500).send("error");
    }
  });

  server.post("/postans", async (req, res) => {
    await db("pokedict")
      .insert({
        user_id: 1,
        pokemon_id: req.body.pokemon_id,
        eng_name: req.body.eng_name,
        jp_name: req.body.jp_name,
        img_url: req.body.img_url,
        correct_or_incorrect: req.body.value,
      })
      .then(() => {
        console.log("データの挿入完了");
        res.status(200).send("データの挿入成功");
      })
      .catch((error) => {
        console.log("データの挿入エラー", error);
        res.status(500).send("データの挿入エラー");
      });
  });

  server.get("/table", async (req, res) => {
    const sendTable = await db
      .select("*")
      .from("pokedict")
      .where("correct_or_incorrect", false)
      .then((data) => data);
    res.status(200).send(sendTable);
  });

  server.get("/retry", async (req, res) => {
    const sendTable = await db
      .select("pokemon_id")
      .from("pokedict")
      .where("correct_or_incorrect", false)
      .then((data) => data);
    // ランダムにindexを選ぶ
    const randomIndex = Math.floor(Math.random() * sendTable.length);
    const getRandomId = sendTable[randomIndex].pokemon_id;

    // 図鑑番号からポケモンの情報を拾う
    try {
      const [litchDataArr, nextURL, prevURL] = await selectedPokeObj(
        getRandomId
      );
      const jpNameArr = await getJPName(litchDataArr);
      const imgURLArr = await getImgURL(litchDataArr);
      const resData = await makePokeObj(
        litchDataArr,
        jpNameArr,
        imgURLArr,
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
  return server;
};
module.exports = { setupServer };
