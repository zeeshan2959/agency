import api from '../../axios';
import ENDPOINTS from '../../endpoints';

export const getProducts = async (page = 1, perPage = 10, search= '') => {
    return await api.get(`${ENDPOINTS.PRODUCTS}?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getProductById = async (id:any) => {
    return await api.get(`${ENDPOINTS.PRODUCTS}/${id}`);
};
export const getDeletedBatches = async (page = 1, perPage = 10, search='', id:Number | String) => {
    return await api.get(`${ENDPOINTS.PRODUCTS}/${id}/with-deleted-batches?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getBatches = async (page = 1, perPage = 10, search='', id:Number | String) => {
    return await api.get(`${ENDPOINTS.PRODUCTS}/${id}/with-batches?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getDeletedProducts = async (page = 1, perPage = 10, search='') => {
    return await api.get(`${ENDPOINTS.PRODUCTS}/trashed?page=${page}&paginate=${perPage}&search=${search}`);
};
export const getBrandsById = async (id:string) => {
    return await api.get(`${ENDPOINTS.BRANDS}/${id}`);
};
export const deleteProduct = async (id: number) => {
    return await api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
};
export const deleteBatch = async (id: number) => {
    return await api.delete(`${ENDPOINTS.PRODUCT_BATCHES}/${id}`);
};
export const deleteProductPermanently = async (id: number) => {
    return await api.delete(`${ENDPOINTS.PRODUCTS}/${id}/force-delete`);
};
export const deleteBatchPermanently = async (id: number) => {
    return await api.delete(`${ENDPOINTS.PRODUCT_BATCHES}/${id}/force-delete`);
};
export const restoreProduct = async (id: number) => {
    return await api.post(`${ENDPOINTS.PRODUCTS}/${id}/restore`);
};
export const restoreBatch = async (id: number) => {
    return await api.post(`${ENDPOINTS.PRODUCT_BATCHES}/${id}/restore`);
};

export const deleteMultipleProducts = async (ids: number[]) => {
    return await api.post(`${ENDPOINTS.PRODUCTS}/bulk-delete`, { ids });
};
export const restoreMultipleProducts = async (id: number) => {
    return await api.post(`${ENDPOINTS.PRODUCTS}/bulk-restore`, { ids: id });
};
export const changeStatus = async (id: number, status:string) => {
    return await api.post(`${ENDPOINTS.PRODUCTS}/${id}/change-status`, {status: status});
};
