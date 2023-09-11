import * as fs from 'fs';
import { USERS_DB_PATH } from '../config';
import { UserResource } from 'src/resources/user';

export class UserDbService {

    public getUsers(): Array<UserResource> {
        const raw = fs.readFileSync(USERS_DB_PATH, 'utf-8');
        const data = JSON.parse(raw) as Array<UserResource>;
        return data;
    }
    
}