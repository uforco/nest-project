import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class argonPasswordService {
    async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async vefifyPassword(password: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
