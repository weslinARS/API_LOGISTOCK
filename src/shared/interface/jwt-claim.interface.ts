import { $Enums } from "~gen-prisma/index";

export interface JwtClaim {
	id: string;
	email: string;
	role: $Enums.UserRole;
}
