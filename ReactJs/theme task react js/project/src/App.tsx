import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ProductProvider } from "./context/ProductContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProductTable from "./components/ProductTable/ProductTable";
import LandingPage from "./components/LandingPage/LandingPage";
import "./styles/global.scss";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const { theme: themeMode } = useTheme();

  const themeConfig = {
    algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: themeMode === "dark" ? "#4a6cf7" : "#4a6cf7",
      borderRadius: 8,
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="app-container">
        <Header />
        <Content className="content-container">
          {/* React Router will render components here */}
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  );
};

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "products", element: <ProductTable /> },
      { path: "*", element: <LandingPage /> }, // Redirect unknown routes
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
