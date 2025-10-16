import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import FileUploader from '../../../components/common/FileUploader';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { ImageType } from 'react-images-uploading';
import api from '../../../api/axios';
import ENDPOINTS from '../../../api/endpoints';
import { Toast } from '../../../components/common/Toast';
import { Loader } from '../../../components/common/Loader';
import { capitalize } from 'lodash';
import { FaHome } from 'react-icons/fa';

interface Values {
    logo: File | null;
    name: string;
    description: string;
}

const EditBrand = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);
    const navigate = useNavigate();
    const [brand, setBrand] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFetchBrandById = async (id: number | null) => {
        setIsLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.BRANDS}/${id}`);
            if (res.status === 200) {
                console.log(res.data.data)
                setBrand(res.data.data);
                setImages([
                    {
                        dataURL: `${import.meta.env.VITE_ASSET}${res?.data?.data?.logo}`,
                    } as ImageType,
                ]);
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

    useEffect(() => {
        const stored = localStorage.getItem('selectedBrand');
        if (stored) {
            setBrand(JSON.parse(stored));
            handleFetchBrandById(stored ? JSON.parse(stored) : null);
        }
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('Edit Brand'));
    }, [dispatch]);

    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);

        if (images.length > 0 && images[0].file) {
            formData.append('logo', images[0].file);
        }

        try {
            const res = await api.post(`${ENDPOINTS.BRANDS}/${brand?.id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast('success', res.data.message || 'Brand updated successfully!');
            navigate('/brands');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
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
                    <Link to="/brands" className="text-primary hover:underline">
                        Brands
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Edit</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{capitalize(brand?.name)}</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="panel">
                    {isLoading ? (
                        <div className="flex flex-col items-center">
                            <Loader classes="border-blue-600 mb-4" />
                            <span>Loading..</span>
                        </div>
                    ) : (
                        <div className="mb-5">
                            <Formik<Values>
                                initialValues={{
                                    logo: null,
                                    name: brand ? brand.name : '',
                                    description: brand ? brand.description : '',
                                }}
                                enableReinitialize={true}
                                validationSchema={SubmittedForm}
                                onSubmit={submitForm}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                        <div className="flex flex-col relative">
                                            <FileUploader classes="" images={images} setImages={setImages} />
                                            {errors.logo && <div className="text-red-500 text-sm mt-1">{`${errors.logo} (jpg, jpeg, png)`}</div>}
                                        </div>
                                        <div className="flex-1 flex flex-col space-y-5">
                                            <Input id="name" name="name" label="Name" type="text" />
                                            <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                            <Button text={isSubmitting ? 'Submitting...' : 'Update Brand'} disabled={isSubmitting} />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditBrand;
