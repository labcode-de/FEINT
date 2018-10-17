import { Injectable } from '@angular/core';
import {User} from "./user";
import axios from 'axios'
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User;
  public isAuthenticated: boolean;
  private loaded: boolean = false;
  constructor() { }

  private static getCookie(name) {
    const regex = new RegExp(name + "=([^;]+)");
    const value = regex.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  public getUser() {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        axios.get(environment.apiServer + "/user/getProfile", {headers: {'x-access-token': UserService.getCookie("lbcd_session")}}).then((httpResponse) => {
          this.isAuthenticated = true;
          this.user = new User(httpResponse);
          resolve(this.user);
        }).catch((httpError) => {
          this.isAuthenticated = false;
          reject(httpError)
        })
      } else {
        if (this.isAuthenticated) {
          resolve(this.user);
        } else {
          reject('error')
        }
      }
    })
  }

  public changeUserProfile(firstName: String, familyName: String) {
    axios.post(environment.apiServer + "/control/changeProfile", {
      firstName: firstName,
      familyName: familyName
    }, {headers: {'x-access-token': UserService.getCookie("lbcd_session")}}).then(() => {
      //OK
    }).catch((err) => {
      console.log('Change UserProfile Error: ' + err)
    })
  }
}
