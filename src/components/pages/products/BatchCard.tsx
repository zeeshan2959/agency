import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaBoxOpen, FaDollarSign, FaExclamationTriangle, FaLayerGroup, FaClipboardList } from 'react-icons/fa';
import IconPencil from '../../Icon/IconPencil';
import IconTrashLines from '../../Icon/IconTrashLines';
import { AxiosError } from 'axios';
import { deleteBatch, getBatches } from '../../../api/services/products';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../common/Toast';
import { deleteMessage } from '../../common/sweetAlerts/deleteMessage';
import NoDataCard from '../../common/NoDataCard';
import { Loader } from '../../common/Loader';
import { string } from 'yup';
import Pagination from '../../common/pagination';

type Batch = {
    id: string | number;
    batch_no: string;
    cost_price?: number;
    damaged_qty?: number;
    expiry_date?: string;
    mrp_per_unit?: number;
    pack_qty?: number;
    pack_size?: number;
    pack_type?: string;
    price_per_unit?: number;
    reserved_qty?: number;
    single_qty?: number;
};

type BatchCardProps = {
    productId: number | string;
};

const BatchCard: React.FC<BatchCardProps> = ({ productId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
    });
    const navigate = useNavigate();
    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteBatch(id);
            if (res.status === 200) {
                setBatches((prev) => prev.filter((item) => item.id !== id));
                Toast('success', res.data.message || 'Batch deleted successfully');
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            Toast('danger', axiosError.response?.data?.message || axiosError.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetBatches = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getBatches(page, perPage, search, productId as number | String);
            if (res.status === 200) {
                setBatches(res.data.data.batches.data || []);
                setPagination({
                    total: res.data.data.batches.total,
                    perPage: perPage,
                    page: res.data.data.batches.current_page,
                });
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            if (axiosError.response) {
                Toast('danger', axiosError.response.data?.message || 'Something went wrong!');
            } else if (axiosError.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', axiosError.message || 'Unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    console.log('pagination:', pagination);
    const handleUpdate = (id: string | number) => {
        localStorage.setItem('batchId', id.toString());
        navigate('/products/batch/edit');
    };
    useEffect(() => {
        handleGetBatches();
    }, []);
    return isLoading ? (
        <div className="flex w-full flex-col justify-center items-center h-[30vh]">
            <Loader />
            <span>Loading...</span>
        </div>
    ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                {batches.map((batch) => (
                    <div key={batch.id} className="rounded-2xl shadow-lg border border-slate-200 bg-white p-6 hover:shadow-xl transition duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-800">Batch #{batch.batch_no}</h2>
                            <ul className="flex items-center justify-center gap-2">
                                <li>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleUpdate(batch.id)}>
                                            <IconPencil className="text-success" />
                                        </button>
                                    </Tippy>
                                </li>
                                <li>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => deleteMessage(() => handleDelete(Number(batch?.id)))}>
                                            <IconTrashLines className="text-danger" />
                                        </button>
                                    </Tippy>
                                </li>
                            </ul>
                        </div>

                        {/* Highlight Section */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50">
                                <FaDollarSign className="text-green-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Cost Price</p>
                                    <p className="text-sm font-semibold text-slate-800">{batch.cost_price ?? '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50">
                                <FaExclamationTriangle className="text-red-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Damaged Qty</p>
                                    <p className="text-sm font-semibold text-red-600">{batch.damaged_qty ?? '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50">
                                <FaCalendarAlt className="text-yellow-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Expiry</p>
                                    <p className="text-sm font-semibold text-slate-800">{batch.expiry_date ?? '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50">
                                <FaDollarSign className="text-blue-600" />
                                <div>
                                    <p className="text-xs text-slate-500">MRP/Unit</p>
                                    <p className="text-sm font-semibold text-slate-800">{batch.mrp_per_unit ?? '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <FaBoxOpen className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Pack Qty:</span> {batch.pack_qty ?? '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaLayerGroup className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Pack Size:</span> {batch.pack_size ?? '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClipboardList className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Pack Type:</span> {batch.pack_type ?? '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaDollarSign className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Price/Unit:</span> {batch.price_per_unit ?? '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClipboardList className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Reserved Qty:</span> {batch.reserved_qty ?? '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClipboardList className="text-slate-500" />
                                <span>
                                    <span className="font-medium">Single Qty:</span> {batch.single_qty ?? '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {batches.length > 0 && (
                <Pagination
                    page={pagination.page}
                    perPage={pagination.perPage}
                    total={pagination.total}
                    onPageChange={(newPage) => {
                        setPagination((prev) => ({ ...prev, page: newPage }));
                        handleGetBatches(newPage, pagination.perPage);
                    }}
                />
            )}
            {batches.length === 0 && <NoDataCard buttonText="Add New Batch" buttonLink="/products/batch/create" />}
        </>
    );
};

export default BatchCard;
