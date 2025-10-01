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
import { FaHome } from 'react-icons/fa';

interface Values {
    logo: File | null;
    name: string;
    description: string;
}

const AddBrand = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Add Brand'));
    });
    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);

        if (images.length > 0 && images[0].file) {
            formData.append('logo', images[0].file);
        }
        try {
            const res = await api.post(ENDPOINTS.BRANDS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast('success', res.data.message || 'Brand created successfully!');
            navigate('/brands');
        } catch (err: any) {
            setErrors(err.response.data.errors);
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
                    <span>Add brand</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        <div className="mb-5">
                            <Formik<Values>
                                initialValues={
                                    {
                                        logo: null,
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
                                            <Input id="name" name="name" label="Name" type="text" errors={errors} touched={touched} />
                                            <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                            <Button text={isSubmitting ? 'Submitting...' : 'Add Brand'} disabled={isSubmitting} />
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

export default AddBrand;
