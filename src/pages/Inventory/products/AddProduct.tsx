import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { ImageType } from 'react-images-uploading';
import api from '../../../api/axios';
import ENDPOINTS from '../../../api/endpoints';
import { Toast } from '../../../components/common/Toast';
import { SearchableSelect } from '../../../components/common/SearchableSelect';
import { getBrands } from '../../../api/services/brands/brands';
import { AxiosError } from 'axios';
import MultipleFileUploader from '../../../components/common/MultipleFIleUploader';

interface Values {
    images: File | [] | null;
    name: string;
    brand_id: string;
    category_id: string;
    size_ml: string;
    reorder_level: string;
    container_type: string;
    description: string;
}

const AddProduct = () => {
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
        formData.append('brand_id', values.brand_id);
        formData.append('category_id', values.category_id);
        formData.append('name', values.name);
        formData.append('size_ml', values.size_ml);
        formData.append('container_type', values.container_type);
        formData.append('description', values.description);
        if (images.length > 0) {
            images.forEach((img, index) => {
                if (img.file) {
                    formData.append('images[]', img.file);
                }
            });
        }

        try {
            const res = await api.post(ENDPOINTS.CATEGORIES, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast('success', res.data.message || 'Product created successfully!');
            navigate('/products');
        } catch (err: any) {
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Product Name'),
        brand_id: Yup.string().required('Please select a Brand'),
        images: Yup.mixed().test('fileRequired', 'Please upload at least one image', () => images.length > 0),
    });

    useEffect(() => {
        dispatch(setPageTitle('Add Category'));
        handleGetBrands();
    }, []);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/products" className="text-primary hover:underline">
                        Products
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Add Product</span>
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
                                            images: [],
                                            brand_id: '',
                                            category_id: '',
                                            size_ml: '',
                                            reorder_level: '',
                                            container_type: '',
                                            name: '',
                                            description: '',
                                        } as Values
                                    }
                                    validationSchema={SubmittedForm}
                                    onSubmit={submitForm}
                                >
                                    {({ errors, submitCount, touched, values, isSubmitting }) => (
                                        <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                            <div className="flex flex-col w-[34%]">
                                                <MultipleFileUploader images={images} setImages={setImages} />
                                                {submitCount > 0 && images.length === 0 && <div className="text-red-500 text-sm mt-1">Please upload at least one image (jpg, jpeg, png)</div>}
                                            </div>
                                            <div className="flex-1 flex flex-col space-y-5 w-[66%]">
                                                <SearchableSelect id={'brand_id'} name="brand_id" label="Select Brand" options={brandsData} />
                                                <Input id="category_id" name="category_id" label="Category Name" type="text" errors={errors} touched={touched} placeholder="Enter Category name" />
                                                <Input id="name" name="name" label="Product Name" type="text" errors={errors} touched={touched} />
                                                <SearchableSelect id={'container_type'} name="container_type" label="Select Container Type" options={brandsData} />
                                                <Input id="size_ml" name="size_ml" label="Size (ml)" type="text" errors={errors} touched={touched} placeholder="Enter size (ml)" />
                                                <Input id="reorder_level" name="reorder_level" label="Reorder Level" type="text" errors={errors} touched={touched} placeholder="Enter reorder level" />
                                                <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                                <Button text={isSubmitting ? 'Submitting...' : 'Add Product'} disabled={isSubmitting} />
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

export default AddProduct;
