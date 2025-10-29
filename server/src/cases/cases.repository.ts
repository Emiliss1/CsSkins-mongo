import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/auth/user.schema';
import { CaseCreateDto } from './dto/case-create.dto';
import { Case, CaseDocument } from './case.schema';

@Injectable()
export class CasesRepository {
  constructor(@InjectModel(Case.name) private caseModel: Model<CaseDocument>) {}

  async createCase(caseCreateDto: CaseCreateDto): Promise<void> {
    const { caseId, image, name, price } = caseCreateDto;

    const caseData = new this.caseModel({
      caseId,
      image,
      name,
      price,
    });

    try {
      caseData.save();
    } catch (err) {
      console.log(err.code);
      if (err.code === '23505') {
        throw new ConflictException('this case was already added');
      }
    }
  }

  async getCases(): Promise<Case[]> {
    return this.caseModel.find().lean();
  }

  async deleteCase(caseId: string): Promise<void> {
    const result = await this.caseModel.deleteOne({ caseId });

    if (!result.deletedCount)
      throw new NotFoundException(`case with id (${caseId}) not found`);
  }
}
