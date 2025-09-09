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
import { changeStatus, deleteBrands, deleteMultipleBrands, getBrands, getBrandsById } from '../../api/services/brands/brands';
import { Toast } from '../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../components/common/sweetAlerts/deleteMessage';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { capitalize } from 'lodash';

type Brand = {
    id: number;
    logo?: string;
    name?: string;
    description?: string;
    status?: string;
    isLoading?: boolean;
};

const Brands = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Brand[]>([]);
    const navigate = useNavigate();

    const handleGetBrands = async () => {
        setIsLoading(true);
        try {
            const res = await getBrands();
            if (res.status === 200) {
                setData(res.data.data.data || []);
            }
            console.log(res);
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

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await deleteBrands(id);
            if (res.status === 200) {
                setData((prev) => prev.filter((item) => item.id !== id));
                Toast('success', res.data.message || 'Brand deleted successfully');
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
                await deleteMultipleBrands(selectedIds as unknown as number);
                setData((prev) => prev.filter((item) => !selectedRows.some((s) => s.id === item.id)));
                setSelectedRows([]);
                Toast('success', 'Selected brands deleted successfully');
            } catch (err) {
                const axiosError = err as AxiosError<any>;
                Toast('danger', axiosError.response?.data?.message || 'Unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        });
    };

    const handleUpdate = (id: number) => {
        localStorage.setItem('selectedBrand', id.toString());
        navigate('/brands/edit');
    };

    useEffect(() => {
        handleGetBrands();
        dispatch(setPageTitle('AddBrand'));
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-primary hover:underline">
                            Inventory
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Brands</span>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link to="/brands/create" className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> New Brand
                    </Link>
                    <button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                        Delete Selected
                    </button>
                </div>
            </div>

            <CommonDataTable
                title="All Brands"
                data={data}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        render: (_row: any, index: number) => <span>{index + 1}</span>,
                    },
                    {
                        accessor: 'logo',
                        sortable: false,
                        render: (row: any) => (
                            <img src={`${import.meta.env.VITE_ASSET}${row.logo}`} alt="Brand logo" className="h-10 w-10 object-cover aspect-square rounded-full border border-gray-300" />
                        ),
                    },
                    { accessor: 'name', sortable: true, render: (row: any) => <span>{capitalizeWords(row.name)}</span> },
                    {
                        accessor: 'description',
                        sortable: true,
                        render: (row: any) => (
                            row.description ?
                            <Tippy content={row.description}>
                                <p className="truncate w-48">{capitalize(row.description)}</p>
                            </Tippy>
                            : <span>---</span>
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
            />
        </div>
    );
};

export default Brands;
