import React from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

import Login from "./pages/LogIn";
import Menu from "./pages/Menu";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LayoutAdmin from "./admin/LayoutAdmin";
import UsuarioIndex from "./admin/usuario";
import FormularioUsuario from "./admin/usuario/formulario";
import CategoriaIndex from "./admin/categoria";
import FormularioCategoria from "./admin/categoria/formulario";
import ImagenIndex from "./admin/imagen";
import FormularioImagen from "./admin/imagen/formulario";
import MenuIndex from "./admin/menu";
import FormularioMenu from "./admin/menu/formulario";
import MesaIndex from "./admin/mesa";
import FormularioMesa from "./admin/mesa/formulario";
import AdminDashboard from "./admin/AdminDashboard";

import Comanda from "./pages/Comanda";
import CierreCaja from "./pages/CierreCaja";
import HistoricoCierreCaja from "./pages/HistoricoCierreCaja";

function ProtectedRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu?mesa:id" element={<Menu />} />
            <Route
              path="/register"
              element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/comanda/:id" element={<Comanda />} />
           
            <Route path="/cierre" element={<CierreCaja />} />
            <Route path="/cierre/historico" element={<HistoricoCierreCaja />} />
            /////////Administracion
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <LayoutAdmin />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="usuario" element={<UsuarioIndex />} />
              <Route path="usuario/:id" element={<FormularioUsuario />} />
              <Route path="categoria" element={<CategoriaIndex />} />
              <Route path="categoria/:id" element={<FormularioCategoria />} />
              <Route path="imagen" element={<ImagenIndex />} />
              <Route path="imagen/:id" element={<FormularioImagen />} />
              <Route
                path="imagen/menuItem/:id"
                element={<FormularioImagen />}
              />

              <Route path="menuItem" element={<MenuIndex />} />
              <Route path="menuItem/:id" element={<FormularioMenu />} />
              <Route path="mesa" element={<MesaIndex />} />
              <Route path="mesa/:id" element={<FormularioMesa />} />
            </Route>
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
