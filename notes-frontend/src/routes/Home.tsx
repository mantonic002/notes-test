import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
import { useState } from "react";

export default function Home() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page],
    queryFn: () =>
      api.get(`/notes?page=${page}&size=${pageSize}`).then((res) => res.data),
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
  const totalPages = Math.ceil(count / pageSize);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Notes</h1>
        <Link to="/notes/new" className="btn btn-success">
          + New Note
        </Link>
      </div>

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
                    className="btn btn-outline-secondary"
                  >
                    <Pencil />
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteMutation.mutate(note._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash3 />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-5">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="align-self-center">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
}
