// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly realUser: string;
  private readonly realPass: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const user = this.configService.get<string>('AUTH_USER');
    const pass = this.configService.get<string>('AUTH_PASSWORD');

    if (!user || !pass) {
      throw new Error('ERREUR CRITIQUE: AUTH_USER ou AUTH_PASSWORD ne sont pas définis dans le .env');
    }
    
    this.realUser = user;
    this.realPass = pass;
  }

  /**
   * Vérifie l'utilisateur
   */
  async validateUser(loginPayload: any): Promise<any> { // <-- On reçoit le body entier
    
    // --- CORRECTION ---
    // On valide d'ABORD que le payload et ses clés existent
    if (!loginPayload || typeof loginPayload !== 'object' || !loginPayload.username || !loginPayload.password) {
      // Si le body est vide ou mal formé, on jette une erreur 401 propre
      // au lieu de planter avec un 500
      throw new UnauthorizedException('Format de body invalide. "username" et "password" sont requis.');
    }
    // --- FIN CORRECTION ---

    // Maintenant on peut lire les propriétés en toute sécurité
    const { username, password } = loginPayload;

    const isUsernameCorrect = username === this.realUser;
    const isPasswordMatching = password === this.realPass;

    if (isUsernameCorrect && isPasswordMatching) {
      return { userId: 1, username: 'marcel' };
    }
    
    return null;
  }

  /**
   * Crée le "badge" (token JWT)
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}