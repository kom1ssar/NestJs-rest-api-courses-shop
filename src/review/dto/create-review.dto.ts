import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@Min(1, { message: 'Минимальное значение рейтинга 1' })
	@Max(5, { message: 'Максимальное значение рейтинга 5' })
	@IsNumber()
	rating: number;

	@IsString()
	productId: string;
}
