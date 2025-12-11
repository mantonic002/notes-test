import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { House, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export default function Root() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const username = (() => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || "User";
    } catch {
      return null;
    }
  })();

  return (
    <>
      <Navbar
        bg="secondary"
        variant="secondary"
        expand="lg"
        className="shadow-sm"
      >
        <Container fluid="xl">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <House size={22} />
            MyNotes
          </Navbar.Brand>

          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  className="d-flex align-items-center gap-2 border-0"
                  style={{ background: "transparent" }}
                >
                  <PersonCircle size={20} />
                  {username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item disabled className="small text-muted">
                    Signed in as <strong>{username}</strong>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      logout();
                      navigate("login");
                    }}
                    className="text-danger d-flex align-items-center gap-2"
                  >
                    <BoxArrowRight />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container fluid="xl" className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
