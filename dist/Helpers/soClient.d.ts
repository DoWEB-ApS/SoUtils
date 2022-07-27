import { Authentication } from "./Authentication.js";
export declare class soClient {
    private Authentication;
    constructor(Authentication: Authentication);
    get(route: String, params?: {}, tries?: number): any;
    post(route: any, data: any, params?: {}, tries?: number): any;
    put(route: any, data: any, params?: {}, tries?: number): any;
    delete(route: any, params?: {}, tries?: number): any;
}
