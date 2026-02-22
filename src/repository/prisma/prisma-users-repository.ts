import { prisma } from "@/lib/prisma";
import {Prisma, User} from "@prisma/client";
import { UserRepository } from "../user-repository";


export class PrismaUsersRepository  implements UserRepository {
    findByEmail(email: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                email
            }
        })

        return user
    }
    // Implementação dos métodos do repositório usando Prisma

    async createUser(data: Prisma.UserCreateInput) {
        
        const user = await prisma.user.create({
            data
        })  

        return user
    }
}