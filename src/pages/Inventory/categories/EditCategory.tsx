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
import { SearchableSelect } from '../../../components/common/SearchableSelect';
import { getBrands } from '../../../api/services/brands/brands';
import { AxiosError } from 'axios';

interface Values {
    logo: File | null;
    brand_id: string;
    name: string;
    description: string;
}

const EditCategory = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);
    const navigate = useNavigate();
    const [category, setCategory] = useState<any>(null);
    const [brandsData, setBrandsData] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFetchById = async (id: number | null) => {
        setIsLoading(true);
        try {
            const res = await api.get(`${ENDPOINTS.CATEGORIES}/${id}`);
            if (res.status === 200) {
                setCategory(res.data.data);
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
    const handleGetBrands = async () => {
        setIsLoading(true);
        try {
            const res = await getBrands();
            if (res.status === 200) {
                setBrandsData(
                    res.data.data.data.map((item: any) => {
                        return { value: item.id.toString(), label: item.name || '' };
                    })
                );
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

    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('brand_id', values.brand_id);

        if (images.length > 0 && images[0].file) {
            formData.append('logo', images[0].file);
        }

        try {
            const res = await api.post(`${ENDPOINTS.CATEGORIES}/${category?.id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast('success', res.data.message || 'Category updated successfully!');
            navigate('/categories');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
        brand_id: Yup.string().required('Please fill the Brand Name'),
    });

    useEffect(() => {
        const stored = localStorage.getItem('selectedCategory');
        if (stored) {
            setCategory(JSON.parse(stored));
            handleFetchById(stored ? JSON.parse(stored) : null);
        }
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('Edit Category'));
        handleGetBrands();
    }, [dispatch]);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/categories" className="text-primary hover:underline">
                        Categories
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Edit</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{capitalize(category?.name)}</span>
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
                                    brand_id: category
                                        ? category.brand.id.toString()
                                        : '',
                                    name: category ? category?.name : '',
                                    description: category ? category?.description : '',
                                }}
                                enableReinitialize={true}
                                validationSchema={SubmittedForm}
                                onSubmit={submitForm}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                        <div className="flex flex-col">
                                            <FileUploader classes="" images={images} setImages={setImages} />
                                            {errors.logo && <div className="text-red-500 text-sm mt-1">{`${errors.logo} (jpg, jpeg, png)`}</div>}
                                        </div>
                                        <div className="flex-1 flex flex-col space-y-5">
                                            <SearchableSelect id={'brand_id'} name="brand_id" label="Select Brand" options={brandsData} />
                                            <Input id="name" name="name" label="Category Name" type="text" errors={errors} touched={touched} />
                                            <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                            <Button text={isSubmitting ? 'Submitting...' : 'Update Category'} disabled={isSubmitting} />
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

export default EditCategory;
