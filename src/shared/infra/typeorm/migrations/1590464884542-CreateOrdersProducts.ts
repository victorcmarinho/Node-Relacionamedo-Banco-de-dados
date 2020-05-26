import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrdersProducts1590464884542 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.createTable(
            new Table({
              name: 'orders_products',
              columns: [
                {
                  name: 'id',
                  type: 'uuid',
                  isPrimary: true,
                  generationStrategy: 'uuid',
                  default: 'uuid_generate_v4()',
                },
                {
                  name: 'order_id',
                  type: 'uuid',
                },
                {
                  name: 'product_id',
                  type: 'uuid',
                },
                {
                  name: 'price',
                  type: 'decimal(10,2)',
                },
                {
                  name: 'quantity',
                  type: 'int',
                },
                {
                  name: 'created_at',
                  type: 'timestamp',
                  default: 'now()',
                },
                {
                  name: 'updated_at',
                  type: 'timestamp',
                  default: 'now()',
                },
              ],
              foreignKeys: [
                {
                  name: 'ProductFK',
                  referencedTableName: 'products',
                  referencedColumnNames: ['id'],
                  columnNames: ['product_id'],
                  onDelete: 'CASCADE',
                  onUpdate: 'CASCADE',
                },
                {
                  name: 'OrderFK',
                  referencedTableName: 'orders',
                  referencedColumnNames: ['id'],
                  columnNames: ['order_id'],
                  onDelete: 'CASCADE',
                  onUpdate: 'CASCADE',
                },
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders_products');
    }

}
