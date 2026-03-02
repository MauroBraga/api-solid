import { PrismaUsersRepository } from "@/repository/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../autenticate";

export function makeAuthenticateUseCase() {
     const usersRepository = new PrismaUsersRepository();
     const authenticateUseCase = new AuthenticateUseCase(usersRepository);

     return authenticateUseCase;
  
}