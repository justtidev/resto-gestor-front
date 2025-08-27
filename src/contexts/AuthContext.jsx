import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [storedRefreshToken, setStoredRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [userRole, setUserRole] = useState(() => localStorage.getItem("rol"));
  const [userName, setUserName] = useState(() => localStorage.getItem("username"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const username = payload.user.nombre;
      const rol = payload.user.RolId;
      const id = payload.user.id;

      setUserName(username);
      setUserRole(rol);
      setUserId(id);

      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);
      localStorage.setItem("userId", id);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUserName(null);
      setUserRole(null);
      setUserId(null);
      localStorage.removeItem("username");
      localStorage.removeItem("rol");
      localStorage.removeItem("userId");
    }
  }, [token]);

  const login = async (usuario, contraseña) => {
    try {
      const response = await axios.post("/auth/login", { usuario, contraseña });
      const accessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      const payloadBase64 = accessToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const username = payload.user.nombre;
      const rol = payload.user.RolId;
      const id = payload.user.id;

      setToken(accessToken);
      setStoredRefreshToken(newRefreshToken);
      setUserName(username);
      setUserRole(rol);
      setUserId(id);

      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);
      localStorage.setItem("userId", id);

      return { accessToken, newRefreshToken, userName, userRole };
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error inesperado al iniciar sesión.");
    }
  };

  const register = async (usuario) => {
    await axios.post("/auth/register", { usuario });
  };

  const refreshAccessToken = async () => {
    if (!storedRefreshToken) return;

    try {
      const response = await axios.post("/auth/refresh", { token: storedRefreshToken });
      const newAccessToken = response.data.accessToken;

      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      const payloadBase64 = newAccessToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));

      setUserName(payload.user.nombre);
      setUserRole(payload.user.RolId);
      setUserId(payload.user.id);

      localStorage.setItem("username", payload.user.nombre);
      localStorage.setItem("rol", payload.user.RolId);
      localStorage.setItem("userId", payload.user.id);
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setStoredRefreshToken(null);
    setUserName(null);
    setUserRole(null);
    setUserId(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("userId");

    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          storedRefreshToken
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post("/auth/refresh", { token: storedRefreshToken });
            const newAccessToken = response.data.accessToken;

            setToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);

          
            axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            //Decodifica el nuevo token y actualiza datos usuarios
              const payloadBase64 = newAccessToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const username = payload.user.nombre;
      const rol = payload.user.RolId;
      const id = payload.user.id;

   
      setUserName(username);
      setUserRole(rol);
      setUserId(id);

      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);
      localStorage.setItem("userId", id);


            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [storedRefreshToken]);

  useEffect(() => {
    const validarSesion = async () => {
      if (!token && storedRefreshToken) {
        await refreshAccessToken();
      }
      setIsAuthLoading(false);
    };
    validarSesion();
  }, []);

  return isAuthLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-cream text-xl text-textPrimary">
      <div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full mr-4"></div>
      Cargando sesión...
    </div>
  ) : (
    <AuthContext.Provider
      value={{
        userName,
        userRole,
        userId,
        token,
        login,
        logout,
        refreshAccessToken,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
