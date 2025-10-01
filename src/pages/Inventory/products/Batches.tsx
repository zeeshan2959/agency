import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { Toast } from '../../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaHome, FaPlus } from 'react-icons/fa';
import { getProductById } from '../../../api/services/products';
import ProductCard from '../../../components/common/ProductCard';
import { Loader } from '../../../components/common/Loader';
import Tabs from '../../../components/common/Tabs';
import IconHome from '../../../components/Icon/IconHome';
import IconUser from '../../../components/Icon/IconUser';
import BatchCard from '../../../components/pages/products/BatchCard';
import DeletedBatchCard from '../../../components/pages/products/DeleteBatchCard';

const Batches = () => {
    const dispatch = useDispatch();
    const [productData, setProductData] = useState({} as any);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const batchId = localStorage.getItem('selectBatchId');

    // Fetch products with pagination
    const handleGetProduct = async () => {
        setIsLoading(true);
        try {
            const res = await getProductById(batchId);
            if (res.status === 200) {
                setProductData(res.data.data);
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
    useEffect(() => {
        dispatch(setPageTitle('Products batches'));
        handleGetProduct();
    }, []);

    const tabItems = [
        {
            label: 'Active Batches',
            icon: <IconHome className="w-5 h-5" />,
            content: <div>{productData?.id && <BatchCard productId={productData?.id} />}</div>,
        },
        {
            label: 'Deleted Batches',
            icon: <IconUser className="w-5 h-5" />,
            content: <div>{productData?.id && <DeletedBatchCard productId={productData?.id} />}</div>,
        },
    ];

    return (
        <div className="relative">
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
                                <Link to="/" className="text-primary hover:underline">
                                    <FaHome className="shrink-0 h-[18px] w-[18px]" />
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
                    </div>
                    <ProductCard product={productData} />
                    <div className="flex justify-end relative">
                        <button
                            onClick={() => {
                                navigate('/products/batch/create'), localStorage.setItem('selectProductId', productData.id);
                            }}
                            className="btn btn-primary flex items-center gap-2 absolute z-10 top-6 right-0"
                        >
                            <FaPlus /> New Batch
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <Tabs tabs={tabItems} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Batches;
