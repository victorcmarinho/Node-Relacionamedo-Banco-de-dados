import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) throw new AppError('Invalid customer id.');
    const foundProducts = await this.productsRepository.findAllById(
      products.map(product => ({
        id: product.id,
      })),
    );
    if (foundProducts.length !== products.length)
      throw new AppError('Invalid product id.');

    const updatedQuantities: Product[] = [];
    const updatedProducts = foundProducts.map(foundProduct => {
      const orderProduct = products.find(
        product => product.id === foundProduct.id,
      );
      if (orderProduct) {
        if (orderProduct.quantity > foundProduct.quantity) {
          throw new AppError(
            `Product ${foundProduct.name} (${foundProduct.id}) only has
            ${foundProduct.quantity} available in stock, but
            ${orderProduct.quantity} is being requested in this order`,
          );
        }
        updatedQuantities.push({
          ...foundProduct,
          quantity: foundProduct.quantity - orderProduct.quantity,
        });

        return {
          ...foundProduct,
          quantity: orderProduct.quantity,
        };
      }

      return foundProduct;
    });

    const order = await this.ordersRepository.create({
      customer,
      products: updatedProducts.map(updatedProduct => ({
        product_id: updatedProduct.id,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
      })),
    });

    await this.productsRepository.updateQuantity(updatedQuantities);

    return order;

  }
}

export default CreateOrderService;
