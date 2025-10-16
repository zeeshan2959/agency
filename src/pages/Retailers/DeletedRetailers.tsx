import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { AxiosError } from 'axios';
import { FaHome, FaPlus } from 'react-icons/fa';
import { capitalize } from 'lodash';
import { Toast } from '../../components/common/Toast';
import { setPageTitle } from '../../store/themeConfigSlice';
import CommonDataTable from '../DataTables/CommonDataTable';
import IconRestore from '../../components/Icon/IconRestore';
import { deleteMessage } from '../../components/common/sweetAlerts/deleteMessage';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { deleteRetailersPermanently, getDeletedRetailers, restoreMultipleRetailers, restoreRetailers } from '../../api/services/retailers';

type Retailer = {
    id: number;
    profile_image?: string;
    name?: string;
    retailer_profile?:{
        shop_name?: string;
        phone?:string;
        shop_address?:string;

    }
    status?: string;
    isLoading?: boolean;
};

const DeletedRetailers = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<Retailer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Retailer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
    });
    // Fetch deleted brands with pagination
    const handleGetRetailers = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getDeletedRetailers(page, perPage, search);
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
    // delete brand permanently
    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteRetailersPermanently(id);

            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));

                Toast('success', res.data.message || 'Retailers deleted successfully');
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
    // restore brand
    const handleRestore = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await restoreRetailers(id);

            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));
                Toast('success', res.data.message || 'Retailer restore successfully');
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
    // restore multiple brands
    const handleRestoreSelected = async () => {
        const selectedIds = selectedRows.map((row) => row.id);
        setIsLoading(true);
        try {
            const res = await restoreMultipleRetailers(selectedIds as unknown as number);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
            }
            Toast('success', 'Selected retailers restored successfully');
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
        handleGetRetailers();
        dispatch(setPageTitle('Deleted Retailers'));
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
                        <Link to="/retailers" className="text-primary hover:underline">
                            Retailers
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Deleted</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/retailers/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Retailer
                    </Link>
                    <button className="btn btn-success" onClick={handleRestoreSelected} disabled={selectedRows.length === 0}>
                        Restore Selected
                    </button>
                </div>
            </div>
            <CommonDataTable
                title="Deleted Retailers"
                data={data}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        render: (_row: any, index: number) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
                    },
                    {
                        accessor: 'profile_image',
                        sortable: false,
                        render: (row: any) => (
                            <>
                                <img
                                    src={`${import.meta.env.VITE_ASSET}${row.profile_image}`}
                                    alt={`profile image`}
                                    className="h-10 w-10 object-cover aspect-square rounded-full border border-gray-300"
                                />
                            </>
                        ),
                    },
                    { accessor: 'name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.name)}</span> },
                    { accessor: 'shop name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.retailer_profile.shop_name)}</span> },
                    { accessor: 'Phone', sortable: true, render: (row: any) => <span>{row.retailer_profile.phone || '---'}</span> },
                    {
                        accessor: 'Shop address',
                        sortable: true,
                        render: (row: any) =>
                            row.retailer_profile.shop_address ? (
                                <Tippy content={row.retailer_profile.shop_address}>
                                    <p className="truncate w-48">{capitalize(row.retailer_profile.shop_address)}</p>
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
                searchFields={['id', 'name', 'retailer_profile']}
                selectedRecords={selectedRows}
                onSelectedRecordsChange={setSelectedRows}
                pagination={pagination}
                onPageChange={(page, perPage) => {
                    setPagination((prev) => ({ ...prev, page, perPage }));
                    handleGetRetailers(page, perPage);
                }}
                searchQuery={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    handleGetRetailers(1, pagination.perPage, val);
                }}
            />
        </div>
    );
};

export default DeletedRetailers;
