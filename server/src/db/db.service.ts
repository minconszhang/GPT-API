import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    getPool(): Pool {
        return this.pool;
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
