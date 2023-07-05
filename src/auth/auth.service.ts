import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/helpers/bcrypt';
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        try {
            const hashedPassword = await hashPassword(password)
            await this.userRepository.save({
                username,
                password: hashedPassword
            })
        } catch (error) {
            if (error.code === '23505') throw new ConflictException('Username already exists')
            else throw new InternalServerErrorException()
        }
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = signInCredentialsDto;
        const findUser = await this.userRepository.findOne({
            where: {
                username
            }
        });
        if (findUser && (await comparePassword(password, findUser.password))) {
            const payload: JwtPayload = { username }
            const accessToken: string = this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('Please check your login credentials')
        }
    }
}
