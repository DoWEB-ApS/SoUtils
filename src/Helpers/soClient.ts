"use strict";
import axios from "axios";
import { Authentication, bearerType } from "./Authentication.js";
export class soClient {
  private Authentication: Authentication;
  constructor(Authentication: Authentication) {
    this.Authentication = Authentication;
  }
  async get(route: String, params = {}, tries = 0) {
    const getparams = new URLSearchParams(params).toString();

    //Set up axios to request refresh token

    try {
      if(this.Authentication.bearer_expiration < new Date()){
        throw {response: {status: 401, msg: 'Bearer token expired'}};
      }
      const response = await axios({
        method: "GET", //you can set what request you want to be
        url:
          this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
        headers:
          this.Authentication.bearer_type === bearerType.SYSTEM
            ? {
                Authorization: "SOTicket " + this.Authentication.bearer,
                "SO-AppToken": this.Authentication.app_secret, //authentication token
                "SO-Language": this.Authentication.app_language,
              }
            : {
                "content-type": "application/json",
                Authorization: "Bearer " + this.Authentication.bearer,
                "SO-Language": this.Authentication.app_language,
              },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.PERSONAL &&
        tries < 3
      ) {
        await this.Authentication.getSoRefreshTicket(
          this.Authentication.app_refresh
        );
        const tryAgain = await this.get(route, params, tries + 1);
        return tryAgain;
      } else if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.SYSTEM &&
        tries < 3
      ) {
        await this.Authentication.getSoSystemTicket();
        const tryAgain = await this.get(route, params, tries + 1);
        return tryAgain;
      } else {
        throw error;
      }
    }
  }
  async post(route, data, params = {}, tries = 0) {
    
    const getparams = new URLSearchParams(params).toString();
    //Set up axios to request refresh token
    try {
      if(this.Authentication.bearer_expiration < new Date()){
        throw {response: {status: 401, msg: 'Bearer token expired'}};
      }
      const response = await axios({
        method: "POST", //you can set what request you want to be
        url:
          this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
        data: data,
        headers:
          this.Authentication.bearer_type === bearerType.SYSTEM
            ? {
                Authorization: "SOTicket " + this.Authentication.bearer,
                "SO-AppToken": this.Authentication.app_secret, //authentication token
                "SO-Language": this.Authentication.app_language,
              }
            : {
                "content-type": "application/json",
                Authorization: "Bearer " + this.Authentication.bearer,
                "SO-Language": this.Authentication.app_language,
              },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.PERSONAL &&
        tries < 3
      ) {
        await this.Authentication.getSoRefreshTicket(
          this.Authentication.app_refresh
        );
        const tryAgain = await this.post(route, data, params, tries + 1);
        return tryAgain;
      } else if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.SYSTEM &&
        tries < 3
      ) {
        await this.Authentication.getSoSystemTicket();
        const tryAgain = await this.post(route, data, params, tries + 1);
        return tryAgain;
      } else {
        throw error;
      }
    }
  }
  async put(route, data, params = {}, tries = 0) {
    const getparams = new URLSearchParams(params).toString();

    //Set up axios to request refresh token

    try {
      if(this.Authentication.bearer_expiration < new Date()){
        throw {response: {status: 401, msg: 'Bearer token expired'}};
      }
      const response = await axios({
        method: "PUT", //you can set what request you want to be
        url:
          this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
        data: data,
        headers:
          this.Authentication.bearer_type === bearerType.SYSTEM
            ? {
                Authorization: "SOTicket " + this.Authentication.bearer,
                "SO-AppToken": this.Authentication.app_secret, //authentication token
                "SO-Language": this.Authentication.app_language,
              }
            : {
                "content-type": "application/json",
                Authorization: "Bearer " + this.Authentication.bearer,
                "SO-Language": this.Authentication.app_language,
              },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.PERSONAL &&
        tries < 3
      ) {
        await this.Authentication.getSoRefreshTicket(
          this.Authentication.app_refresh
        );
        const tryAgain = await this.put(route, data, params, tries + 1);
        return tryAgain;
      } else if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.SYSTEM &&
        tries < 3
      ) {
        await this.Authentication.getSoSystemTicket();
        const tryAgain = await this.put(route, data, params, tries + 1);
        return tryAgain;
      } else {
        throw error;
      }
    }
  }

  async delete(route, params = {}, tries = 0) {
    const getparams = new URLSearchParams(params).toString();

    //Set up axios to request refresh token

    try {
      if(this.Authentication.bearer_expiration < new Date()){
        throw {response: {status: 401, msg: 'Bearer token expired'}};
      }
      const response = await axios({
        method: "DELETE", //you can set what request you want to be
        url:
          this.Authentication.app_webapi_url + "v1/" + route + "?" + getparams,
        headers:
          this.Authentication.bearer_type === bearerType.SYSTEM
            ? {
                Authorization: "SOTicket " + this.Authentication.bearer,
                "SO-AppToken": this.Authentication.app_secret, //authentication token
                "SO-Language": this.Authentication.app_language,
              }
            : {
                "content-type": "application/json",
                Authorization: "Bearer " + this.Authentication.bearer,
                "SO-Language": this.Authentication.app_language,
              },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.PERSONAL &&
        tries < 3
      ) {
        await this.Authentication.getSoRefreshTicket(
          this.Authentication.app_refresh
        );
        const tryAgain = await this.delete(route, params, tries + 1);
        return tryAgain;
      } else if (
        error.response.status === 401 &&
        this.Authentication.bearer_type === bearerType.SYSTEM &&
        tries < 3
      ) {
        await this.Authentication.getSoSystemTicket();
        const tryAgain = await this.delete(route, params, tries + 1);
        return tryAgain;
      } else {
        throw error;
      }
    }
  }
}
