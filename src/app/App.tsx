import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Newscolar from "@/pages/Newscolar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newscolar" element={<Newscolar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
