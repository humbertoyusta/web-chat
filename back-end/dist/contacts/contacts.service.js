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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let ContactsService = class ContactsService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async addContact(userId, newContactId) {
        const user = await this.usersService.findOne(userId, { loadContacts: true });
        const newContact = await this.usersService.findOne(newContactId, { loadContacts: true });
        if (!user)
            throw new common_1.BadRequestException(`User with id ${userId} does not exist`);
        if (!newContact)
            throw new common_1.BadRequestException(`User with id ${newContactId} does not exist`);
        user.contacts.push(newContact);
        await this.usersService.updateUser(user.id, user);
        return true;
    }
    async getContacts(userId) {
        const user = await this.usersService.findOne(userId, { loadContacts: true });
        if (!user)
            throw new common_1.BadRequestException(`User with id ${userId} does not exist`);
        return user.contacts.map((user) => {
            const { passwordHash } = user, userNoPwd = __rest(user, ["passwordHash"]);
            return userNoPwd;
        });
    }
};
ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ContactsService);
exports.ContactsService = ContactsService;
//# sourceMappingURL=contacts.service.js.map