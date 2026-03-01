
import { PrismaUsersRepository } from '@/repository/prisma/prisma-users-repository'
import { RegisterUserCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from './repository/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/error/user-already-exists-error'


let userRepository:InMemoryUsersRepository
let sut:RegisterUserCase
describe('Register Use Case', () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUserCase(userRepository)
  })

  it('should to register', async () => {
    
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    


    const { user } = await sut.execute({
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
    

    await sut.execute({
      name: 'John Doe',
      email: 'johndoe3@example.com',
      password: '123456',
    })  

    await expect(() => sut.execute({
      name: 'John Doe',
      email: 'johndoe3@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)

  });
})