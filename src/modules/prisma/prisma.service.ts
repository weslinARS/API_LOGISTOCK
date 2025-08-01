import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "~gen-prisma/client";
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			log: ["query", "info", "warn", "error"], // Aquí activas el logging
		});
	}
	async onModuleInit() {
		// activate logging for Prisma queries

		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
