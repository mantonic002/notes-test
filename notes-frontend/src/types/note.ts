export type Note = {
  _id: string;
  note: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type CreateNoteDto = {
  note: string;
};

export type UpdateNoteDto = CreateNoteDto;
