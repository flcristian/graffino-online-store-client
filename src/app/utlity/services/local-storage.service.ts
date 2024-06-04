import { Injectable } from '@angular/core';
import {CurrentUserLocalStorage} from "../../users/models/current-user-local-storage.model";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveUser(state: CurrentUserLocalStorage) {
    const existingUsersJson = localStorage.getItem("users");
    let existingUsers: CurrentUserLocalStorage[] = [];

    if (existingUsersJson) {
      existingUsers = JSON.parse(existingUsersJson);
    }

    const existingUserIndex = existingUsers.findIndex(u => u.user.email === state.user.email);

    if (existingUserIndex !== -1) {
      let oldToken = existingUsers[existingUserIndex].token

      state.tokenDate = existingUsers[existingUserIndex].tokenDate ?? new Date()
      if(oldToken !== state.token) state.tokenDate = new Date()

      existingUsers[existingUserIndex] = state;
    } else {
      existingUsers.push(state);
    }

    localStorage.setItem("users", JSON.stringify(existingUsers));
  }

  logUserOut(email: string) {
    const existingUsersJson = localStorage.getItem("users");

    if (existingUsersJson) {
      const existingUsers: CurrentUserLocalStorage[] = JSON.parse(existingUsersJson);
      const userIndex = existingUsers.findIndex(state => state.user.email === email);

      if (userIndex !== -1) {
        existingUsers[userIndex].token = null;
        localStorage.setItem("users", JSON.stringify(existingUsers));
      }
    }
  }

  retrieveLoggedInUser(): CurrentUserLocalStorage | null {
    const serializedData = localStorage.getItem("users");
    if (serializedData) {
      let users: CurrentUserLocalStorage[] = JSON.parse(serializedData);

      let index = users.findIndex(state => state.token !== null)
      if(index === -1) return null

      return users[index]
    }
    return null;
  }

  tokenExpired(user: CurrentUserLocalStorage): boolean {
    if(user.tokenDate === null) return true

    const tokenDate = new Date(user.tokenDate)
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - tokenDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference >= 1;
  }

  retrieveUser(email: string): CurrentUserLocalStorage | null {
    const serializedData = localStorage.getItem("users");
    if (serializedData) {
      let users: CurrentUserLocalStorage[] = JSON.parse(serializedData);

      let index = users.findIndex(state => state.user.email === email)
      if(index === -1) return null

      return users[index]
    }
    return null;
  }
}
