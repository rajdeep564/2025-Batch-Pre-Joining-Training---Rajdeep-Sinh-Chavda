import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/Layout";
import ProductList from "./pages/ProductList";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<AppLayout><ProductList /></AppLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
