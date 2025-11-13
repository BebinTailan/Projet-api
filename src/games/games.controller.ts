// src/games/games.controller.ts

import { Controller, Get, Query } from '@nestjs/common'; // <-- 1. Importez @Query
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(
    // 2. Lisez les paramètres de l'URL
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    console.log('Appel de la route GET /games avec pagination !');
    
    // 3. Convertissez en nombres (avec des valeurs par défaut)
    const limitNum = limit ? parseInt(limit, 10) : 20; // 20 par défaut
    const offsetNum = offset ? parseInt(offset, 10) : 0; // 0 par défaut

    // 4. Passez-les au service
    return this.gamesService.findAll(limitNum, offsetNum);
  }
}