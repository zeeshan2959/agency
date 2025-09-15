import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import CommonDataTable from '../../DataTables/CommonDataTable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Switch } from '../../../components/common/Switch';
import { Toast } from '../../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../../components/common/sweetAlerts/deleteMessage';
import { capitalizeWords } from '../../../utils/capitalizeWords';
import { changeStatus, deleteMultipleProducts, deleteProduct, getProductById, getProducts } from '../../../api/services/products';
import AvatarGroup from '../../../components/common/AvatarGroup';
import BatchCard from '../../../components/common/BatchCard';
import ProductCard from '../../../components/common/ProductCard';
import NoDataCard from '../../../components/common/NoDataCard';
import { Loader } from '../../../components/common/Loader';

const Batches = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [productData, setProductData] = useState({} as any);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
    });
    const navigate = useNavigate();
    const batchId = localStorage.getItem('selectBatchId');

    // Fetch products with pagination
    const handleGetProduct = async () => {
        setIsLoading(true);
        try {
            const res = await getProductById(batchId);
            if (res.status === 200) {
                setProductData(res.data.data);
                setData(res.data.data.batches || []);
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

    // Delete Category
    // const handleDelete = async (id: number) => {
    //     setIsLoading(true);
    //     try {
    //         const res = await deleteProduct(id);
    //         if (res.status === 200) {
    //             setData((prev) => prev.filter((item) => item.id !== id));
    //             Toast('success', res.data.message || 'Product deleted successfully');
    //         }
    //     } catch (err) {
    //         const axiosError = err as AxiosError<any>;
    //         Toast('danger', axiosError.response?.data?.message || axiosError.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Bulk delete
    // const handleDeleteSelected = async () => {
    //     const selectedIds = selectedRows.map((row) => row.id);
    //     deleteMessage(async () => {
    //         setIsLoading(true);
    //         try {
    //             await deleteMultipleProducts(selectedIds);
    //             setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
    //             setSelectedRows([]);
    //             Toast('success', 'Selected products deleted successfully');
    //         } catch (err) {
    //             const axiosError = err as AxiosError<any>;
    //             Toast('danger', axiosError.response?.data?.message || 'Unexpected error occurred.');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     });
    // };

    // Edit
    const handleUpdate = (id: number) => {
        localStorage.setItem('selectedCategory', id.toString());
        navigate('/products/edit');
    };

    useEffect(() => {
        dispatch(setPageTitle('Products batches'));
        handleGetProduct();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-[50vh]">
                    <Loader />
                    <span>Loading...</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <ul className="flex space-x-2 rtl:space-x-reverse">
                            <li>
                                <Link to="#" className="text-primary hover:underline">
                                    Inventory
                                </Link>
                            </li>
                            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                                <Link to="/products" className="text-primary hover:underline">
                                    Products
                                </Link>
                            </li>
                            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                                <span>{productData.name}</span>
                            </li>
                        </ul>
                        <div className="flex items-center gap-3">
                            <Link to="/products/batch/create" className="btn btn-primary flex items-center gap-2">
                                <FaPlus /> New Batch
                            </Link>
                        </div>
                    </div>
                    <ProductCard product={productData} />
                    <h2 className="text-lg font-semibold text-slate-800 my-4">Product Batches</h2>
                    <BatchCard batches={data} />
                    {data.length === 0 && <NoDataCard buttonText="Add New Batch" buttonLink="/products/batch/create" />}
                </>
            )}
        </div>
    );
};

export default Batches;
