'use strict';
import axios from 'axios'; 
export class soClient {
    constructor(Authentication){
        this.Authentication = Authentication;
    }
    async get(route, params = {}){
        const getparams = new URLSearchParams(params).toString();
        
        //Set up axios to request refresh token
         
          try{
          const response = await axios({
            method: "GET", //you can set what request you want to be
            url: this.Authentication.app_webapi_url + 'v1/' + route + '?' + getparams,
            headers: {
              "content-type": "application/json",
              "Authorization": "Bearer " + this.Authentication.bearer
            },
          }); 
          console.log(response.data);
          return response.data;
          
          }
          catch(error){
            return false;
          }
    }

}

 