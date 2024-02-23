import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Coffee, Flavor, Event } from './entities';
import { CreateCoffeeDto } from './dto';
import { PaginationQueryDto } from 'src/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    const databaseHost = this.configService.get<string>('DATABASE_HOST');
    console.log(databaseHost);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: {
        flavors: true,
      },
      skip: offset,
      take: limit,
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

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations += 1;
      const recommendedEvent = new Event();
      recommendedEvent.name = 'recommend_coffee';
      recommendedEvent.type = 'coffee';
      recommendedEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendedEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
