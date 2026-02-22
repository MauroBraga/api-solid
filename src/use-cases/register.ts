import { prisma } from "@/lib/prisma"
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

    if (userAlreadyExists) {
        throw new Error('User already exists')
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash
        }
    })
}