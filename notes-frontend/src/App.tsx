import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoteForm from "./pages/NoteForm";
import { useAuth } from "./hooks/useAuth";
import CustomNavbar from "./pages/components/CustomNavbar";

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
