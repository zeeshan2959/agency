import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import CommonDataTable from '../../DataTables/CommonDataTable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { Toast } from '../../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaHome, FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../../components/common/sweetAlerts/deleteMessage';
import { capitalizeWords } from '../../../utils/capitalizeWords';
import { deleteProductPermanently, getDeletedProducts, restoreMultipleProducts, restoreProduct } from '../../../api/services/products';
import AvatarGroup from '../../../components/common/AvatarGroup';
import Modal from '../../../components/common/Modal';
import ImageSlider from '../../../components/pages/products/ImageSlider';
import IconRestore from '../../../components/Icon/IconRestore';

type PropType = {
    id: number;
    logo?: string;
    name?: string;
    description?: string;
    status?: string;
};

const DeletedProducts = () => {
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
    const handleGetDeletedProducts = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getDeletedProducts(page, perPage, search);
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
    const handleRestore = async (id: number) => {
        setIsLoading(true);

        try {
            const res = await restoreProduct(id);

            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));

                Toast('success', res.data.message || 'Product restore successfully');
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;

            if (axiosError.response) {
                const data = axiosError.response.data;
                Toast('danger', data.message || 'Something went wrong!');
            } else if (axiosError.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', axiosError.message || 'Unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Delete product permanently
    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteProductPermanently(id);
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

    // Bulk restore
    const handleRestoreSelected = async () => {
        const selectedIds = selectedRows.map((row) => row.id);

        setIsLoading(true);
        try {
            const res = await restoreMultipleProducts(selectedIds as unknown as number);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
            }
            Toast('success', 'Selected products restored successfully');
            setSelectedRows([]);
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            if (axiosError.response) {
                const data = axiosError.response.data;
                Toast('danger', data.message || 'Something went wrong!');
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
        handleGetDeletedProducts(pagination.page, pagination.perPage);
        dispatch(setPageTitle('Deleted Products'));
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
                        <Link to="/products" className="text-primary hover:underline">
                            Products
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Deleted</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/products/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Product
                    </Link>
                    <button className="btn btn-success" onClick={handleRestoreSelected} disabled={selectedRows.length === 0}>
                        Restore Selected
                    </button>
                </div>
            </div>

            <CommonDataTable
                title="Deleted Products"
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
                    { accessor: 'Product Name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.name)}</span> },
                    { accessor: 'Brand', sortable: true, render: (row: any) => <span>{capitalizeWords(row.brand.name)}</span> },
                    { accessor: 'Category', sortable: true, render: (row: any) => <span>{capitalizeWords(row.category.name)}</span> },
                    { accessor: 'Size', sortable: true, render: (row: any) => <span>{`${row.size_ml} (ml)`}</span> },
                    { accessor: 'Reorder level', sortable: true, render: (row: any) => <span>{`${row.reorder_level}`}</span> },
                    {
                        accessor: 'Batches',
                        sortable: true,
                        render: (row: any) => <span className="">{`${row.batches.length}`}</span>,
                    },
                    {
                        accessor: 'actions',
                        sortable: false,
                        title: <div className="text-center w-full">Actions</div>,
                        render: (row: any) => (
                            <ul className="flex items-center justify-center gap-2">
                                <li>
                                    <Tippy content="Restore">
                                        <button type="button" onClick={() => handleRestore(row.id)}>
                                            <IconRestore className="w-5 h-5 text-primary transform scale-x-[-1]" />
                                        </button>
                                    </Tippy>
                                </li>
                                <li>
                                    <Tippy content="Delete Permanently">
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
                    handleGetDeletedProducts(page, perPage);
                }}
                searchQuery={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    handleGetDeletedProducts(1, pagination.perPage, val);
                }}
            />
            <Modal modal={modalOpen} setModal={setModalOpen}>
                <ImageSlider avatars={selectedImages} />
            </Modal>
        </div>
    );
};

export default DeletedProducts;
