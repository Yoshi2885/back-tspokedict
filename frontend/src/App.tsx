import React, { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Wellcome from "./Wellcome";
import Dict from "./Dict";
import Test from "./Test";
import List from "./List";
import Retry from "./Retry";

function App() {
  const [selectContent, setSelectContent] = useState<string>("Home");

  const clickContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectContent(e.currentTarget.id);
  };
  return (
    <>
      <Navbar onClick={clickContent} />
      {/* ボタンによってレンダリングをスイッチング */}
      {selectContent === "Home" && <Wellcome />}
      {selectContent === "Dict" && <Dict />}
      {selectContent === "Test" && <Test />}
      {selectContent === "List" && <List />}
      {selectContent === "Retry" && <Retry />}
    </>
  );
}

export default App;
