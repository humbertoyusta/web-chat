import { SignUpUserDto } from "./sign-up-user.dto";
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(SignUpUserDto) {};