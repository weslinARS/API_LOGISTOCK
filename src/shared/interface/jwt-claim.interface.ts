import { $Enums } from "@prisma/client";

export interface JwtClaim {
	id: string;
	email: string;
	role: $Enums.UserRole;
}
