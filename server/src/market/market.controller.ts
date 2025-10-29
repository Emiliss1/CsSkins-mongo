import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Roles } from 'src/auth/roles.decorator';
import { MarketAddSkinDto } from './dto/market-add-skin.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Skin } from 'src/skins/skin-schema';
import { MarketSkinDto } from './dto/market-skin.dto';

@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch('/addskin')
  addSkin(@Body() marketAddSkinDto: MarketAddSkinDto): Promise<string> {
    return this.marketService.addSkin(marketAddSkinDto);
  }

  @Get('/marketskins')
  getMarketSkins(): Promise<Skin[]> {
    return this.marketService.getMarketSkins();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch('/buymarketskin')
  buyMarketSkin(
    @Body() marketSkinDto: MarketSkinDto,
    @GetUser() user: User,
  ): Promise<string> {
    return this.marketService.buyMarketSkin(marketSkinDto, user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('/usermarketskins')
  userMarketSkins(@GetUser() user: User): Promise<Skin[]> {
    return this.marketService.getUserMarketSkins(user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch('/updateprice')
  updateSkinPrice(@Body() marketSkinDto: MarketSkinDto): Promise<string> {
    return this.marketService.updateSkinPrice(marketSkinDto);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Patch('/removeskin')
  removeSkin(@Body() marketSkinDto: MarketSkinDto): Promise<string> {
    return this.marketService.removeSkin(marketSkinDto);
  }
}
