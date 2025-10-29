import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SkinsService } from './skins.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Skin } from './skin-schema';
import { SkinsCreateDto } from './dto/skins.create.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('skins')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.USER, Role.ADMIN)
export class SkinsController {
  constructor(private skinsService: SkinsService) {}

  @Post()
  createSkin(
    @Body() skinsCreateDto: SkinsCreateDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.skinsService.createSkin(skinsCreateDto, user);
  }

  @Get()
  getSkins(@GetUser() user: User): Promise<Skin[]> {
    return this.skinsService.getSkins(user);
  }
}
