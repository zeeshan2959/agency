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
import { containerTypes } from '../../../constants';
import { getProductById } from '../../../api/services/products';
import { FaHome } from 'react-icons/fa';
import { capitalize } from 'lodash';

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

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [brandsData, setBrandsData] = useState<any[]>([]);
    const [productsData, setProductsData] = useState<any>({});
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const navigate = useNavigate();

    const productId = localStorage.getItem('selectedProduct');

    const handleGetBrands = async () => {
        setIsLoading(true);
        try {
            const res = await getBrands();
            if (res.status === 200) {
                setBrandsData(
                    res.data.data.data.map((item: any) => {
                        return {
                            value: item.id.toString(),
                            label: capitalize(item.name),
                            categories: (item.categories || []).map((cat: any) => ({
                                value: cat.id.toString(),
                                label: capitalize(cat.name),
                            })),
                        };
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

    const handleGetProduct = async () => {
        setIsLoading(true);
        try {
            const res = await getProductById(productId);
            if (res.status === 200) {
                const data = res.data.data;
                setProductsData(data);

                if (Array.isArray(data?.images)) {
                    setImages(
                        data.images.map((img: string) => ({
                            dataURL: `${import.meta.env.VITE_ASSET}${img}`,
                        })) as ImageType[]
                    );
                } else if (data?.images) {
                    setImages([
                        {
                            dataURL: `${import.meta.env.VITE_ASSET}${data.images}`,
                        } as ImageType,
                    ]);
                }
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
        formData.append('reorder_level', values.reorder_level ||'0');
        formData.append('container_type', values.container_type);
        formData.append('description', values.description || '');
        if (images.length > 0) {
            images.forEach((img) => {
                if (img.file) {
                    // new uploaded file
                    formData.append('images[]', img.file);
                } else if (img.dataURL && typeof img.dataURL === 'string') {
                    // already existing image
                    const relativePath = img.dataURL.replace(import.meta.env.VITE_ASSET, '');
                    formData.append('keep_images[]', relativePath);
                }
            });
        }

        try {
            const res = await api.post(`${ENDPOINTS.PRODUCTS}/${productId}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Toast('success', res.data.message || 'Product updated successfully!');
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
        category_id: Yup.string().required('Please select a Category'),
        size_ml: Yup.string().required('Please add size'),
        container_type: Yup.string().required('Please add container type'),
    });

    useEffect(() => {
        dispatch(setPageTitle('Update Product'));
        handleGetBrands();
        handleGetProduct();
    }, []);

    useEffect(() => {
        if (productsData?.brand?.id && brandsData.length > 0) {
            const brand = brandsData.find((b) => b.value === productsData.brand.id.toString());
            if (brand) {
                setCategoriesData(brand.categories);
            }
        }
    }, [brandsData, productsData]);

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
                    <span>Update Product</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{productsData?.name}</span>
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
                                    initialValues={{
                                        images: [],
                                        brand_id: productsData?.brand?.id?.toString() || '',
                                        category_id: productsData?.category?.id?.toString() || '',
                                        name: productsData?.name || '',
                                        container_type: productsData?.container_type || '',
                                        size_ml: productsData?.size_ml || '',
                                        reorder_level: productsData?.reorder_level || '',
                                        description: productsData?.description || '',
                                    }}
                                    validationSchema={SubmittedForm}
                                    onSubmit={submitForm}
                                    enableReinitialize={true}
                                >
                                    {({ errors, submitCount, touched, values, isSubmitting, setFieldValue }) => (
                                        <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                            <div className="flex flex-col w-[34%]">
                                                <MultipleFileUploader
                                                    images={images}
                                                    setImages={(imgs: any) => {
                                                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                                                        const invalidFile = imgs.find((img: any) => img.file && !allowedTypes.includes(img.file.type));
                                                        if (invalidFile) {
                                                            Toast('danger', 'Only JPG, JPEG, PNG files are allowed. SVG and PDF are not supported.');
                                                            return;
                                                        }

                                                        setImages(imgs);
                                                        setFieldValue('images', imgs);
                                                    }}
                                                />
                                                {submitCount > 0 && images.length === 0 && <div className="text-red-500 text-sm mt-1">Please upload at least one image (jpg, jpeg, png)</div>}
                                            </div>

                                            <div className="flex-1 flex flex-col space-y-5 w-[66%]">
                                                <SearchableSelect
                                                    id="brand_id"
                                                    name="brand_id"
                                                    label="Select Brand"
                                                    options={brandsData}
                                                    onChange={(option: any) => {
                                                        setFieldValue('brand_id', option?.value || '');
                                                        setCategoriesData(option?.categories || []);
                                                        setFieldValue('category_id', '');
                                                    }}
                                                    errors={errors as Record<string, string>}
                                                    touched={touched}
                                                />
                                                <SearchableSelect
                                                    id="category_id"
                                                    name="category_id"
                                                    label="Select Category"
                                                    options={categoriesData}
                                                    onChange={(option: any) => setFieldValue('category_id', option?.value || '')}
                                                    errors={errors as Record<string, string>}
                                                    touched={touched}
                                                />
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    label="Product Name"
                                                    type="text"
                                                    value={values.name}
                                                    onChange={(e) => setFieldValue('name', e.target.value)}
                                                    errors={errors as Record<string, string>}
                                                    touched={touched}
                                                />
                                                <SearchableSelect
                                                    id="container_type"
                                                    name="container_type"
                                                    label="Select Container Type"
                                                    options={containerTypes}
                                                    onChange={(option: any) => setFieldValue('container_type', option?.value || '')}
                                                    errors={errors as Record<string, string>}
                                                    touched={touched}
                                                />
                                                <Input
                                                    id="size_ml"
                                                    name="size_ml"
                                                    label="Size (ml)"
                                                    type="number"
                                                    placeholder="Enter size (ml)"
                                                    value={values.size_ml}
                                                    onChange={(e) => setFieldValue('size_ml', e.target.value)}
                                                    errors={errors as Record<string, string>}
                                                    touched={touched}
                                                />
                                                <Input
                                                    id="reorder_level"
                                                    name="reorder_level"
                                                    label="Reorder Level"
                                                    type="number"
                                                    placeholder="Enter reorder level"
                                                    value={values.reorder_level}
                                                    onChange={(e) => setFieldValue('reorder_level', e.target.value)}
                                                />
                                                <Input
                                                    id="description"
                                                    name="description"
                                                    label="Description"
                                                    type="text"
                                                    value={values.description || ''}
                                                    onChange={(e) => setFieldValue('description', e.target.value)}
                                                    as="textarea"
                                                />
                                                <Button text={isSubmitting ? 'Updating...' : 'Update Product'} disabled={isSubmitting} />
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

export default UpdateProduct;
