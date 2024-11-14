import { useEffect, useState } from "./core";

const btnIdDic = {
  increment: "increment",
  decrement: "decrement",
};

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count changed:", count);
    document.title = `Count: ${count}`;

    return () => {
      console.log("Cleaning up effect");
      document.title = "Mini React App";
    };
  }, [count]);

  window.addEventListener("click", (event) => {
    switch (event.target.id) {
      case btnIdDic.increment:
        setCount(count + 1);
        break;
      case btnIdDic.decrement:
        setCount(count - 1);
        break;
      default:
        return;
    }
  });

  const element = document.createElement("div");
  element.innerHTML = `
      <div>
        <h1>Mini React!</h1>
        <div>Count: ${count}</div>
        <button id="${btnIdDic.increment}">Increment</button>
        <button id="${btnIdDic.decrement}">Decrement</button>
      </div>
    `;

  return element;
}
