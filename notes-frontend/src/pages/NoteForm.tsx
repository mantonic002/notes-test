import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import type { Note } from "../types/note";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export default function NoteForm() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const preloadedNote = location.state?.note as Note | undefined;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const initialNoteText = isEdit ? (preloadedNote?.note ?? "") : "";

  const [noteText, setNoteText] = useState(initialNoteText);

  const mutation = useMutation({
    mutationFn: (data: { note: string }) =>
      isEdit ? api.put(`/notes/${id}`, data) : api.post("/notes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    mutation.mutate({ note: noteText });
  };

  if (isEdit && !preloadedNote)
    return <Alert variant="danger">Note not found. Go back to list.</Alert>;

  return (
    <Container className="py-5">
      <Card className="max-w-2xl mx-auto shadow">
        <Card.Body className="p-5">
          <h2 className="mb-4">{isEdit ? "Edit Note" : "New Note"}</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Your note</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write something..."
                required
              />
            </Form.Group>

            <div className="d-flex gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Form>

          {mutation.isError && (
            <Alert variant="danger" className="mt-3">
              Failed to save note
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
