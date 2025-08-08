import * as bcrypt from "bcryptjs";
import { $Enums, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
interface signUpUser {
	firstName: string;
	lastName: string;
	role: $Enums.UserRole;
	email: string;
	password: string;
}

const user: signUpUser = {
	firstName: "logistock",
	lastName: "admin",
	role: "admin",
	email: "admin@logistock.com",
	password: "admin123456",
};
export async function main() {
	const hashedPassword = await bcrypt.hash(user.password, 10);

	const userCreated = await prisma.user.create({
		data: {
			...user,
			password: hashedPassword,
		},
	});
}

main();
