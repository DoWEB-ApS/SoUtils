/// <reference types="node" />
import * as crypto from 'crypto';
import * as fs from 'fs';
declare enum bearerType {
    personal = 0,
    system = 1
}
export declare class Authentication {
    app_client: string;
    app_contextId: string;
    app_environment: string;
    app_redirect: string;
    app_secret: string;
    app_systemtoken: string;
    app_webapi_url: string;
    bearer: string;
    bearer_expiration: Number;
    bearer_type: bearerType;
    privKey: crypto.KeyLike;
    privKeyFile: fs.PathOrFileDescriptor;
    publicKEY: crypto.KeyLike;
    publKeyFile: fs.PathOrFileDescriptor;
    verifyOptions: Object;
    constructor();
    getSoRefreshTicket(refresh_token: string): Promise<boolean>;
    getSoSystemTicket(): Promise<boolean | {
        Status: string;
        Exception: any;
    }>;
}
export {};
