import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Newscolar from "@/pages/Newscolar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newscolar" element={<Newscolar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
