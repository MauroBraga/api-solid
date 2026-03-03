import { UserRepository } from "@/repository/user-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./error/resource-not-found";

interface GetUserProfileUseCaseRequest {
    userId: string;
}

interface GetUserProfileUseCaseResponse {
    
    user: User;
}

export class GetUserProfileUseCase {

    constructor(private userRepository: UserRepository) {
        // Initialize any dependencies here, such as a user repository or authentication service
    }

    async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }


        return {
            
            user,
        };
    }
}