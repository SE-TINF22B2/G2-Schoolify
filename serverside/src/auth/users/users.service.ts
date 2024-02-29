import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    validateInput(): boolean {
        return true;
    }
    hasRole(): boolean {
        return true;
    }
    createUser():  HttpStatus {
        return HttpStatus.CREATED;
    }

}
