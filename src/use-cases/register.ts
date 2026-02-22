import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repository/prisma-users-repository"
import { hash } from "bcryptjs"

interface RegisterUserCaseRequest {
    name: string,
    email: string,
    password: string
}

export async function registerUserCase({ name, email, password }: RegisterUserCaseRequest) {
     const password_hash = await hash(password, 6)

    const userAlreadyExists = await prisma.user.findUnique({
        where: {
            email
        }
    })

    console.log(userAlreadyExists)

    if (userAlreadyExists) {
        throw new Error('User already exists')
    }

    const prismaUsersRepository = new PrismaUsersRepository()
    const user =  await prismaUsersRepository.createUser({
        name,
        email,
        password_hash
    })

}