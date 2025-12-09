import { Types } from "mongoose";

export class CreateNoteDto {
    note: string;
    userId?: Types.ObjectId;
}
