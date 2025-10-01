import { useEffect } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';

type Props = {
    classes: string;
    images: ImageListType;
    setImages: React.Dispatch<React.SetStateAction<ImageListType>>;
};

const FileUploader = ({ classes, images, setImages }: Props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('File Upload Preview'));
    }, [dispatch]);

    const maxNumber = 5;

    const onChange = (imageList: ImageListType) => {
        setImages(imageList);
    };

    return (
        <div className={classes}>
            <label htmlFor="">Logo</label>
            <div className="panel" id="single_file">
                <div className="mb-5">
                    <div className="custom-file-container" data-upload-id="myFirstImage">
                        <div className="label-container">
                            <button
                                type="button"
                                className="custom-file-container__image-clear absolute right-0 mb-4"
                                title="Clear Image"
                                onClick={() => setImages([])}
                            >
                                ×
                            </button>
                        </div>

                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />

                        <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
                            {({ imageList, onImageUpload, dragProps }) => (
                                <div
                                    className="upload__image-wrapper cursor-pointer h-32 w-[300px]"
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    {imageList.length === 0 ? (
                                        <>
                                            <img
                                                src="/assets/images/upload.svg"
                                                className="h-full max-w-md w-full m-auto hover:opacity-80 transition"
                                                alt="Click to upload"
                                            />
                                            <div className="text-center justify-center -ml-4">Upload logo</div>
                                        </>
                                    ) : (
                                        imageList.map((image, index) => (
                                            <div
                                                key={index}
                                                className="custom-file-container__image-preview relative h-36 w-[300px]"
                                            >
                                                <img
                                                    src={image.dataURL}
                                                    alt="uploaded"
                                                    className="m-auto h-32 object-contain"
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </ImageUploading>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
