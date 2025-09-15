
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconX from '../../components/Icon/IconX';

import { Dispatch, SetStateAction } from 'react';

interface MultipleFileUploaderProps {
    images: ImageListType;
    setImages: Dispatch<SetStateAction<ImageListType>>;
}

const MultipleFileUploader = ({ images, setImages }: MultipleFileUploaderProps) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('File Upload Preview'));
    });


    const maxNumber = 69;

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    return (
        <div className="multiple-file-upload panel">
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">Multiple File</h5>
            </div>
            <div className="mb-5">
                <div className="custom-file-container" data-upload-id="mySecondImage">
                    <div className="label-container">
                        <label>Upload </label>
                        <button
                            type="button"
                            className="custom-file-container__image-clear"
                            title="Clear Image"
                            onClick={() => {
                                setImages([]);
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <label className="custom-file-container__custom-file"></label>
                    <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                    <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
                        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                            <div className="upload__image-wrapper">
                                <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                                    Choose File...
                                </button>
                                &nbsp;
                                <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="custom-file-container__image-preview relative">
                                            <button
                                                type="button"
                                                className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                                                title="Clear Image"
                                                onClick={() => onImageRemove(index)}
                                            >
                                                <IconX className="w-3 h-3" />
                                            </button>
                                            <img src={image.dataURL} alt="img" className="object-cover shadow rounded w-full !max-h-48" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ImageUploading>
                    {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                </div>
            </div>
        </div>
    );
};

export default MultipleFileUploader;
