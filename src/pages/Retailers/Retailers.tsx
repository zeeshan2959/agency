import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import CommonDataTable from '../DataTables/CommonDataTable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Switch } from '../../components/common/Switch';
import { Toast } from '../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaHome, FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../components/common/sweetAlerts/deleteMessage';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { capitalize } from 'lodash';
import { deleteMultipleRetailers, deleteRetailers, getRetailers, changeStatus } from '../../api/services/retailers';

type Retailer = {
    id: number;
    logo?: string;
    name?: string;
    description?: string;
    status?: string;
};

const Retailers = () => {
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
    const navigate = useNavigate();

    const handleGetRetailers = async (page = 1, perPage = 10, search = '') => {
        setIsLoading(true);
        try {
            const res = await getRetailers(page, perPage, search);
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

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteRetailers(id);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));
                Toast('success', res.data.message || 'Retailer deleted successfully');
            }
        } catch (err) {
            const axiosError = err as AxiosError<any>;
            Toast('danger', axiosError.response?.data?.message || axiosError.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedIds = selectedRows.map((row) => row.id);
        deleteMessage(async () => {
            setIsLoading(true);
            try {
                await deleteMultipleRetailers(selectedIds);
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
                setSelectedRows([]);
                Toast('success', 'Selected retailers deleted successfully');
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
        localStorage.setItem('selectedRetailer', id.toString());
        navigate('/retailers/edit');
    };

    useEffect(() => {
        handleGetRetailers(pagination.page, pagination.perPage);
        dispatch(setPageTitle('Retailers'));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary">
                            <FaHome className="shrink-0 h-[18px] w-[18px]" />
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Retailers</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/retailers/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Retailer
                    </Link>
                    <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                        Delete Selected
                    </button>
                </div>
            </div>

            <CommonDataTable
                title="All Retailers"
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
                            <img src={`${import.meta.env.VITE_ASSET}${row.logo}`} alt="Profile image" className="h-10 w-10 object-cover aspect-square rounded-full border border-gray-300" />
                        ),
                    },
                    { accessor: 'name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.name)}</span> },
                    { accessor: 'Shop name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.retailer_profile.shop_name)}</span> },
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
                        accessor: 'actions',
                        sortable: false,
                        title: <div className="text-center w-full">Actions</div>,
                        render: (row: any) => (
                            <ul className="flex items-center justify-center gap-2">
                                <li>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => handleUpdate(row.id)}>
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

export default Retailers;
