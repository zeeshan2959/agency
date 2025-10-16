import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { Toast } from '../../components/common/Toast';
import { FaHome } from 'react-icons/fa';
import PasswordField from '../../components/common/PasswordField';
import { PhoneNumber } from '../../components/common/PhoneNumber';

interface Values {
    name: string;
    email: string;
    retailer_profile?: {
        phone: string;
        shop_name: string;
        shop_address: string;
    };
}

const EditRetailer = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [retailerData, setRetailerData] = useState<Values | null>(null);
    const navigate = useNavigate();

    const retailerId = localStorage.getItem('selectedRetailer');

    const handleFetchById = async (id: number | null) => {
        setIsLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.RETAILERS}/${id}`);
            if (res.status === 200) {
                setRetailerData(res.data.data);
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
            const res = await api.post(`${ENDPOINTS.RETAILERS}/${retailerId}/update`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            Toast('success', res.data.message || 'Retailer created successfully!');
            navigate('/retailers');
        } catch (err: any) {
            setErrors(err.response.data.errors);
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(() => {
        dispatch(setPageTitle('Update Retailer'));
    });

    useEffect(() => {
        handleFetchById(Number(retailerId));
    }, [retailerId]);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
        phone: Yup.string().required('Please fill the Phone'),
        shop_name: Yup.string().required('Please fill the Shop Name'),
        shop_address: Yup.string().required('Please fill the Shop Address'),
    });

    return (
        <div>
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
                    <span>Update Retailer</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        {isLoading ? (
                            <div className="panel-overlay">Fetching Retailer...</div>
                        ) : (
                            <div className="mb-5">
                                <Formik<Values>
                                    initialValues={
                                        {
                                            name: retailerData?.name,
                                            phone: retailerData?.retailer_profile?.phone,
                                            email: retailerData?.email,
                                            password: '',
                                            shop_name: retailerData?.retailer_profile?.shop_name,
                                            shop_address: retailerData?.retailer_profile?.shop_address,
                                        } as Values
                                    }
                                    validationSchema={SubmittedForm}
                                    onSubmit={submitForm}
                                    enableReinitialize={true}
                                >
                                    {({ errors, submitCount, touched, values, isSubmitting }) => (
                                        <Form className="">
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                <div className="col-span-1">
                                                    <Input id="name" name="name" label="Name" type="text" />
                                                </div>
                                                <div className="col-span-1">
                                                    <PhoneNumber name="phone" id="phone" label="Phone Number" />
                                                </div>
                                                <div className="col-span-1">
                                                    <Input id="email" name="email" label="Email (optional)" type="email" />
                                                </div>
                                                <div className="col-span-1">
                                                    <PasswordField id="password" name="password" label="Password (optional)" />
                                                </div>
                                                <div className="col-span-1">
                                                    <Input id="shop_name" name="shop_name" label="Shop Name" type="text" />
                                                </div>
                                                <div className="col-span-1">
                                                    <Input id="shop_address" name="shop_address" label="Shop Address" type="text" />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <Button text={isSubmitting ? 'Submitting...' : 'Update Retailer'} disabled={isSubmitting} />
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

export default EditRetailer;
