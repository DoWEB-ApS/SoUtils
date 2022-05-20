'use strict';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

 
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import moment from 'moment';
import fs from 'fs'; 
import jwt from "jsonwebtoken"; 
import axios from 'axios'; 
 
export class Authentication {
 
constructor(contextId = '', netserver_url = '', systemToken) {
  
  this.app_secret = process.env.SUPEROFFICE_CLIENTSECRET;
  this.app_client = process.env.SUPEROFFICE_CLIENTID;
  this.app_redirect = process.env.SUPEROFFICE_REDIRECT;
  this.app_environment= process.env.SUPEROFFICE_ENV;
  this.app_contextId = contextId;
  this.app_webapi_url = netserver_url;
  this.bearer = '';
  this.bearer_expiration = 
  this.app_systemtoken = systemToken; 
  this.privKeyFile = process.env.SUPEROFFICE_PRIVKEY_FILE;
  this.publKeyFile = path.join(__dirname, '..//certs/' + this.app_environment + '/', 'federatedcert.pem');
  this.verifyOptions = {
    ignoreExpiration: true,
    algorithm: ["RS256"]
  };
  this.publicKEY = fs.readFileSync(this.publKeyFile, 'utf8');
  this.privKey = fs.readFileSync(this.privKeyFile, 'utf8');
 
}

async getSoRefreshTicket(refresh_token) {
  
const params = new URLSearchParams({
    'grant_type': 'refresh_token',
    'client_id': this.app_client,
    'client_secret': this.app_secret,
    'refresh_token': refresh_token,
    'redirect_url': this.app_redirect
}).toString();

//Set up axios to request refresh token
 
  try{
  const response = await axios({
    method: "POST", //you can set what request you want to be
    url: "https://" + this.app_environment + ".superoffice.com/login/common/oauth/tokens?" + params,
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
    } else {
        console.log("NOT good to go!");
       return false;
    }
    // validate the JWT and extract the claims
    var decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
    console.log(decoded);
    this.app_contextId = decoded['http://schemes.superoffice.net/identity/ctx'];
    this.app_webapi_url =  decoded['http://schemes.superoffice.net/identity/webapi_url'];
    this.app_systemtoken = decoded['http://schemes.superoffice.net/identity/system_token'];
    this.bearer_expiration = decoded['exp'];
    this.bearer = response.data.access_token;
    this.bearer_type = 'personal';
    return true;
}
catch(ex){
    return false;
}
  
  }
  catch(error){
    return false;
  }

}

async getSoSystemTicket () { 
 
        const utcTimestamp = moment.utc().format('YYYYMMDDHHmm');
        const data = `${this.app_systemtoken}.${utcTimestamp}`;
        console.log('');
        console.log('Token.Time: ' + data);
        let sign = crypto.createSign('SHA256');
        sign.update(data);
        sign.end();
        sign = sign.sign(this.privKey, 'base64');
        const signedToken = `${data}.${sign}`;
        const dataToSend = {
          "SignedSystemToken": signedToken,
          "ApplicationToken": this.app_secret,
          "ContextIdentifier": this.app_contextId,
          "ReturnTokenType": "JWT"
          };
          console.log('Forespørger om system ticket...');
          try{
          const resp = await axios({
              url: 'https://' + this.app_environment + '.superoffice.com/Login/api/PartnerSystemUser/Authenticate',
              method: 'post',
              data: dataToSend,
              headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
          }); 
           
            const json = resp.data;
            const successful = json.IsSuccessful;
          if (successful === true) {
            // extract the token
            var token = json.Token;
            console.log('');
            console.log('Token: ' + JSON.stringify(token));
            
            try {
            
              // Verify the public SuperOffice certificate is loaded
              // this is used to validate the JWT sent back from SuperOffice
              if (this.publicKEY) {
                  console.log("good to go!");
              } else {
                  console.log("NOT good to go!");
                  reject();
              }
              // validate the JWT and extract the claims
              var decoded = jwt.verify(token, this.publicKEY, this.verifyOptions);
              // write out the ticket to the console, DONE!
              console.log('');
              console.log('System User Ticket: ' + decoded["http://schemes.superoffice.net/identity/ticket"]);
              this.app_contextId = decoded['http://schemes.superoffice.net/identity/ctx'];
              this.app_webapi_url =  decoded['http://schemes.superoffice.net/identity/webapi_url'];
              this.app_systemtoken = decoded['http://schemes.superoffice.net/identity/system_token'];
              this.bearer_expiration = decoded['exp'];
              this.bearer = decoded["http://schemes.superoffice.net/identity/ticket"];
              this.bearer_type = 'system';
              return true;
            } catch (err) {
              console.log('');
              console.log('Error: ' + err);
              return false;
            }
          } else {
              console.log('Authentication failed and no token was received!');
              return false;
          }
        }
        catch(ex) {
              return {"Status": "error", "Exception": ex};
          };
    
  
    }

  }
 