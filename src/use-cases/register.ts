import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repository/prisma/prisma-users-repository"
import { UserRepository } from "@/repository/user-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./error/user-already-exists-error"
import { User } from "@prisma/client"

interface RegisterUserCaseRequest {
    name: string,
    email: string,
    password: string
}

interface RegisterUserCaseResponse {
    user: User
}

export class RegisterUserCase {

    constructor(private userRepository: UserRepository) {
    }

    async execute({ name, email, password }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
        const password_hash = await hash(password, 6)

        const userAlreadyExists = await this.userRepository.findByEmail(email)


        if (userAlreadyExists) {
            throw new UserAlreadyExistsError()
        }

        const user =  await this.userRepository.createUser({
            name,
            email,
            password_hash
        })

        return {user}
    }

}