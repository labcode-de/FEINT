import { Injectable } from '@angular/core';
import axios from "axios";
import {environment} from "../environments/environment";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  private getCookie(name) {
    const regex = new RegExp(name + "=([^;]+)");
    const value = regex.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

  public getFamilyStats(eventId) {
      return new Promise((resolve, reject) => {
        if (this.getCookie("lbcd_session")) {
          axios.get(environment.apiServer + "/event/" + eventId + "/getFamilyStats", {headers: {'x-access-token': this.getCookie("lbcd_session")}}).then((httpResponse) => {
            resolve(httpResponse.data);
          }).catch((httpError) => {
            reject(httpError)
          })
        } else {
          reject("error")
        }
      });
  }

  public createEvent(identifier, name) {
    return new Promise((resolve, reject) => {
      if (this.getCookie("lbcd_session")) {
        axios.post(environment.apiServer + "/event/createEvent", {identifier: identifier, name: name} ,{headers: {'x-access-token': this.getCookie("lbcd_session")}}).then((httpResponse) => {
          resolve(httpResponse.data);
        }).catch((httpError) => {
          reject(httpError)
        })
      } else {
        reject("error")
      }
    });
  }

  public addTokenEvent(token) {
    return new Promise((resolve, reject) => {
      if (this.getCookie("lbcd_session")) {
        axios.post(environment.apiServer + "/event/addTokenEvent", {token:token} ,{headers: {'x-access-token': this.getCookie("lbcd_session")}}).then((httpResponse) => {
          resolve(httpResponse.data);
        }).catch((httpError) => {
          reject(httpError)
        })
      } else {
        reject("error")
      }
    })
  }
}
