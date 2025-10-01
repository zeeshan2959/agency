import api, { getCsrfCookie } from '../../axios';
import ENDPOINTS from '../../endpoints';

export const getCategories = async (page = 1, perPage = 10, search= '') => {
    // await getCsrfCookie();
    return await api.get(`${ENDPOINTS.CATEGORIES}?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getDeletedCategories = async (page = 1, perPage = 10, search='') => {
    return await api.get(`${ENDPOINTS.CATEGORIES}/trashed?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getBrandsById = async (id:string) => {
    return await api.get(`${ENDPOINTS.BRANDS}/${id}`);
};
export const deleteCategory = async (id: number) => {
    return await api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
};
export const deleteCategoryPermanently = async (id: number) => {
    return await api.delete(`${ENDPOINTS.CATEGORIES}/${id}/force-delete`);
};
export const restoreCategory = async (id: number) => {
    return await api.post(`${ENDPOINTS.CATEGORIES}/${id}/restore`);
};

export const deleteMultipleCategories = async (ids: number[]) => {
    return await api.post(`${ENDPOINTS.CATEGORIES}/bulk-delete`, { ids });
};
export const restoreMultipleCategories = async (id: number) => {
    return await api.post(`${ENDPOINTS.CATEGORIES}/bulk-restore`, { ids: id });
};
export const changeStatus = async (id: number, status:string) => {
    return await api.post(`${ENDPOINTS.CATEGORIES}/${id}/change-status`, {status: status});
};
