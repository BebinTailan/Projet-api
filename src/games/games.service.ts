// src/games/games.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class GamesService implements OnModuleInit {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) { }

  // ... votre fonction onModuleInit (ne pas y toucher) ...
  async onModuleInit() {
    // ... tout votre code de remplissage est ici ...
  }


  // --- MODIFIONS NOTRE MÉTHODE FINDALL ---

  // 1. Acceptez les arguments limit et offset
  findAll(limit: number, offset: number): Promise<Game[]> {

    console.log(`Appel de findAll dans le service (limit=${limit}, offset=${offset})`);

    // 2. Passez-les à TypeORM
    return this.gamesRepository.find({

      // Ajout du brief : ordonné par défaut dans l'ordre alphabétique
      order: {
        name: 'ASC',
      },

      // La pagination
      take: limit, // "Prends" 10 (ou 20)
      skip: offset, // "Saute" 0 (ou 10, ou 20...)
    });
  }
}