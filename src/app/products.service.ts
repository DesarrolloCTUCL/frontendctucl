import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {

	constructor(private prismaService: PrismaService) { }
	create(createProductDto: CreateProductDto) {
		return this.prismaService.product.create({
			data: createProductDto
		})
	}

	findAll() {
		return this.prismaService.product.findMany();
	}

	async findOne(id: number) {
		const productFound = await this.prismaService.product.findUnique({
			where: {
				id: id
			}
		})
		if (!productFound) {
			throw new NotFoundException(`Product with id ${id} not found`)
		}
		return productFound;
	}

	async update(id: number, updateProductDto: UpdateProductDto) {
		const productUpdate = await this.prismaService.product.update({
			where:{
				id
			},
			data:updateProductDto
		})
		if (!productUpdate) {
			throw new NotFoundException(`Product with id ${id} not found`)
		}
		return productUpdate;
	}

	async remove(id: number) {
		const deletedProduct = await this.prismaService.product.delete({
			where: {
				id
			}
		})
		if (!deletedProduct) {
			throw new NotFoundException(`Product with id ${id} not found`)
		}
		return deletedProduct;
	}
}
