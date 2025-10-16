import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import api from '../../../api/axios';
import ENDPOINTS from '../../../api/endpoints';
import { Toast } from '../../../components/common/Toast';
import { SearchableSelect } from '../../../components/common/SearchableSelect';
import { packTypes } from '../../../constants';
import { FaHome } from 'react-icons/fa';

interface Values {
    product_id: number | string;
    expiry_date: string;
    pack_type: string;
    pack_size: string;
    pack_qty: string;
    cost_price: string;
    price_per_unit: string;
    product?: {
        name?: string;
        [key: string]: any;
    };
}

const UpdateBatch = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [batchData, setBatchData] = useState<Values | null>(null);
    const navigate = useNavigate();

    const batchId = localStorage.getItem('batchId');

    const handleFetchById = async (id: number | null) => {
        setIsLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.PRODUCT_BATCHES}/${id}`);
            if (res.status === 200) {
                setBatchData(res.data.data);
                setIsLoading(false);
            }
        } catch (err: any) {
            if (err.response) {
                const data = err.response.data;
                Toast('danger', data.message || 'Something went wrong!');
            } else if (err.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', err.message || 'Unexpected error occurred.');
            }
        }
    };

    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        try {
            const res = await api.post(`${ENDPOINTS.PRODUCT_BATCHES}/${batchId}/update`, values, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Toast('success', res.data.message || 'Batch created successfully!');
            navigate('/products/batches');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };

    const SubmittedForm = Yup.object().shape({});

    useEffect(() => {
        dispatch(setPageTitle('Add Batch'));
    }, []);
    useEffect(() => {
        handleFetchById(Number(batchId));
    }, [batchId]);

    return (
        <div>
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
                    <span>Update Batch</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{batchData?.product?.name}</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        {isLoading ? (
                            <div className="panel-overlay">Fetching Products...</div>
                        ) : (
                            <div className="mb-5">
                                <Formik<Values>
                                    initialValues={{
                                        product_id: batchData?.product_id || '',
                                        expiry_date: batchData?.expiry_date || '',
                                        pack_type: batchData?.pack_type || '',
                                        pack_size: batchData?.pack_size || '',
                                        pack_qty: batchData?.pack_qty || '',
                                        cost_price: batchData?.cost_price || '',
                                        price_per_unit: batchData?.price_per_unit || '',
                                    }}
                                    validationSchema={SubmittedForm}
                                    onSubmit={submitForm}
                                    enableReinitialize={true}
                                >
                                    {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                                        <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                            <div className="flex-1 grid grid-cols-3 gap-5 w-[66%]">
                                                <Input
                                                    id="expiry_date"
                                                    name="expiry_date"
                                                    label="Expiry Date"
                                                    type="date"
                                                    placeholder="Enter Expiry Date"
                                                />

                                                <SearchableSelect id="pack_type" name="pack_type" label="Select Pack Type" options={packTypes} />

                                                <Input
                                                    id="pack_size"
                                                    name="pack_size"
                                                    label="Units Per Pack"
                                                    type="number"
                                                    placeholder="Enter Pack Size"
                                                />

                                                <Input
                                                    id="pack_qty"
                                                    name="pack_qty"
                                                    label="Pack Quantity"
                                                    type="number"
                                                    placeholder="Enter Pack Quantity"
                                                />

                                                <Input
                                                    id="cost_price"
                                                    name="cost_price"
                                                    label="Cost Price"
                                                    type="number"
                                                    placeholder="Enter Cost Price"
                                                />

                                                <Input
                                                    id="price_per_unit"
                                                    name="price_per_unit"
                                                    label="Price Per Unit"
                                                    type="number"
                                                    placeholder="Enter Price Per Unit"
                                                />
                                                <div className="col-span-3 flex items-center justify-end">
                                                    <Button text={isSubmitting ? 'Submitting...' : 'Update Batch'} disabled={isSubmitting} />
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBatch;
