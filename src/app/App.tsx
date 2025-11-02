import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Newscolar from "@/pages/Newscolar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ComponentTest from "@/pages/ComponentTest";
import InterestAreas from "@/pages/InterestAreas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newscolar" element={<Newscolar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interest-areas" element={<InterestAreas />} />
        <Route path="/component-test" element={<ComponentTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
