import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {}

	async create(dto: CreateTopPageDto) {
		return await this.topPageModel.create(dto);
	}

	async getById(id: string) {
		return await this.topPageModel.findById(id).exec();
	}

	async getByAlias(alias: string) {
		return await this.topPageModel.findOne({ alias }).exec();
	}

	async getByText(text: string) {
		return await this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
	}

	async getByCategory(firstCategory: TopLevelCategory) {
		return await this.topPageModel
			.aggregate()
			.match({
				firstCategory,
			})
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } },
			})

			.exec();
	}

	async deleteById(id: string) {
		return await this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}
}
