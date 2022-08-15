"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signUp(user) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (!userInDb) {
            const _a = await this.usersService.createUser(user), { passwordHash } = _a, responseUser = __rest(_a, ["passwordHash"]);
            return responseUser;
        }
        else {
            throw new common_1.ConflictException('There is a registered user with that username');
        }
    }
    async validateUser(user) {
        let userInDb = await this.usersService.findOneByUsername(user.username);
        if (userInDb && await bcrypt.compare(user.password, userInDb.passwordHash)) {
            return userInDb;
        }
        else {
            throw new common_1.UnauthorizedException('Incorrect username or password');
        }
    }
    async validateUserbyIdandPwd(id, password) {
        let userInDb = await this.usersService.findOne(id);
        if (userInDb && await bcrypt.compare(password, userInDb.passwordHash)) {
            return userInDb;
        }
        else {
            throw new common_1.UnauthorizedException('Incorrect username or password');
        }
    }
    async signIn(user) {
        const validatedUser = await this.validateUser(user);
        return {
            access_token: this.jwtService.sign({
                id: validatedUser.id,
                username: validatedUser.username,
                passwordHash: validatedUser.passwordHash,
            })
        };
    }
    async deleteUser(id, password) {
        const validatedUser = await this.validateUserbyIdandPwd(id, password);
        const _a = await this.usersService.deleteUser(validatedUser), { passwordHash } = _a, responseUser = __rest(_a, ["passwordHash"]);
        return responseUser;
    }
    async updateUser(id, updUser) {
        if (updUser.hasOwnProperty('username')) {
            const userWithSameName = await this.usersService.findOneByUsername(updUser.username);
            if (userWithSameName && userWithSameName.id != id)
                throw new common_1.ConflictException('There is a registered user with that username');
        }
        const _a = await this.usersService.updateUser(id, updUser), { passwordHash } = _a, responseUser = __rest(_a, ["passwordHash"]);
        return responseUser;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map