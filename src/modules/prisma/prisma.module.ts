import { Global, Module } from "@nestjs/common";
import { UserRepository } from "src/repositories/user.repository";
import { USER_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { PrismaService } from "./prisma.service";
@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: USER_REPOSITORY_SYMBOL,
			useClass: UserRepository,
		},
	],
	exports: [PrismaService, USER_REPOSITORY_SYMBOL],
})
export class PrismaModule {}
