"use strict";
import * as path from "path";
import { URLSearchParams } from "url";
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/
const __dirname = process.cwd();
import * as dotenv from "dotenv";
dotenv.config();
import * as crypto from "crypto";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import axios from "axios";
export var bearerType;
(function (bearerType) {
    bearerType[bearerType["PERSONAL"] = 1] = "PERSONAL";
    bearerType[bearerType["SYSTEM"] = 2] = "SYSTEM";
})(bearerType || (bearerType = {}));
export class Authentication {
    app_client;
    app_name;
    app_contextId;
    app_environment;
    app_redirect;
    app_secret;
    app_systemtoken;
    app_webapi_url;
    app_is_admin;
    app_language;
    app_refresh;
    bearer;
    bearer_expiration;
    bearer_type;
    privKey;
    privKeyFile;
    publicKEY;
    publKeyFile;
    verifyOptions;
    updateBearerCallback;
    constructor() {
        this.app_secret = process.env.SUPEROFFICE_CLIENTSECRET;
        this.app_client = process.env.SUPEROFFICE_CLIENTID;
        this.app_redirect = process.env.SUPEROFFICE_REDIRECT;
        this.app_environment = process.env.SUPEROFFICE_ENV;
        this.app_language = process.env.SUPEROFFICE_LANG;
        this.bearer = "";
        this.bearer_expiration = new Date();
        this.privKeyFile = process.env.SUPEROFFICE_PRIVKEY_FILE;
        this.publKeyFile = path.join(__dirname, "..//certs/" + this.app_environment + "/", "federatedcert.pem");
        this.verifyOptions = {
            ignoreExpiration: true,
            algorithm: ["RS256"],
        };
        this.publicKEY = fs.readFileSync(this.publKeyFile, "utf8");
        this.privKey = fs.readFileSync(this.privKeyFile, "utf8");
    }
    async getSoRefreshTicket(refresh_token) {
        const options = new URLSearchParams();
        options.append("grant_type", "refresh_token");
        options.append("client_id", this.app_client);
        options.append("client_secret", this.app_secret);
        options.append("refresh_token", refresh_token);
        options.append("redirect_url", this.app_redirect);
        const params = new URLSearchParams(options).toString();
        //Set up axios to request refresh token
        try {
            const response = await axios({
                method: "POST",
                url: "https://" +
                    this.app_environment +
                    ".superoffice.com/login/common/oauth/tokens?" +
                    params,
                headers: {
                    "content-type": "application/json",
                },
            });
            console.log(response.data);
            const token = response.data.id_token;
            try {
                // Verify the public SuperOffice certificate is loaded
                // this is used to validate the JWT sent back from SuperOffice
                if (this.publicKEY) {
                    console.log("good to go!");
                }
                else {
                    console.log("NOT good to go!");
                    return false;
                }
                // validate the JWT and extract the claims
                var decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
                console.log(decoded);
                this.app_name =
                    decoded["http://schemes.superoffice.net/identity/company_name"];
                this.app_contextId =
                    decoded["http://schemes.superoffice.net/identity/ctx"];
                this.app_webapi_url =
                    decoded["http://schemes.superoffice.net/identity/webapi_url"];
                this.app_systemtoken =
                    decoded["http://schemes.superoffice.net/identity/system_token"];
                this.app_refresh = refresh_token;
                this.app_is_admin =
                    decoded["http://schemes.superoffice.net/identity/is_administrator"] === "True";
                this.bearer_expiration = new Date(parseInt(decoded["exp"]) * 1000);
                this.bearer = response.data.access_token;
                this.bearer_type = bearerType.PERSONAL;
                if (this.updateBearerCallback) {
                    this.updateBearerCallback(this.bearer, this.bearer_expiration);
                }
                return true;
            }
            catch (ex) {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    }
    async getSoSystemTicket() {
        if (this.app_systemtoken === "") {
            console.error("No systemtoken present!");
            return false;
        }
        // get UTC time
        const now = new Date();
        const utc_now = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        //Format the UTC time to YYYYMMDDHHmm
        //const utc_now_str = utc_now.toISOString().replace(/T/, ' ').replace(/\..+/, '').replaceAll('-', '').replaceAll(':', '').replace(' ', '').substring(0,12);
        const utcTimestamp = now.getUTCFullYear() +
            ("0" + (now.getUTCMonth() + 1)).slice(-2) +
            ("0" + now.getUTCDate()).slice(-2) +
            ("0" + now.getUTCHours()).slice(-2) +
            ("0" + now.getUTCMinutes()).slice(-2);
        const data = `${this.app_systemtoken}.${utcTimestamp}`;
        console.log("");
        console.log("Token.Time: " + data);
        let sign = crypto.createSign("SHA256");
        sign.update(data);
        sign.end();
        let signed = sign.sign(this.privKey, "base64");
        const signedToken = `${data}.${signed}`;
        const dataToSend = {
            SignedSystemToken: signedToken,
            ApplicationToken: this.app_secret,
            ContextIdentifier: this.app_contextId,
            ReturnTokenType: "JWT",
        };
        console.log("Forespørger om system ticket...");
        try {
            const resp = await axios({
                url: "https://" +
                    this.app_environment +
                    ".superoffice.com/Login/api/PartnerSystemUser/Authenticate",
                method: "post",
                data: dataToSend,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const json = resp.data;
            const successful = json.IsSuccessful;
            if (successful === true) {
                // extract the token
                var token = json.Token;
                console.log("");
                console.log("Token: " + JSON.stringify(token));
                try {
                    // Verify the public SuperOffice certificate is loaded
                    // this is used to validate the JWT sent back from SuperOffice
                    if (this.publicKEY) {
                        console.log("good to go!");
                    }
                    else {
                        console.log("NOT good to go!");
                        return false;
                    }
                    // validate the JWT and extract the claims
                    var decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
                    // write out the ticket to the console, DONE!
                    console.log("");
                    console.log("System User Ticket: " +
                        decoded["http://schemes.superoffice.net/identity/ticket"]);
                    this.app_name =
                        decoded["http://schemes.superoffice.net/identity/company_name"];
                    this.app_contextId =
                        decoded["http://schemes.superoffice.net/identity/ctx"];
                    this.app_webapi_url =
                        decoded["http://schemes.superoffice.net/identity/webapi_url"];
                    this.bearer_expiration = new Date(parseInt(decoded["exp"]) * 1000);
                    this.bearer =
                        decoded["http://schemes.superoffice.net/identity/ticket"];
                    this.bearer_type = bearerType.SYSTEM;
                    if (this.updateBearerCallback) {
                        this.updateBearerCallback(this.bearer, this.bearer_expiration);
                    }
                    return true;
                }
                catch (err) {
                    console.log("");
                    console.log("Error: " + err);
                    return false;
                }
            }
            else {
                console.log("Authentication failed and no token was received!");
                return false;
            }
        }
        catch (ex) {
            return { Status: "error", Exception: ex };
        }
    }
}
//# sourceMappingURL=Authentication.js.map