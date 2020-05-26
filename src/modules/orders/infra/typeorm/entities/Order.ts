import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(_ => Customer, {eager: true})
  @JoinColumn({name: 'customer_id'})
  customer: Customer;

  @OneToMany(_ => OrdersProducts, order_products => order_products.product, {
    cascade: true,
    eager: true
  })
  order_products!: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
