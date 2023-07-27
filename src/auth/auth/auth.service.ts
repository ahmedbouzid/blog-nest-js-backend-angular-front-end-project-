import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwt: JwtService) {}

    async generateJwt(user: User): Promise<string> {
        return await this.jwt.sign({ user });
    }
    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12));
    }

    comparePasswords(newPass: string, passHash: string): Observable<boolean> {
        return of<boolean>(bcrypt.compare(newPass, passHash));
    }
}
