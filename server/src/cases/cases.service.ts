import { Injectable } from '@nestjs/common';
import { CasesRepository } from './cases.repository';
import { CaseCreateDto } from './dto/case-create.dto';
import { Case } from './case.schema';

@Injectable()
export class CasesService {
  constructor(private casesRepository: CasesRepository) {}

  async createCase(caseCreateDto: CaseCreateDto): Promise<void> {
    return this.casesRepository.createCase(caseCreateDto);
  }

  async getCases(): Promise<Case[]> {
    return this.casesRepository.getCases();
  }

  async deleteCase(caseId: string): Promise<void> {
    return this.casesRepository.deleteCase(caseId);
  }
}
