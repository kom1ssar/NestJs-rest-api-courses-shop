import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { BAD_PASSWORD_ERROR, USER_NOT_FOUND_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(7);
		const newUser = new this.UserModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async findUser(email: string) {
		return this.UserModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const candidate = await this.findUser(email);
		if (!candidate) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(password, candidate.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(BAD_PASSWORD_ERROR);
		}
		return { email: candidate.email };
	}

	async login(email: string) {
		const payLoad = { email };
		return {
			access_token: await this.jwtService.signAsync(payLoad),
		};
	}
}
