import api, { getCsrfCookie } from '../../axios';
import ENDPOINTS from '../../endpoints';

export interface Values {
    name: string;
    email: string;
    password: string;
}
export interface LoginValues {
    email: string;
    password: string;
}

export const signUpUser = async (values:Values) => {
    await getCsrfCookie();
    return await api.post(ENDPOINTS.REGISTER, values);
};
export const signInUser = async (values:LoginValues) => {
    await getCsrfCookie();
    return await api.post(ENDPOINTS.LOGIN, values);
};

