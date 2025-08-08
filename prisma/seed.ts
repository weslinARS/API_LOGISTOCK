import { $Enums, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

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

	await prisma.user.create({
		data: {
			...user,
			password: hashedPassword,
		},
	});
}

main();
