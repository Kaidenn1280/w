import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/AboutPage";
import LoginModal from "./components/ui/LoginModal";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/loginmodal" element={<LoginModal onClose={() => { }} />} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
