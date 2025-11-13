import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  // On importe l'accès au "Repository" de l'entité Game
  imports: [TypeOrmModule.forFeature([Game])],
  
  // On déclare le "serveur" et le "chef" de ce module
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}