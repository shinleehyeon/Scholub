import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { NewscolatorPage } from "@/pages/newscolator";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import ComponentTest from "@/pages/ComponentTest";
import { InterestAreasPage } from "@/pages/interest-areas";
import { CategoryPage } from "@/pages/category";
import { ProfilePage } from "@/pages/profile";
import { SettingsPage } from "@/pages/settings";
import { ProfilePhotoPage } from "@/pages/profile-photo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newscolar" element={<NewscolatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile-photo" element={<ProfilePhotoPage />} />
        <Route path="/interest-areas" element={<InterestAreasPage />} />
        <Route path="/component-test" element={<ComponentTest />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
