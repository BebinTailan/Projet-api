// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Ajout
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Game } from './games/game.entity';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module'; // Ajout

@Module({
  imports: [
    // 1. Pour lire le .env (doit être en premier)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. La BDD
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ma_base_de_donnees.sqlite',
      entities: [Game],
      synchronize: true,
    }),
    
    // 3. Nos modules métier
    GamesModule,
    AuthModule, // Ajout
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}