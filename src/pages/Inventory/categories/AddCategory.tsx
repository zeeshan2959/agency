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
import { SearchableSelect } from '../../../components/common/SearchableSelect';
import { getBrands } from '../../../api/services/brands/brands';
import { AxiosError } from 'axios';
import { FaHome } from 'react-icons/fa';

interface Values {
    logo: File | null;
    name: string;
    brand_id: string;
    description: string;
}

const AddCategory = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [brandsData, setBrandsData] = useState([]);
    const navigate = useNavigate();

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
        formData.append('brand_id', values.brand_id);
        formData.append('description', values.description);

        if (images.length > 0 && images[0].file) {
            formData.append('logo', images[0].file);
        }
        try {
            const res = await api.post(ENDPOINTS.CATEGORIES, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast('success', res.data.message || 'Category created successfully!');
            navigate('/categories');
        } catch (err: any) {
            setErrors(err.response.data.errors);
        } finally {
            setSubmitting(false);
        }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
        brand_id: Yup.string().required('Please fill the Brand Name'),
    });

    useEffect(() => {
        dispatch(setPageTitle('Add Category'));
        handleGetBrands();
    }, []);

    return (
        <div>
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
                    <span>Add Category</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        {isLoading ? (
                            <div className="panel-overlay">Fetching Brands...</div>
                        ) : (
                            <div className="mb-5">
                                <Formik<Values>
                                    initialValues={
                                        {
                                            logo: null,
                                            brand_id: '',
                                            name: '',
                                            description: '',
                                        } as Values
                                    }
                                    validationSchema={SubmittedForm}
                                    onSubmit={submitForm}
                                >
                                    {({ errors, submitCount, touched, values, isSubmitting }) => (
                                        <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                            <div className="flex flex-col">
                                                <FileUploader classes="" images={images} setImages={setImages} />
                                                {errors.logo && <div className="text-red-500 text-sm mt-1">{`${errors.logo} (jpg, jpeg, png)`}</div>}
                                            </div>
                                            <div className="flex-1 flex flex-col space-y-5">
                                                <SearchableSelect id={'brand_id'} name="brand_id" label="Select Brand" options={brandsData} />
                                                <Input id="name" name="name" label="Category Name" type="text" />
                                                <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                                <Button text={isSubmitting ? 'Submitting...' : 'Add Category'} disabled={isSubmitting} />
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

export default AddCategory;
