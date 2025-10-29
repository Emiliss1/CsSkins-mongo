import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { CaseCreateDto } from './dto/case-create.dto';
import { Case } from './case.schema';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  createCase(@Body() caseCreateDto: CaseCreateDto): Promise<void> {
    return this.casesService.createCase(caseCreateDto);
  }

  @Get()
  getCases(): Promise<Case[]> {
    return this.casesService.getCases();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:caseId')
  deleteCase(@Param('caseId') caseId: string): Promise<void> {
    return this.casesService.deleteCase(caseId);
  }
}
