import { UserRepository } from "@/repository/user-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./error/invalid-cedencials-error";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    
    user: User;
}

export class AuthenticateUseCase {

    constructor(private userRepository: UserRepository) {
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
            
            user,
        };
    }
}