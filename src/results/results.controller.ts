import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UploadResultDto } from './dtos/upload-result.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller({version: '1', path: 'results'})
export class ResultsController {
    
    
    @Post()
    async upload(@Body() uploadResultDto: UploadResultDto) {}
}
