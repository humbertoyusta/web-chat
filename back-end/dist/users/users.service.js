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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let UsersService = class UsersService {
    constructor(usersRepository, configService) {
        this.usersRepository = usersRepository;
        this.configService = configService;
    }
    async hashPassword(userPlainPass) {
        const hash = await bcrypt.hash(userPlainPass.password, this.configService.get('bcryptSaltRounds'));
        const _a = Object.assign(Object.assign({}, userPlainPass), { passwordHash: hash }), { password } = _a, userHashPass = __rest(_a, ["password"]);
        return userHashPass;
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async findOne(reqId, options) {
        const relationsToLoad = [];
        if (options && options.loadContacts)
            relationsToLoad.push("contacts");
        return await this.usersRepository.findOne({
            where: { id: reqId },
            relations: relationsToLoad,
        });
    }
    async findOneByUsername(reqUsername) {
        return await this.usersRepository.findOne({
            where: { username: reqUsername },
        });
    }
    async createUser(user) {
        const contactList = [];
        const userToCreate = Object.assign(Object.assign({}, user), { contacts: contactList });
        return await this.usersRepository.save(await this.hashPassword(userToCreate));
    }
    async deleteUser(user) {
        const deleteResult = await this.usersRepository.createQueryBuilder()
            .delete()
            .whereInIds(user.id)
            .returning('id')
            .execute();
        switch (deleteResult.affected) {
            case 0:
                return undefined;
            case 1:
                if (deleteResult.raw[0].id === user.id)
                    return user;
                else
                    throw new common_1.InternalServerErrorException();
            default:
                throw new common_1.InternalServerErrorException();
        }
    }
    async updateUser(id, updUser) {
        if (updUser.hasOwnProperty('password'))
            updUser = await this.hashPassword(updUser);
        const updatedUser = await this.usersRepository.preload(Object.assign({ id: +id }, updUser));
        if (updatedUser)
            return await this.usersRepository.save(updatedUser);
        else
            return undefined;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map