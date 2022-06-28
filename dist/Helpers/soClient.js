"use strict";
import axios from "axios";
import { bearerType } from "./Authentication.js";
export class soClient {
    Authentication;
    constructor(Authentication) {
        this.Authentication = Authentication;
    }
    async get(route, params = {}, tries = 0) {
        const getparams = new URLSearchParams(params).toString();
        //Set up axios to request refresh token
        try {
            const response = await axios({
                method: "GET",
                url: this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.Authentication.bearer,
                    "SO-Language": this.Authentication.app_language,
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.PERSONAL &&
                tries < 3) {
                await this.Authentication.getSoRefreshTicket(this.Authentication.app_refresh);
                await this.get(route, params, tries + 1);
            }
            else if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.SYSTEM &&
                tries < 3) {
                await this.Authentication.getSoSystemTicket();
                await this.get(route, params, tries + 1);
            }
            else {
                throw error;
            }
        }
    }
    async post(route, data, params = {}, tries = 0) {
        const getparams = new URLSearchParams(params).toString();
        //Set up axios to request refresh token
        try {
            const response = await axios({
                method: "POST",
                url: this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
                data: data,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.Authentication.bearer,
                    "SO-Language": this.Authentication.app_language,
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.PERSONAL &&
                tries < 3) {
                await this.Authentication.getSoRefreshTicket(this.Authentication.app_refresh);
                await this.post(route, data, params, tries + 1);
            }
            else if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.SYSTEM &&
                tries < 3) {
                await this.Authentication.getSoSystemTicket();
                await this.post(route, data, params, tries + 1);
            }
            else {
                throw error;
            }
        }
    }
    async put(route, data, params = {}, tries = 0) {
        const getparams = new URLSearchParams(params).toString();
        //Set up axios to request refresh token
        try {
            const response = await axios({
                method: "PUT",
                url: this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
                data: data,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.Authentication.bearer,
                    "SO-Language": this.Authentication.app_language,
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.PERSONAL &&
                tries < 3) {
                await this.Authentication.getSoRefreshTicket(this.Authentication.app_refresh);
                this.put(route, data, params, tries + 1);
            }
            else if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.SYSTEM &&
                tries < 3) {
                await this.Authentication.getSoSystemTicket();
                await this.put(route, data, params, tries + 1);
            }
            else {
                throw error;
            }
        }
    }
    async delete(route, params = {}, tries = 0) {
        const getparams = new URLSearchParams(params).toString();
        //Set up axios to request refresh token
        try {
            const response = await axios({
                method: "DELETE",
                url: this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.Authentication.bearer,
                    "SO-Language": this.Authentication.app_language,
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.PERSONAL &&
                tries < 3) {
                await this.Authentication.getSoRefreshTicket(this.Authentication.app_refresh);
                await this.delete(route, params, tries + 1);
            }
            else if (error.response.status === 401 &&
                this.Authentication.bearer_type === bearerType.SYSTEM &&
                tries < 3) {
                await this.Authentication.getSoSystemTicket();
                await this.delete(route, params, tries + 1);
            }
            else {
                throw error;
            }
        }
    }
}
//# sourceMappingURL=soClient.js.map