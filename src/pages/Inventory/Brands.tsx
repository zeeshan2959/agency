import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import CommonDataTable from '../DataTables/CommonDataTable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Switch } from '../../components/common/Switch';
import { deleteBrands, getBrands } from '../../api/services/brands/brands';
import { Toast } from '../../components/common/Toast';
import { AxiosError } from 'axios';
import { FaPlus } from 'react-icons/fa';
import { deleteMessage } from '../../components/common/sweetAlerts/deleteMessage';

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

    const handleGetBrands = async () => {
        setIsLoading(true);
        try {
            const res = await getBrands();
            if (res.status === 200) {
                setData(res.data.data.data || []);
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

    const handleUpdate = (id: number) => {
        console.log(data.filter((item) => item.id == id));
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
                        <span>brands</span>
                    </li>
                </ul>
                <Link to="/brands/create" className="btn btn-primary flex items-center gap-2">
                    <FaPlus /> New Brand
                </Link>
            </div>
            <CommonDataTable
                title="All Brands"
                data={data}
                columns={[
                    { accessor: 'id', sortable: true },
                    {
                        accessor: 'logo',
                        sortable: false,
                        render: (row: any) => (
                            <>
                                <img src={`${import.meta.env.VITE_ASSET}${row.logo}`} alt={`Brand logo`} className="h-10 w-10 object-cover aspect-square" />
                            </>
                        ),
                    },
                    { accessor: 'name', sortable: true },
                    { accessor: 'description', sortable: true },
                    {
                        accessor: 'status',
                        sortable: false,
                        title: <div className="text-center w-full">Status</div>,
                        render: (row: any) => <Switch status={row.status} />,
                    },
                    {
                        accessor: 'actions',
                        sortable: false,
                        title: <div className="text-center w-full">Actions</div>,
                        render: (row: any) => (
                            <ul className="flex items-center justify-center gap-2">
                                <li>
                                    <Tippy content="Settings">
                                        <button type="button" onClick={() => console.log(`Settings clicked ${row.id}`)}>
                                            <IconSettings className="w-5 h-5 text-primary" />
                                        </button>
                                    </Tippy>
                                </li>
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
            />
        </div>
    );
};

export default Brands;
