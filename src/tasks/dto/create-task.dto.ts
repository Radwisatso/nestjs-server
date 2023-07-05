import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { TransformFnParams } from 'class-transformer';


export class CreateTaskDto {
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => {
        return value?.trim()
    })
    title: string;

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => {
        return value?.trim()
    })
    description: string
}