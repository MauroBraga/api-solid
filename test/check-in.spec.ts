import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "./repository/in-memory/in-memory-checkin-repository";
import { CheckinteUseCase } from "@/use-cases/check-in";
import { InMemoryGymsRepository } from "./repository/in-memory/in-memory-gyms-repository";
import { Prisma } from "@prisma/client";

import { Decimal } from "@prisma/client/runtime";


let checkinRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinteUseCase;

describe("Check-in Use Case", () => {
    beforeEach(() => {
        checkinRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckinteUseCase(checkinRepository, gymsRepository);
        vi.useFakeTimers();

        gymsRepository.items.push({
            id: "gym-01",
            title: "Gym-01",
            description: "Gym-01",
            latitude: new Prisma.Decimal(0),
            longitude: new Prisma.Decimal(0),
            phone: "123456789"
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {


        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        expect(() => sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(Error);
    })

    it("should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));
    })

    //-22.9382471,-43.3473359,18
    it("should not be able to check in if the user is not close to the gym", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        gymsRepository.items.push({
            id: "gym-02",
            title: "Gym-02",
            description: "Gym-02",
            latitude: new Prisma.Decimal(-22.9382471),
            longitude: new Prisma.Decimal(-43.3473359),
            phone: "123456789"
        });

        await expect(() => sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: -22.1382471,
            userLongitude: -43.1473359,
        })).rejects.toBeInstanceOf(Error);
    })
});

