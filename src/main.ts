import {
	Logger,
	MiddlewareConsumer,
	Module,
	NestModule,
	ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NextFunction, Request, Response } from "express";
import { writeFileSync } from "fs";
import { join } from "path";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { AppModule } from "./app.module";

// Logger Middleware
function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
	const logger = new Logger("HTTP");

	// Log request details
	logger.log("--------------------------");
	logger.log(`Request URL: ${req.originalUrl}`);
	logger.log(`Method: ${req.method}`);
	logger.log(`Params: ${JSON.stringify(req.params)}`);
	logger.log(`Query: ${JSON.stringify(req.query)}`);
	if (req.body && Object.keys(req.body).length > 0) {
		logger.log(`Body: ${JSON.stringify(req.body)}`);
	}

	// Capture response body
	const originalSend = res.send;
	res.send = function (body) {
		logger.log(`Response Body: ${body}`);
		return originalSend.call(this, body);
	};

	next();
}

@Module({
	imports: [AppModule],
})
export class AppModuleWithLogger implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(loggerMiddleware).forRoutes("*");
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModuleWithLogger);
	const swaggerConfig = new DocumentBuilder()
		.setTitle("NestJS API")
		.setDescription("API PARA EL PROYECTO LOGISTOCK")
		.setVersion("1.0")
		.addBearerAuth({
			type: "http",
			bearerFormat: "Bearer",
			scheme: "Bearer",
			in: "header",
			name: "Authorization",
			description: "Authorization header with JWT token",
		})
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	// Export Swagger JSON to a file
	const outputPath = join(process.cwd(), "swagger.json");
	writeFileSync(outputPath, JSON.stringify(document, null, 2));
	console.log(`Swagger documentation saved to ${outputPath}`);

	const theme = new SwaggerTheme();
	const options = {
		explorer: true,
		customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
	};
	SwaggerModule.setup("api", app, document, options);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidUnknownValues: true,
			stopAtFirstError: true,
			transform: true,
		}),
	);

	app.enableCors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	});
	await app.listen(process.env.PORT ?? 3004);
}

bootstrap();
