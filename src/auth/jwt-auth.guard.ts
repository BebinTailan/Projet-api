// src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Ce fichier dit juste "utilise la stratégie 'jwt'"
// (celle qu'on a créée dans jwt.strategy.ts)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}