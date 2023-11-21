/**
 * ここが server.js で作ったサーバーになります。
 * もし、サーバーを作る関数をエキスポートすることにした場合は、以下のコードを若干修正する必要があります。
 */
const { setupServer } = require("./server");
const cors = require("cors");

const server = setupServer();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

console.log(Number("001"));
