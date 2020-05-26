import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    
    const productRegistered = this.productsRepository.findByName(name);

    if(productRegistered)
      throw new AppError('Product is already registerd');

    const product = this.productsRepository.create({ name, price, quantity });
    
    return product;
  }
}

export default CreateProductService;
