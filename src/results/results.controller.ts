import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UploadResultDto } from './dtos/upload-result.dto';

@UseGuards(AuthGuard)
@Controller({version: '1', path: 'results'})
export class ResultsController {
    
    
    @Post()
    async upload(@Body() uploadResultDto: UploadResultDto) {}
}
