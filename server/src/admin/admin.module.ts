import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/user.schema';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminRepository } from './admin.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard, AdminRepository],
})
export class AdminModule {}
