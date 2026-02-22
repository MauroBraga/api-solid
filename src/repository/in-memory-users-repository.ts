import { Prisma } from "@prisma/client"


export class InMemoryUsersRepository {
    private users: any[] = []

    async createUser(data: Prisma.UserCreateInput) {
        this.users.push(data)
    }
}