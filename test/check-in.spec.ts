import { beforeEach,afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "./repository/in-memory/in-memory-checkin-repository";
import { CheckinteUseCase } from "@/use-cases/check-in";


let checkinRepository: InMemoryCheckInsRepository;
let sut: CheckinteUseCase;

describe("Check-in Use Case", () => {
    beforeEach(() => {
        checkinRepository = new InMemoryCheckInsRepository();
        sut = new CheckinteUseCase(checkinRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        });

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        });

        expect(() => sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        })).rejects.toBeInstanceOf(Error);
    })

    it("should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        });

        expect(checkIn.id).toEqual(expect.any(String)); 
    })

});

