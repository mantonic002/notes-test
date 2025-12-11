import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ClipboardHeart } from "react-bootstrap-icons";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { register, isRegistering, registerError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;

    register(
      { username, password },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "32rem" }} className="shadow">
        <Card.Body className="p-5">
          <div className="d-flex flex-row align-items-center gap-2 mb-3">
            <ClipboardHeart size={50} className="text-warning mb-2" />
            <h2 className="fw-bold fs-1 text-warning">MyNotes</h2>
            <h2 className="fs-1 text-muted">Register</h2>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat the same password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </Form.Group>

            <p>
              {" "}
              Already have an account? <Link to={"register"}> Login </Link>{" "}
            </p>

            <Button
              variant="outline-warning"
              type="submit"
              className="w-100"
              disabled={isRegistering}
            >
              {isRegistering ? "Registering..." : "Register"}
            </Button>
          </Form>

          {registerError && (
            <Alert variant="danger" className="mt-3">
              {registerError || "Invalid credentials"}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
