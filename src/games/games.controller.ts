// src/games/games.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards, // Ajout
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ajout

// Définit les types pour la validation manuelle
type GamePayload = {
  name: string;
  published_at: number;
  min_players: number;
  max_players: number;
  duration: number;
  age_min: number;
};
type UpdateGamePayload = Partial<GamePayload>;

@Controller('games')
@UseGuards(JwtAuthGuard) // <--- L'AJOUT LE PLUS IMPORTANT (Le Videur)
export class GamesController {
  
  // TOUT LE RESTE EST LE CODE QUI FONCTIONNAIT DÉJÀ
  
  constructor(private readonly gamesService: GamesService) {}

  // "READ"
  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.gamesService.findAll(limitNum, offsetNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  // "CREATE"
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: GamePayload) {
    return this.gamesService.create(body);
  }

  // "UPDATE"
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGamePayload,
  ) {
    return this.gamesService.update(id, body);
  }

  // "DELETE"
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }
}