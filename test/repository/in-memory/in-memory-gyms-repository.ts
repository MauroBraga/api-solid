import { GymsRepository } from "@/repository/gyms-repository"
import { Gym } from "@prisma/client"


export class InMemoryGymsRepository implements GymsRepository {

    public items: Gym[] = []

    async findById(id: string): Promise<Gym | null> {
        const gym = this.items.find((gym) => gym.id === id)

        if (!gym) {
            return null
        }

        return gym
    }
}