import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "src/shared/decorators/roles/roles.decorator";
import { ROLES } from "src/shared/enums/roles.enum";

@Injectable()
export class PoliceGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const RequiredRoles = this.reflector.getAllAndOverride<ROLES[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token)
			throw new UnauthorizedException("No se ha enviado el token");
		try {
			const payload = await this.jwtService.verifyAsync(token);
			if (!payload)
				throw new UnauthorizedException("Token no válido o expirado");

			if (RequiredRoles) {
				if (!matchRoles(RequiredRoles, payload.role)) {
					throw new ForbiddenException(
						"No tienes permiso para realizar esta accion",
					);
				}
			}
			request["user"] = {
				credential_id: payload.credential_id,
				email: payload.email,
				role: payload.role as ROLES,
			};
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private extractTokenFromHeader(request: any): string {
		const [type, token] =
		request.headers["authorization"]?.split(" ") ?? [];
		if (type === "Bearer" && token) {
			return token;
		}
		throw new UnauthorizedException("Token no válido o no proporcionado");
	}
}

function matchRoles(roles: string[], rol: string): boolean {
	return roles.includes(rol);
}


export class RequestWithUser extends  Request {
	user: {
		credential_id: string;
		email: string;
		role: ROLES;
	};
}