import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    NotesModule,

    MongooseModule.forRoot(process.env.DB_CONN_STRING || ''),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
