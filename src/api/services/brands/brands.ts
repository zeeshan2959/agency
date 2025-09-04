import api, { getCsrfCookie } from '../../axios';
import ENDPOINTS from '../../endpoints';

export const getBrands = async () => {
    // await getCsrfCookie();
    return await api.get(ENDPOINTS.BRANDS);
};
export const deleteBrands = async (id: number) => {
    return await api.delete(`${ENDPOINTS.BRANDS}/${id}`);
};

