import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games') // Nom de la table dans la BDD
export class Game {
  @PrimaryGeneratedColumn() // Clé primaire auto-incrémentée (1, 2, 3...)
  id: number;

  @Column() // Le nom du jeu doit être unique
  name: string;

  @Column({ type: 'int', nullable: true })
  published_at: number;

  @Column({ type: 'int' })
  min_players: number;

  @Column({ type: 'int' })
  max_players: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'int' })
  age_min: number;
}
