import api from '../../axios';
import ENDPOINTS from '../../endpoints';

export const getRetailers = async (page = 1, perPage = 10, search= '') => {
    return await api.get(`${ENDPOINTS.RETAILERS}?page=${page}&paginate=${perPage}&search=${search}`);
};

export const deleteRetailers = async (id: number) => {
    return await api.delete(`${ENDPOINTS.RETAILERS}/${id}`);
};

export const deleteMultipleRetailers = async (ids: number[]) => {
    return await api.post(`${ENDPOINTS.RETAILERS}/bulk-delete`, { ids });
};

export const changeStatus = async (id: number, status:string) => {
    return await api.post(`${ENDPOINTS.RETAILERS}/${id}/change-status`, {status: status});
};
export const getDeletedRetailers = async (page = 1, perPage = 10, search='') => {
    return await api.get(`${ENDPOINTS.RETAILERS}/trashed?page=${page}&paginate=${perPage}&search=${search}`);
};
export const restoreRetailers = async (id: number) => {
    return await api.post(`${ENDPOINTS.RETAILERS}/${id}/restore`);
};
export const restoreMultipleRetailers = async (id: number) => {
    return await api.post(`${ENDPOINTS.RETAILERS}/bulk-restore`, { ids: id });
};
export const deleteRetailersPermanently = async (id: number) => {
    return await api.delete(`${ENDPOINTS.RETAILERS}/${id}/force-delete`);
};
