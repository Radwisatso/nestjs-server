import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

// Act as Middleware
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRespository: Repository<User>
    ) {
        super({
            secretOrKey: process.env.JWT_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload
        const user: User = await this.userRespository.findOne({ where: { username }})

        if (!user) {
            throw new UnauthorizedException()
        }

        return user;
    }
}