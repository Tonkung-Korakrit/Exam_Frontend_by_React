import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button className="text-red-500 font-bold" onClick={() => setCount(count + 1)}>
        Click Check
      </button>
      <p className="text-green-500 font-bold">Count: {count}</p>
    </>
  );
}

export default App;
