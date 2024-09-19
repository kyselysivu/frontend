import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './sites/home.jsx';
import Leaderboard from './sites/leaderboard.jsx';
import Kysely from "./sites/Kysely.jsx";

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/questions" element={<Kysely />}></Route>
        <Route path="/leaderboard" element={<Leaderboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);