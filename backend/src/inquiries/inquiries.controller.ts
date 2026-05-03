import { Controller, Get, Post, Body } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  async create(@Body() createInquiryDto: any) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  async findAll() {
    return this.inquiriesService.findAll();
  }
}