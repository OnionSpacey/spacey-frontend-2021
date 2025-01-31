import { Injectable } from '@angular/core';
import { sessionStorageKeys } from '../../../../environments/session-storage-manager';

const TOKEN_KEY = sessionStorageKeys.TOKEN_KEY;
const USERNAME_KEY = sessionStorageKeys.USERNAME_KEY;
const ROLE_KEY = sessionStorageKeys.ROLE_KEY;

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
  }

  public saveToken(token: string) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveRole(role: string) {
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.setItem(ROLE_KEY, role);
  }

  public getRole() {
    return sessionStorage.getItem(ROLE_KEY) as string;
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) as string;
  }

  public saveUsername(username: string) {
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY) as string;
  }

  public isAuthorised(): boolean {
    return (
      sessionStorage.getItem(TOKEN_KEY) !== null &&
      sessionStorage.getItem(TOKEN_KEY) !== ''
    );
  }
}
