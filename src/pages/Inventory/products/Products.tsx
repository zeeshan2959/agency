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
import { FaHome, FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../../components/common/sweetAlerts/deleteMessage';
import { capitalizeWords } from '../../../utils/capitalizeWords';
import { changeStatus, deleteMultipleProducts, deleteProduct, getProducts } from '../../../api/services/products';
import AvatarGroup from '../../../components/common/AvatarGroup';
import Modal from '../../../components/common/Modal';
import ImageSlider from '../../../components/pages/products/ImageSlider';

type PropType = {
    id: number;
    logo?: string;
    name?: string;
    description?: string;
    status?: string;
};

const Products = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<PropType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<PropType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
    });
    const navigate = useNavigate();

    // Fetch products with pagination
    const handleGetProducts = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getProducts(page, perPage, search);
            if (res.status === 200) {
                setData(res.data.data.data || []);
                setPagination({
                    total: res.data.data.total,
                    perPage: perPage,
                    page: res.data.data.current_page,
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

    // Delete Category
    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteProduct(id);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));
                Toast('success', res.data.message || 'Product deleted successfully');
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            Toast('danger', axiosError.response?.data?.message || axiosError.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Bulk delete
    const handleDeleteSelected = async () => {
        const selectedIds = selectedRows.map((row) => row.id);
        deleteMessage(async () => {
            setIsLoading(true);
            try {
                await deleteMultipleProducts(selectedIds);
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
                setSelectedRows([]);
                Toast('success', 'Selected products deleted successfully');
            } catch (err) {
                const axiosError = err as AxiosError<any>;
                Toast('danger', axiosError.response?.data?.message || 'Unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        });
    };

    // Edit
    const handleUpdate = (id: number) => {
        localStorage.setItem('selectedProduct', id.toString());
        navigate('/products/edit');
    };

    useEffect(() => {
        handleGetProducts(pagination.page, pagination.perPage);
        dispatch(setPageTitle('Products'));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            <FaHome className="shrink-0 h-[18px] w-[18px]" />
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Products</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/products/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Product
                    </Link>
                    <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                        Delete Selected
                    </button>
                </div>
            </div>

            <CommonDataTable
                title="All Products"
                data={data}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        render: (_row: any, index: number) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
                    },
                    {
                        accessor: 'Products',
                        sortable: false,
                        render: (row: any) => (
                            <>
                                <AvatarGroup
                                    avatars={row.images}
                                    onClick={() => {
                                        setSelectedImages(row.images);
                                        setModalOpen(true);
                                    }}
                                />
                            </>
                        ),
                    },
                    { accessor: 'Product Name', sortable: true, render: (row: any) => <span>{capitalizeWords(row?.name)}</span> },
                    { accessor: 'Brand', sortable: true, render: (row: any) => <span>{capitalizeWords(row?.brand?.name)}</span> },
                    { accessor: 'Category', sortable: true, render: (row: any) => <span>{capitalizeWords(row.category.name)}</span> },
                    { accessor: 'Size', sortable: true, render: (row: any) => <span>{`${row.size_ml} (ml)`}</span> },
                    { accessor: 'Reorder level', sortable: true, render: (row: any) => <span>{`${row.reorder_level}`}</span> },
                    {
                        accessor: 'status',
                        sortable: false,
                        title: <div className="text-center w-full">Status</div>,
                        render: (row: any) => (
                            <Switch
                                id={row.id}
                                status={row.status}
                                changeStatus={async (id, newStatus) => {
                                    try {
                                        await changeStatus(id, newStatus);
                                        Toast('success', `Status updated to ${newStatus}`);
                                        setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
                                    } catch (err) {
                                        const axiosError = err as AxiosError<any>;
                                        Toast('danger', axiosError.response?.data?.message || 'Failed to update status');
                                    }
                                }}
                            />
                        ),
                    },
                    {
                        accessor: 'Batches',
                        sortable: true,
                        render: (row: any) => (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    localStorage.setItem('selectBatchId', row?.id.toString());
                                    navigate('/products/batches');
                                }}
                            >{`Add/View batches (${row.batches.length})`}</button>
                        ),
                    },
                    {
                        accessor: 'actions',
                        sortable: false,
                        title: <div className="text-center w-full">Actions</div>,
                        render: (row: any) => (
                            <ul className="flex items-center justify-center gap-2">
                                <li>
                                    <Tippy content="Edit">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleUpdate(row.id);
                                            }}
                                        >
                                            <IconPencil className="text-success" />
                                        </button>
                                    </Tippy>
                                </li>
                                <li>
                                    <Tippy content="Delete">
                                        <button type="button" onClick={() => deleteMessage(() => handleDelete(row.id))}>
                                            <IconTrashLines className="text-danger" />
                                        </button>
                                    </Tippy>
                                </li>
                            </ul>
                        ),
                    },
                ]}
                isLoading={isLoading}
                searchFields={['id', 'name', 'description']}
                selectedRecords={selectedRows}
                onSelectedRecordsChange={setSelectedRows}
                pagination={pagination}
                onPageChange={(page, perPage) => {
                    setPagination((prev) => ({ ...prev, page, perPage }));
                    handleGetProducts(page, perPage);
                }}
                searchQuery={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    handleGetProducts(1, pagination.perPage, val);
                }}
            />
            <Modal modal={modalOpen} setModal={setModalOpen}>
                <ImageSlider avatars={selectedImages} />
            </Modal>
        </div>
    );
};

export default Products;
