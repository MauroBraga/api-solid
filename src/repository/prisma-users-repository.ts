import { prisma } from "@/lib/prisma";
import {Prisma} from "@prisma/client";


export class PrismaUsersRepository {
    // Implementação dos métodos do repositório usando Prisma

    async createUser(data: Prisma.UserCreateInput) {
        
        const user = await prisma.user.create({
            data
        })  

        return user
    }
}