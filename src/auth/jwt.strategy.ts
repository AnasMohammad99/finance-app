/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UnauthorizedException } from "@nestjs/common";
import * as dotenv from 'dotenv';


dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
      sessionStorage: false,
    });
  }

  async validate(payload: any) {
    try {      
      const token = await this.authService.validateToken(payload.user.tokenId);
      if (!token) {
        throw new UnauthorizedException();
      }
      return {
        token_id: payload.user.token_id,
        user_id: payload.user.user_id,
        role: payload.user.role,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
