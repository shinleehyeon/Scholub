import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { NewscolatorPage } from "@/pages/newscolator";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import ComponentTest from "@/pages/ComponentTest";
import { InterestAreasPage } from "@/pages/interest-areas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newscolar" element={<NewscolatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/interest-areas" element={<InterestAreasPage />} />
        <Route path="/component-test" element={<ComponentTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
