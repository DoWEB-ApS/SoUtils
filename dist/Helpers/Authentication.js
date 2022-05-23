'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as path from 'path';
import { fileURLToPath, URLSearchParams } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
import * as dotenv from 'dotenv';
dotenv.config();
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as fs from 'fs';
import jwt from "jsonwebtoken";
import axios from 'axios';
var bearerType;
(function (bearerType) {
    bearerType[bearerType["personal"] = 0] = "personal";
    bearerType[bearerType["system"] = 1] = "system";
})(bearerType || (bearerType = {}));
var Authentication = /** @class */ (function () {
    function Authentication() {
        this.app_secret = process.env.SUPEROFFICE_CLIENTSECRET;
        this.app_client = process.env.SUPEROFFICE_CLIENTID;
        this.app_redirect = process.env.SUPEROFFICE_REDIRECT;
        this.app_environment = process.env.SUPEROFFICE_ENV;
        this.bearer = '';
        this.bearer_expiration = 0;
        this.privKeyFile = process.env.SUPEROFFICE_PRIVKEY_FILE;
        this.publKeyFile = path.join(__dirname, '..//certs/' + this.app_environment + '/', 'federatedcert.pem');
        this.verifyOptions = {
            ignoreExpiration: true,
            algorithm: ["RS256"]
        };
        this.publicKEY = fs.readFileSync(this.publKeyFile, 'utf8');
        this.privKey = fs.readFileSync(this.privKeyFile, 'utf8');
    }
    Authentication.prototype.getSoRefreshTicket = function (refresh_token) {
        return __awaiter(this, void 0, void 0, function () {
            var options, params, response, token, decoded, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = new URLSearchParams();
                        options.append('grant_type', 'refresh_token');
                        options.append('client_id', this.app_client);
                        options.append('client_secret', this.app_secret);
                        options.append('refresh_token', refresh_token);
                        options.append('redirect_url', this.app_redirect);
                        params = new URLSearchParams(options).toString();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios({
                                method: "POST",
                                url: "https://" + this.app_environment + ".superoffice.com/login/common/oauth/tokens?" + params,
                                headers: {
                                    "content-type": "application/json",
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        console.log(response.data);
                        token = response.data.id_token;
                        try {
                            // Verify the public SuperOffice certificate is loaded
                            // this is used to validate the JWT sent back from SuperOffice
                            if (this.publicKEY) {
                                console.log("good to go!");
                            }
                            else {
                                console.log("NOT good to go!");
                                return [2 /*return*/, false];
                            }
                            decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
                            console.log(decoded);
                            this.app_contextId = decoded['http://schemes.superoffice.net/identity/ctx'];
                            this.app_webapi_url = decoded['http://schemes.superoffice.net/identity/webapi_url'];
                            this.app_systemtoken = decoded['http://schemes.superoffice.net/identity/system_token'];
                            this.bearer_expiration = decoded['exp'];
                            this.bearer = response.data.access_token;
                            this.bearer_type = bearerType.personal;
                            return [2 /*return*/, true];
                        }
                        catch (ex) {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Authentication.prototype.getSoSystemTicket = function () {
        return __awaiter(this, void 0, void 0, function () {
            var utcTimestamp, data, sign, signed, signedToken, dataToSend, resp, json, successful, token, decoded, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.app_systemtoken === '') {
                            console.error('No systemtoken present!');
                            return [2 /*return*/, false];
                        }
                        utcTimestamp = moment.utc().format('YYYYMMDDHHmm');
                        data = "".concat(this.app_systemtoken, ".").concat(utcTimestamp);
                        console.log('');
                        console.log('Token.Time: ' + data);
                        sign = crypto.createSign('SHA256');
                        sign.update(data);
                        sign.end();
                        signed = sign.sign(this.privKey, 'base64');
                        signedToken = "".concat(data, ".").concat(signed);
                        dataToSend = {
                            "SignedSystemToken": signedToken,
                            "ApplicationToken": this.app_secret,
                            "ContextIdentifier": this.app_contextId,
                            "ReturnTokenType": "JWT"
                        };
                        console.log('Forespørger om system ticket...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios({
                                url: 'https://' + this.app_environment + '.superoffice.com/Login/api/PartnerSystemUser/Authenticate',
                                method: 'post',
                                data: dataToSend,
                                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                            })];
                    case 2:
                        resp = _a.sent();
                        json = resp.data;
                        successful = json.IsSuccessful;
                        if (successful === true) {
                            token = json.Token;
                            console.log('');
                            console.log('Token: ' + JSON.stringify(token));
                            try {
                                // Verify the public SuperOffice certificate is loaded
                                // this is used to validate the JWT sent back from SuperOffice
                                if (this.publicKEY) {
                                    console.log("good to go!");
                                }
                                else {
                                    console.log("NOT good to go!");
                                    return [2 /*return*/, false];
                                }
                                decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
                                // write out the ticket to the console, DONE!
                                console.log('');
                                console.log('System User Ticket: ' + decoded["http://schemes.superoffice.net/identity/ticket"]);
                                this.app_contextId = decoded['http://schemes.superoffice.net/identity/ctx'];
                                this.app_webapi_url = decoded['http://schemes.superoffice.net/identity/webapi_url'];
                                this.app_systemtoken = decoded['http://schemes.superoffice.net/identity/system_token'];
                                this.bearer_expiration = decoded['exp'];
                                this.bearer = decoded["http://schemes.superoffice.net/identity/ticket"];
                                this.bearer_type = bearerType.system;
                                return [2 /*return*/, true];
                            }
                            catch (err) {
                                console.log('');
                                console.log('Error: ' + err);
                                return [2 /*return*/, false];
                            }
                        }
                        else {
                            console.log('Authentication failed and no token was received!');
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        return [2 /*return*/, { "Status": "error", "Exception": ex_1 }];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Authentication;
}());
export { Authentication };
