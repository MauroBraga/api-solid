import { CheckIn, User } from "@prisma/client";
import { CheckInRepository } from "@/repository/checkin-repository";

interface CheckinteUseCaseRequest {
    userId: string;
    gymId: string;
}

interface CheckinteUseCaseResponse {
    
    checkIn: CheckIn;
}

export class CheckinteUseCase {

    constructor(private checkInRepository: CheckInRepository) {
    }

    async execute({ userId, gymId }: CheckinteUseCaseRequest): Promise<CheckinteUseCaseResponse> {
        const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDate) {
            throw new Error("User already checked in today.");
        }
        const checkIn = await this.checkInRepository.create({
            userId,
            gymId
        });

        return {
            checkIn
        };
    }
}       