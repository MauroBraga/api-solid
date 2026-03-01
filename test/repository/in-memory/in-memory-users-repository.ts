import { UserRepository } from "@/repository/user-repository";
import { Prisma, User } from "@prisma/client";


export class InMemoryUsersRepository implements UserRepository {

     private users: User[] = [];

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: 'user-1',
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
        }

        this.users.push(user)

        return user
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email)

        return user || null
    }
   
}