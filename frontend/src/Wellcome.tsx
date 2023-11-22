import "./Wellcome.css";

function Wellcome() {
  return (
    <>
      <div>ポケモンの世界へようこそ</div>
      <img className="poke-dict-fig" src="/pokedict.png" alt="vite" />

      <div className="second-message">
        150匹いると言ったが、あれはウソじゃ。
      </div>
      <img className="okido" src="/okido.png" alt="vite" />
      <div>ワシと一緒にポケモンの名前を覚えるのじゃ。</div>
    </>
  );
}

export default Wellcome;
