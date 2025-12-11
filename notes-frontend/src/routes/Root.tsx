import { Container } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav style={{ padding: "1rem", background: "#f0f0f0"}}>
        <NavLink to="/">Home</NavLink> | <NavLink to="/login">Login</NavLink>
      </nav>
      <Container fluid className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
