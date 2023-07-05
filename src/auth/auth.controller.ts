import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private userService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentials: AuthCredentialsDto): Promise<void> {
        return this.userService.signUp(authCredentials);
    }

    @Post('/signin')
    signIn(@Body() signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
        return this.userService.signIn(signInCredentialsDto);
    }
    
}
