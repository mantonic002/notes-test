import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NotesModule, MongooseModule.forRoot('mongodb://localhost:27017'), AuthModule, UsersModule],
})
export class AppModule {}
