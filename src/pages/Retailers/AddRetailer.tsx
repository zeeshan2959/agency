import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
    phone: string;
    email: string;
    password: string;
    shop_name: string;
    shop_address: string;
}

const AddRetailer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Add Retailer'));
    });
    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        try {
            const res = await api.post(ENDPOINTS.RETAILERS, values, {
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
                    <span>Add Retailer</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        <div className="mb-5">
                            <Formik<Values>
                                initialValues={
                                    {
                                        name: '',
                                        phone: '',
                                        email: '',
                                        password: '',
                                        shop_name: '',
                                        shop_address: '',
                                    } as Values
                                }
                                validationSchema={SubmittedForm}
                                onSubmit={submitForm}
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
                                            <Button text={isSubmitting ? 'Submitting...' : 'Add Retailer'} disabled={isSubmitting} />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRetailer;
