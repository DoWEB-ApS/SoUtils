/// <reference types="node" />
import * as crypto from 'crypto';
import * as fs from 'fs';
export declare enum bearerType {
    PERSONAL = 1,
    SYSTEM = 2
}
export declare class Authentication {
    app_client: string;
    app_name: string;
    app_contextId: string;
    app_environment: string;
    app_redirect: string;
    app_secret: string;
    app_systemtoken: string;
    app_webapi_url: string;
    app_is_admin: boolean;
    app_language: string;
    app_refresh: string;
    bearer: string;
    bearer_expiration: Date;
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
