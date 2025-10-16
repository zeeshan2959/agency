import { Link } from 'react-router-dom';
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
import IconRestore from '../../../components/Icon/IconRestore';
import { capitalizeWords } from '../../../utils/capitalizeWords';
import { capitalize } from 'lodash';
import { deleteCategoryPermanently, getDeletedCategories, restoreCategory, restoreMultipleCategories } from '../../../api/services/categories';
import { PiImageFill } from "react-icons/pi";

type Brand = {
    id: number;
    logo?: string;
    name?: string;
    description?: string;
    status?: string;
    isLoading?: boolean;
};

const DeletedCategories = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Brand[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
    });
    // Fetch deleted categories with pagination
    const handleGetDeleted = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getDeletedCategories(page, perPage, search);
            if (res.status === 200) {
                setData(res.data.data.data || []);
                setPagination({
                    total: res.data.data.total,
                    perPage: perPage,
                    page: res.data.data.current_page,
                });
                setIsLoading(false);
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;

            if (axiosError.response) {
                const data = axiosError.response.data;

                if (data.errors) {
                    Toast('danger', data.message || 'Something went wrong!');
                } else {
                    Toast('danger', data.message || 'Something went wrong!');
                }
            } else if (axiosError.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', axiosError.message || 'Unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    // delete category permanently
    const handleDelete = async (id: number) => {
        setIsLoading(true);

        try {
            const res = await deleteCategoryPermanently(id);

            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));

                Toast('success', res.data.message || 'Category deleted successfully');
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
    // restore category
    const handleRestore = async (id: number) => {
        setIsLoading(true);

        try {
            const res = await restoreCategory(id);

            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));

                Toast('success', res.data.message || 'Category restore successfully');
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
    // restore multiple categories
    const handleRestoreSelected = async () => {
        const selectedIds = selectedRows.map((row) => row.id);

        setIsLoading(true);
        try {
            const res = await restoreMultipleCategories(selectedIds as unknown as number);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
            }
            Toast('success', 'Selected categories restored successfully');
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
        handleGetDeleted();
        dispatch(setPageTitle('Deleted Categories'));
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
                        <Link to="/categories" className="text-primary hover:underline">
                            Categories
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Deleted</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/categories/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Category
                    </Link>
                    <button className="btn btn-success" onClick={handleRestoreSelected} disabled={selectedRows.length === 0}>
                        Restore Selected
                    </button>
                </div>
            </div>
            <CommonDataTable
                title="Deleted Categories"
                data={data}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        render: (_row: any, index: number) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
                    },
                    {
                        accessor: 'logo',
                        sortable: false,
                        render: (row: any) => (
                            <>
                                {row.logo ? (
                                    <img src={`${import.meta.env.VITE_ASSET}${row.logo}`} alt="Category logo" className="h-10 w-10 object-cover aspect-square rounded-full border border-gray-300" />
                                ) : (
                                    <PiImageFill className='h-10 w-10' />
                                )}
                            </>
                        ),
                    },
                    { accessor: 'name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.name)}</span> },
                    { accessor: 'Brand name', sortable: true, render: (row: any) => <span>{capitalizeWords(row?.brand?.name)}</span> },
                    {
                        accessor: 'description',
                        sortable: true,
                        render: (row: any) =>
                            row.description ? (
                                <Tippy content={row.description}>
                                    <p className="truncate w-48">{capitalize(row.description)}</p>
                                </Tippy>
                            ) : (
                                <span>---</span>
                            ),
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
                    handleGetDeleted(page, perPage);
                }}
                searchQuery={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    handleGetDeleted(1, pagination.perPage, val);
                }}
            />
        </div>
    );
};

export default DeletedCategories;
