import {Injectable} from '@angular/core';
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

  constructor() {
  }

  private getCookie(name) {
    const regex = new RegExp(name + "=([^;]+)");
    const value = regex.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  public forceGetUser() {
    this.loaded = false;
    this.getUser();
  }

  public getUser() {
    return new Promise((resolve, reject) => {
      if (!this.loaded) {
        if (this.getCookie("lbcd_session")) {
          axios.get(environment.apiServer + "/user/getProfile", {headers: {'x-access-token': this.getCookie("lbcd_session")}}).then((httpResponse) => {
            this.isAuthenticated = true;
            this.user = new User(httpResponse);
            this.loaded = true;
            resolve(this.user);
          }).catch((httpError) => {
            this.isAuthenticated = false;
            reject(httpError)
          })
        } else {
          this.isAuthenticated = false;
          reject("error")
        }
      } else {
        if (this.isAuthenticated) {
          resolve(this.user);
        } else {
          reject('error')
        }
      }
    })
  }

  public

  changeUserProfile(firstName
                      :
                      String, familyName
                      :
                      String
  ) {
    axios.post(environment.apiServer + "/control/changeProfile", {
      firstName: firstName,
      familyName: familyName
    }, {headers: {'x-access-token': this.getCookie("lbcd_session")}}).then(() => {
      this.user.firstName = firstName;
      this.user.familyName = familyName;
      //OK
    }).catch((err) => {
      console.log('Change UserProfile Error: ' + err)
    })
  }
}
