import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProducts1590464695040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
              name: 'products',
              columns: [
                {
                  name: 'id',
                  type: 'uuid',
                  isPrimary: true,
                  generationStrategy: 'uuid',
                  default: 'uuid_generate_v4()',
                },
                {
                  name: 'name',
                  type: 'varchar',
                  isUnique: true,
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
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('products');
    }

}
