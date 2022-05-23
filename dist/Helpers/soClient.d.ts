import { Authentication } from './Authentication';
export declare class soClient {
    private Authentication;
    constructor(Authentication: Authentication);
    get(route: String, params?: {}): Promise<any>;
    post(route: any, data: any, params?: {}): Promise<any>;
    put(route: any, data: any, params?: {}): Promise<any>;
    delete(route: any, params?: {}): Promise<any>;
}
