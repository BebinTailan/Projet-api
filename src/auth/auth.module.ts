// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- On importe ConfigModule

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    // On importe ConfigModule ici pour que AuthModule
    // ait accès au ConfigService.
    ConfigModule,
    
    PassportModule,
    
    // On utilise la configuration "Async" pour être sûr
    // que le .env est lu AVANT de configurer le JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // On dit à JwtModule de l'importer aussi
      inject: [ConfigService], // On l'injecte
      useFactory: async (configService: ConfigService) => {
        
        // On valide la clé ici aussi
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('ERREUR CRITIQUE: JWT_SECRET n\'est pas défini dans le .env');
        }
        
        return {
          secret: secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}