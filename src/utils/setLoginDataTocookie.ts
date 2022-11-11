import { setCookie } from "./cookie";

export const setLoginDataToCookie = (email: string) => {
    const expires = new Date();
    expires.setHours(expires.getHours() + 20);
    setCookie("login", email, {
        path: '/',
        secure: true,
        sameSite: 'strict',
        expires,
    });
};