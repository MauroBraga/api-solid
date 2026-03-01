
import { PrismaUsersRepository } from '@/repository/prisma/prisma-users-repository'
import { RegisterUserCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { expect, it, describe } from 'vitest'
import { InMemoryUsersRepository } from './repository/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/error/user-already-exists-error'

describe('Register Use Case', () => {

  it('should to register', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUserCase(repository)

    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUserCase(repository)


    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'johndoe3@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHasshed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHasshed).toBe(true)

    expect(user.email).toEqual('johndoe3@example.com')
    expect(user.password_hash).not.toEqual('123456')
  })
  it('should not be able to register with same email twice', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUserCase(repository)

    await registerUserCase.execute({
      name: 'John Doe',
      email: 'johndoe3@example.com',
      password: '123456',
    })  

    await expect(() => registerUserCase.execute({
      name: 'John Doe',
      email: 'johndoe3@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)

  });
})