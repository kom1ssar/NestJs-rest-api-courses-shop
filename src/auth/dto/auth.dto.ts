import { IsString, Length } from 'class-validator';

export class AuthDto {
	@IsString()
	login: string;

	@IsString()
	@Length(3, 11, { message: 'Некорректная длина пароля' })
	password: string;
}
