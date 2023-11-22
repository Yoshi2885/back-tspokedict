import React from "react";

interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Navbar: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <header className="navbar">
        <button id="Home" onClick={onClick}>
          🏠Home
        </button>
        <button id="Dict" onClick={onClick}>
          📕ポケモン図鑑
        </button>
        <button id="Test" onClick={onClick}>
          ポケモン言えるかな
        </button>
        <button id="List" onClick={onClick}>
          🔎苦手リスト
        </button>
        <button id="Retry" onClick={onClick}>
          🖊再テスト
        </button>
      </header>
    </>
  );
};

export default Navbar;
