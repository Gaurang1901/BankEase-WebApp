import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  static readonly APP_PREFIX = 'NG-TEMPLATE-';

  /**
   * Sets item in local storage
   *
   * @param {string} key
   * @param {unknown} value
   */

  constructor(private cookieService: CookieService) {}

  setItem(key: string, value: unknown) {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 22 * 60 * 60 * 1000); // 22 hours in milliseconds
    try {
      this.cookieService.set(
        `${LocalStorageService.APP_PREFIX}${key}`,
        JSON.stringify(value),
        {
          expires: expireDate,
          sameSite: 'Lax',
          path: '/',
        }
      );
    } catch (e) {
      this.cookieService.set(
        `${LocalStorageService.APP_PREFIX}${key}`,
        value as string,
        {
          expires: expireDate,
          sameSite: 'Lax',
          path: '/',
        }
      );
    }
  }

  /**
   * Gets item from local storage by key
   *
   * @param {string} key
   * @return {*}  {unknown}
   */
  getItem(key: string): unknown {
    const value = this.cookieService.get(
      `${LocalStorageService.APP_PREFIX}${key}`
    );
    try {
      return JSON.parse(value as string);
    } catch (e) {
      return value;
    }
  }

  /**
   * Removes item from local storage by key
   *
   * @param {string} key
   */
  removeItem(key: string) {
    this.cookieService.delete(`${LocalStorageService.APP_PREFIX}${key}`, '/');
  }
}
