import { UserNoPassDto } from './dto/user.no-pass.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<UserNoPassDto[]>;
}
