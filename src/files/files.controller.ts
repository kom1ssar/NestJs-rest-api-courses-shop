import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElemtResponse } from './dto/file-elemt.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElemtResponse[]> {
		const saveArray: MFile[] = [new MFile(file)];
		if (file.mimetype.includes('image')) {
			const bufferWebP = await this.filesService.convertToWebP(file.buffer);
			saveArray.push(
				new MFile({ originalname: `${file.originalname.split('.')[0]}.webp`, buffer: bufferWebP }),
			);
		}
		return await this.filesService.saveFiles(saveArray);
	}
}
