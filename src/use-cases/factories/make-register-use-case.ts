import { PrismaUsersRepository } from "@/repository/prisma/prisma-users-repository";
import { RegisterUserCase } from "../register";

export function makeRegisterUseCase():  RegisterUserCase {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUserCase(usersRepository);

    return registerUseCase;
  
}