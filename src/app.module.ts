import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import * as j from "joi";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // hace disponible ConfigService en toda la app
			validationSchema: j.object({
				JWT_SECRET: j.string().required(),
				PORT: j.number().default(3004),
			}),
		}),
		JwtModule.registerAsync({
			global: true,
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: "30d",
				},
			}),
			inject: [ConfigService],
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
	exports: [],
})
export class AppModule {}
