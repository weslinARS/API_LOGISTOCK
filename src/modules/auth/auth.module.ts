import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [PrismaModule],
})
export class AuthModule {}
