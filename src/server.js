const express = require("express");

const server = express();
server.use(express.json());

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

server.get("/", (req, res) => {
  res.status(200);
  res.send("connect");
});

server.get("/pokedict", async (req, res) => {
  const getAllPoke = async (url) => {
    const simpleJSON = await fetch(url).then((res) => res.json());
    const urlArr = await simpleJSON.results.map((poke) => poke.url);
    const promises = await urlArr.map((url) =>
      fetch(url).then((res) => res.json())
    );
    const litchDataArr = await Promise.all(promises);
    console.log(litchDataArr);
    return litchDataArr;
  };
  try {
    const sendData = await getAllPoke("https://pokeapi.co/api/v2/pokemon/");
    console.log(sendData);
    res.status(200).send(sendData);
  } catch (error) {
    res.status(500).send("error");
  }
});

server.get("/error", (req, res) => {
  res.render("pages/error");
});
