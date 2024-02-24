import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';
import { PaginationQueryDto, ParseIntPipe, Protocol, Public } from 'src/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @UsePipes(ValidationPipe)  all the pipes in the controller

@ApiTags('coffees')
@ApiResponse({ status: 403, description: 'Forbidden.' })
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  // @UsePipes(ValidationPipe) only for the specific method
  // @SetMetadata('isPublic', true)

  @Public() // custom decorator
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    //await new Promise((resolve) => setTimeout(resolve, 5000));ç
    console.log(protocol);
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    //console.log(id);
    return this.coffeeService.findOne(id);
  }

  @Post()
  //   @HttpCode(HttpStatus.CREATED)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    // @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}
