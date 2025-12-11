import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import type { Note } from "../types/note";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { Trash3, Pencil } from "react-bootstrap-icons";
import CustomPagination from "./components/CustomPagination";

export default function Home() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", searchParams.get("page")],
    queryFn: () =>
      api
        .get("/notes", {
          params: Object.fromEntries(searchParams),
        })
        .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  if (isLoading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">Failed to load notes</Alert>;

  const { notes = [], count = 0 } = data || {};

  return (
    <Container className="py-5">
      <Link
        to="/notes/new"
        className="btn btn-primary btn-lg rounded-circle shadow position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center"
        style={{
          width: "60px",
          height: "60px",
          fontSize: "2rem",
          zIndex: 1050,
        }}
      >
        +
      </Link>
      {notes.length === 0 ? (
        <Alert variant="info">No notes yet. Create your first one!</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {notes.map((note: Note) => (
            <Col key={note._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Text className="flex-grow-1">{note.note}</Card.Text>
                  <small className="text-muted">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end gap-2">
                  <Link
                    to={`/notes/${note._id}/edit`}
                    state={{ note }}
                    className="btn btn-outline-secondary align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <Pencil />
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteMutation.mutate(note._id)}
                    disabled={deleteMutation.isPending}
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <Trash3 />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <CustomPagination totalCount={count} />
    </Container>
  );
}
