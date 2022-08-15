declare const _default: (() => {
    database: string;
    username: string;
    password: string;
    port: number;
    host: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    database: string;
    username: string;
    password: string;
    port: number;
    host: string;
}>;
export default _default;
