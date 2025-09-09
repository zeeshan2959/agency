import api, { getCsrfCookie } from '../../axios';
import ENDPOINTS from '../../endpoints';

export const getBrands = async (page = 1, perPage = 10, search= '') => {
    // await getCsrfCookie();
    return await api.get(`${ENDPOINTS.BRANDS}?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getDeletedBrands = async (page = 1, perPage = 10, search='') => {
    return await api.get(`${ENDPOINTS.DELETEDBRANDS}?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getBrandsById = async (id:string) => {
    return await api.get(`${ENDPOINTS.BRANDS}/${id}`);
};
export const deleteBrands = async (id: number) => {
    return await api.delete(`${ENDPOINTS.BRANDS}/${id}`);
};
export const deleteBrandsPermanently = async (id: number) => {
    return await api.delete(`${ENDPOINTS.BRANDS}/${id}/force-delete`);
};
export const restoreBrands = async (id: number) => {
    return await api.post(`${ENDPOINTS.BRANDS}/${id}/restore`);
};

export const deleteMultipleBrands = async (ids: number[]) => {
    return await api.post(`${ENDPOINTS.BULKDELETE}`, { ids });
};
export const restoreMultipleBrands = async (id: number) => {
    return await api.post(`${ENDPOINTS.MULTIPLERESTORE}`, { ids: id });
};
export const changeStatus = async (id: number, status:string) => {
    return await api.post(`${ENDPOINTS.BRANDS}/${id}/change-status`, {status: status});
};
