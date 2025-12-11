import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import NoteForm from "./components/pages/NoteForm";
import { useAuth } from "./hooks/useAuth";
import CustomNavbar from "./components/common/CustomNavbar";
import Register from "./components/pages/Register";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isAuthenticated && <CustomNavbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />

        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="notes/new" element={<NoteForm />} />
          <Route path="notes/:id/edit" element={<NoteForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
