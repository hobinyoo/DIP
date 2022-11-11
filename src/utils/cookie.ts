import { Cookies } from 'react-cookie';
import { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

const index = new Cookies();

export const setCookie = (name: string, value: string, options?: CookieSetOptions) =>
  index.set(name, value, options);
export const getCookie = (name: string, options?: CookieGetOptions) => index.get(name, options);
export const removeCookie = (name: string) => index.remove(name);