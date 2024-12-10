import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CovidService } from './covid.service';
import { CovidData } from './dto/covid-data.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('covid')
export class CovidController {
  constructor(private readonly covidService: CovidService) {}

  @Get('external')
  async getExternalData() {
    try {
      return await this.covidService.fetchExternalData();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch external data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  getStoredData() {
    try {
      return this.covidService.getStoredData();
    } catch (error) {
      throw new HttpException(
        error.message || 'No data available',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Post()
  saveData(@Body() body: CovidData) {
    return this.covidService.saveData(body);
  }

  @Put(':id')
  updateData(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() body: CovidData
  ) {
    try {
      return this.covidService.updateData(id, body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update data',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Delete(':id')
  deleteData(@Param('id', ParseUUIDPipe) id: string) { 
    try {
      return this.covidService.deleteData(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete data',
        HttpStatus.NOT_FOUND
      );
    }
  }
}
