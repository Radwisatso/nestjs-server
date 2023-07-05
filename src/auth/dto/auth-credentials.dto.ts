import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8, {
        message: "Password must be longer than or equal to 8 characters"
    })
    @MaxLength(20, {
        message: "Password must be shorter than or equal to 20 characters"
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,  {
        message: 'Password must contain at least one number or special character, one lowercase letter, and one uppercase letter'
        // message: (options) => {
        //     if (!options.value.match(/\d/) || !options.value.match(/\W/)) {
        //         return 'Password must contain at least one number or special character.';
        //     }
        //     if (!options.value.match(/[a-z]/)) {
        //         return 'Password must contain at least one lowercase letter.';
        //     }
        //     if (!options.value.match(/[A-Z]/)) {
        //         return 'Password must contain at least one uppercase letter.';
        //     }
        //     return 'Password must be 8-20 characters long.';
        // },
    })
    password: string
}