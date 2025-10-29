import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CasesRepository } from './cases.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Case, CaseSchema } from './case.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    AuthModule,
  ],
  controllers: [CasesController],
  providers: [CasesService, CasesRepository, RolesGuard],
})
export class CasesModule {}
