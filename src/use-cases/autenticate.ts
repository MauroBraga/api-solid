import { UserRepository } from "@/repository/user-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./error/invalid-cedencials-error";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export class AuthenticateUseCase {

    constructor(private userRepository: UserRepository) {
        // Initialize any dependencies here, such as a user repository or authentication service
    }

    async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatch = await compare(password, user.password_hash);

        if (!doesPasswordMatch) {
            throw new InvalidCredentialsError();
        }

        return {
            
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}