import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import FileUploader from '../../components/common/FileUploader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ImageType } from 'react-images-uploading';

interface Values {
    name: string;
    description: string;
}

const AddCategory = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState<ImageType[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('AddCategory'));
    });
    const submitForm = async (values: Values, { setSubmitting, setErrors }: FormikHelpers<Values>) => {

        // try {
        //     const res = await fetch('YOUR_API_URL_HERE', {
        //         method: 'POST',
        //         body: formData,
        //     });

        //     const contentType = res.headers.get('content-type');
        //     let data: any = null;

        //     if (contentType && contentType.includes('application/json')) {
        //         data = await res.json();
        //     }

        //     if (res.ok) {
        //         console.log('Success:', data);
        //         // show success UI or navigate
        //     } else {
        //         console.error('Server returned error:', data);
        //         setErrors({ name: 'Server error occurred' });
        //     }
        // } catch (err) {
        //     console.error('Error uploading:', err);
        // } finally {
        //     setSubmitting(false);
        // }
    };

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Name'),
    });

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>AddCategory</span>
                </li>
            </ul>

            <div className="pt-5 space-y-8">
                <div className="">
                    <div className="panel">
                        <div className="mb-5">
                            <Formik
                                initialValues={{
                                    name: '',
                                    description: '',
                                }}
                                validationSchema={SubmittedForm}
                                onSubmit={submitForm}
                            >
                                {({ errors, submitCount, touched }) => (
                                    <Form className="flex flex-col sm:flex-row space-y-10 sm:space-y-0 sm:space-x-10">
                                        <div className="flex-1 flex flex-col space-y-5">
                                            <Input id="name" name="name" placeholder="Enter category name" label="Category Name" type="text" errors={errors} touched={touched} />
                                            <Input id="description" name="description" label="Description" type="text" as="textarea" />
                                            <Button text="Add Category" />
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

export default AddCategory;
