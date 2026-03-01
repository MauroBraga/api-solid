import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "./repository/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "@/use-cases/autenticate";
import { RegisterUserCase } from "@/use-cases/register";
import { hash } from "bcryptjs";

let userRepository:InMemoryUsersRepository
let sut:AuthenticateUseCase

describe('Authenticate Use Case', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(userRepository)
    })

    it('should be able to authenticate', async () => {
        

        await userRepository.createUser({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('123456',6)
        })

        sut.execute({
            email: 'john.doe@example.com',
            password: '123456'
        })

    })

    it('should not be able to authenticate with wrong email', async () => {
        const userRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(userRepository)

        await expect(() => sut.execute({
            email: 'wrong-email@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(Error)
    })
})