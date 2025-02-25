import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd"; 
import Dashboard from "./pages/Dashboard";
import BankOperations from "./pages/BankOperations"; 
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "antd/dist/reset.css"; 

import { useAuthContext } from "./hooks/useAuthContext";

const { Content } = Layout; 

function App() {
  const { kullanici } = useAuthContext();

  return (
    <Layout style={{ minHeight: "100vh" }}> 
      <BrowserRouter>
        <Navbar />
        <Content style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
          <Routes>
            <Route path="/banka" element={kullanici ? <Dashboard /> : <Navigate to="/login" />} />

      
            <Route path="/banka/islemler" element={kullanici ? <BankOperations /> : <Navigate to="/login" />} />

            <Route path="/login" element={!kullanici ? <Login /> : <Navigate to="/banka" />} />
            <Route path="/signup" element={!kullanici ? <Signup /> : <Navigate to="/banka" />} />

            <Route path="*" element={<Navigate to={kullanici ? "/banka" : "/login"} />} />
          </Routes>
        </Content>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
