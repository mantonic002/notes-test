import { Routes, Route, Navigate } from "react-router-dom";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { Container } from "react-bootstrap";
import NoteForm from "./routes/NoteForm";

function App() {
  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="notes/new" element={<NoteForm />} />
          <Route path="notes/:id/edit" element={<NoteForm />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
