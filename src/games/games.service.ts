// src/games/games.service.ts
import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
  BadRequestException, // On importe l'erreur 400
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { readFileSync } from 'fs';
import { join } from 'path';

// Un "type" pour décrire la structure des données d'un jeu
// C'est ce que nous validons manuellement
type GamePayload = {
  name: string;
  published_at: number;
  min_players: number;
  max_players: number;
  duration: number;
  age_min: number;
};
type UpdateGamePayload = Partial<GamePayload>; // Pour la mise à jour (champs optionnels)

@Injectable()
export class GamesService implements OnModuleInit {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  // --- REMPLISSAGE (Seeding) ---
  async onModuleInit() {
    this.logger.log('Vérification de la BDD pour le remplissage...');
    const count = await this.gamesRepository.count();

    if (count > 0) {
      this.logger.log('La BDD contient déjà des jeux. Remplissage ignoré.');
      return;
    }

    this.logger.log('Base de données vide. Démarrage du remplissage...');
    try {
      const filePath = join(process.cwd(), 'bgg_dataset.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const gamesToSeed: Game[] = JSON.parse(fileContent);
      await this.gamesRepository.save(gamesToSeed);
      this.logger.log(`Remplissage terminé ! ${gamesToSeed.length} jeux ajoutés.`);
    } catch (error) {
      this.logger.error('Erreur pendant le remplissage :', error.stack);
    }
  }

  // --- VALIDATION MANUELLE ---
  // Une fonction privée pour valider le "payload" (les données du body)
  private validatePayload(payload: UpdateGamePayload) {
    const errors: string[] = [];

    // On vérifie les champs *s'ils sont présents*
    if (payload.name !== undefined && payload.name.trim() === '') {
      errors.push('Le champ "name" ne peut pas être vide.');
    }
    if (payload.min_players !== undefined && payload.min_players < 1) {
      errors.push('min_players doit être un nombre positif.');
    }
    if (payload.age_min !== undefined && payload.age_min < 1) {
      errors.push('age_min doit être un nombre positif.');
    }
    // ... ajoutez d'autres vérifications ici ...

    // Si on a trouvé des erreurs, on les renvoie toutes
    if (errors.length > 0) {
      throw new BadRequestException(errors); // Renvoie une erreur 400
    }
  }

  // --- LOGIQUE "READ" (Lecture) ---

  // GET /games (avec pagination)
  findAll(limit: number, offset: number): Promise<Game[]> {
    return this.gamesRepository.find({
      order: { name: 'ASC' }, // Tri alphabétique (bonus du brief)
      take: limit,
      skip: offset,
    });
  }

  // GET /games/[id]
  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOneBy({ id: id });
    if (!game) {
      throw new NotFoundException(`Le jeu avec l'ID ${id} n'a pas été trouvé.`);
    }
    return game;
  }

  // --- LOGIQUE "CREATE" (Ajout) ---

  // POST /games
  async create(payload: GamePayload): Promise<Game> {
    // 1. Valider le payload
    this.validatePayload(payload);
    
    // 2. Créer l'objet
    const newGame = this.gamesRepository.create(payload);

    // 3. Sauvegarder en BDD
    try {
      return await this.gamesRepository.save(newGame);
    } catch (error) {
      // Gérer les erreurs (ex: si on remet 'unique' sur 'name' plus tard)
      throw new BadRequestException(error.message);
    }
  }

  // --- LOGIQUE "UPDATE" (Mise à jour) ---

  // PUT /games/[id]
  async update(id: number, payload: UpdateGamePayload): Promise<Game> {
    // 1. Valider les champs qui sont envoyés
    this.validatePayload(payload);

    // 2. 'preload' trouve le jeu par ID et fusionne les nouvelles données
    const game = await this.gamesRepository.preload({
      id: id,
      ...payload,
    });

    // 3. Si 'preload' renvoie undefined, le jeu n'existe pas
    if (!game) {
      throw new NotFoundException(`Le jeu avec l'ID ${id} n'a pas été trouvé.`);
    }

    // 4. Sauvegarder l'entité fusionnée
    return this.gamesRepository.save(game);
  }

  // --- LOGIQUE "DELETE" (Suppression) ---

  // DELETE /games/[id]
  async remove(id: number): Promise<void> {
    // 1. Essayer de supprimer
    const result = await this.gamesRepository.delete(id);

    // 2. Si 'affected' (lignes touchées) est 0, le jeu n'a pas été trouvé
    if (result.affected === 0) {
      throw new NotFoundException(`Le jeu avec l'ID ${id} n'a pas été trouvé.`);
    }
  }
}