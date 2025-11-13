// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Les ajouts de la BDD
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games/game.entity';

// --- 1. IMPORTEZ LE MODULE QUE VOUS AVEZ CRÉÉ ---
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    // La connexion à la BDD SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ma_base_de_donnees.sqlite',
      entities: [Game],
      synchronize: true,
    }),
    
    // --- 2. AJOUTEZ-LE AUX IMPORTS DE L'APPLICATION ---
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}