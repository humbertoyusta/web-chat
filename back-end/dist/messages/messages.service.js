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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const MESSAGES_LIMIT = 20;
let MessagesService = class MessagesService {
    constructor(messagesRepository) {
        this.messagesRepository = messagesRepository;
    }
    async send(senderId, receiverId, text) {
        const sender = { id: senderId };
        const receiver = { id: receiverId };
        return await this.messagesRepository.save({ text, sender, receiver });
    }
    async findAll(id, paginationQueryDto, options) {
        if (options && options.onlySent && options.onlyReceived)
            return [];
        let whereOptions, relationOptions;
        if (options && options.onlySent) {
            whereOptions = { sender: { id } };
            relationOptions = ["receiver"];
        }
        else if (options && options.onlyReceived) {
            whereOptions = { receiver: { id } };
            relationOptions = ["sender"];
        }
        else {
            whereOptions = [{ sender: { id } }, { receiver: { id } }];
            relationOptions = ["sender", "receiver"];
        }
        const messagesList = await this.messagesRepository.find({
            where: whereOptions,
            order: { sentAt: -1 },
            relations: relationOptions,
            take: paginationQueryDto.limit || MESSAGES_LIMIT,
            skip: paginationQueryDto.offset || 0,
        });
        for (const message of messagesList) {
            if (message.receiver) {
                const _a = message.receiver, { passwordHash } = _a, receiverNoPass = __rest(_a, ["passwordHash"]);
                message.receiver = receiverNoPass;
            }
            if (message.sender) {
                const _b = message.sender, { passwordHash } = _b, senderNoPass = __rest(_b, ["passwordHash"]);
                message.sender = senderNoPass;
            }
        }
        return messagesList;
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map