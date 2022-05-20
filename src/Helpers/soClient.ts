'use strict';
import axios from 'axios'; 
import { Authentication } from './Authentication';
export class soClient {
  private Authentication : Authentication;
    constructor(Authentication : Authentication){
        this.Authentication = Authentication;
    }
    async get(route : String, params = {}){
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
    async post(route, data, params = {}){
      const getparams = new URLSearchParams(params).toString();
      
      //Set up axios to request refresh token
       
        try{
        const response = await axios({
          method: "POST", //you can set what request you want to be
          url: this.Authentication.app_webapi_url + 'v1/' + route + '?' + getparams,
          data: data,
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
  async put(route, data, params = {}){
    const getparams = new URLSearchParams(params).toString();
    
    //Set up axios to request refresh token
     
      try{
      const response = await axios({
        method: "PUT", //you can set what request you want to be
        url: this.Authentication.app_webapi_url + 'v1/' + route + '?' + getparams,
        data: data,
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
async delete(route, params = {}){
  const getparams = new URLSearchParams(params).toString();
  
  //Set up axios to request refresh token
   
    try{
    const response = await axios({
      method: "DELETE", //you can set what request you want to be
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

 