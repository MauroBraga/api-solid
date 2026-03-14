import { CheckIn, User } from "@prisma/client";
import { CheckInRepository } from "@/repository/checkin-repository";
import { GymsRepository } from "@/repository/gyms-repository";
import { ResourceNotFoundError } from "./error/resource-not-found";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckinteUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckinteUseCaseResponse {

    checkIn: CheckIn;
}

export class CheckinteUseCase {

    constructor(private checkInRepository: CheckInRepository,
        private gymsRepository: GymsRepository) {
    }

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckinteUseCaseRequest): Promise<CheckinteUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        //calculte a distance between the user and the gym
        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        );

        const MAX_DISTANCE_IN_METERS = 0.1;

        if (distance > MAX_DISTANCE_IN_METERS) {
            throw new Error("User is not close to the gym.");
        }

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