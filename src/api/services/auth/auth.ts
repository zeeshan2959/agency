import api from '../../axios';
import ENDPOINTS from '../../endpoints';

export interface Values {
    name: string;
    email: string;
    password: string;
}

const signUpUser = async (values:Values) => {
    return await api.post(ENDPOINTS.REGISTER, values);
};

export default signUpUser
