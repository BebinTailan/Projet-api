// src/auth/auth.controller.ts

import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: any) {
    
    // --- CORRECTION ---
    // On ne lit plus "loginPayload.username" ici.
    // On passe le body ENTIER (même s'il est undefined) au service.
    // C'est le service qui va le valider.
    const user = await this.authService.validateUser(loginPayload);
    // --- FIN CORRECTION ---

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    return this.authService.login(user);
  }
}