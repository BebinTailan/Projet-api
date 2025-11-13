// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // <-- On ré-utilise ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, // <-- On l'injecte
  ) {
    
    // --- C'EST LA CORRECTION 100% ---
    
    // 1. On lit la variable .env
    const secret = configService.get<string>('JWT_SECRET');

    // 2. On la valide. Si elle n'existe pas, on plante avec un message clair.
    if (!secret) {
      throw new Error('ERREUR CRITIQUE: JWT_SECRET n\'est pas défini dans le fichier .env');
    }
    
    // 3. On appelle super() APRES la validation
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 4. TypeScript est content car il SAIT que 'secret' est un string ici.
      secretOrKey: secret, 
    });
  }

  // Cette méthode ne change pas
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}