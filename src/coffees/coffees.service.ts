import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee, Flavor } from './entities';
import { CreateCoffeeDto } from './dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  findAll() {
    return this.coffeeRepository.find({
      relations: {
        flavors: true,
      },
    });
  }

  findOne(id: string) {
    const coffee = this.coffeeRepository.findOne({
      where: { id: +id },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const newFlavors = await Promise.all(
      createCoffeeDto.flavors.map((flavor) =>
        this.preloadFlavorsByName(flavor),
      ),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors: newFlavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: any) {
    const newFlavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name: string) =>
          this.preloadFlavorsByName(name),
        ),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors: newFlavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorsByName(flavorName: string): Promise<Flavor> {
    const existingFlavors = await this.flavorRepository.findOne({
      where: {
        name: flavorName,
      },
    });

    if (existingFlavors) {
      return existingFlavors;
    }

    return this.flavorRepository.create({ name: flavorName });
  }
}
