import React, { useState } from 'react';
import { FaBoxOpen, FaIndustry, FaRegCircleCheck } from 'react-icons/fa6';
import { MdOutlineCategory } from 'react-icons/md';
import { IoMdPricetag } from 'react-icons/io';
import { BiCategory } from 'react-icons/bi';
import { GiLevelEndFlag } from 'react-icons/gi';
import Modal from './Modal';
import ImageSlider from '../pages/products/ImageSlider';

type Brand = {
    id: number;
    name: string;
};

type Category = {
    id: number;
    name: string;
};

export type Product = {
    id: number;
    agency_id: number;
    brand_id: number;
    name: string;
    description?: string | null;
    status: string;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;

    // optional extra fields
    logo?: string | null;
    sku?: string | null;
    container_type?: string | null;
    size_ml?: number | null;
    reorder_level?: number | null;
    brand?: Brand | null;
    category?: Category | null;
    images?: string[];
};

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [modal, setModal] = useState(false);

    return (
        <div className="mt-4 rounded-2xl shadow-md border border-slate-200 bg-white hover:shadow-xl transition duration-300 overflow-hidden">
            {/* Content */}
            <div className="p-5">
                <div className="flex gap-6">
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.slice(0, 1).map((img, idx) => (
                                <img key={idx} src={`${import.meta.env.VITE_ASSET}${img}`} alt={`thumb-${idx}`} className="w-14 h-14 object-cover rounded-lg border" />
                            ))}
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">{product.name}</h2>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description ?? 'No description available'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                        <IoMdPricetag className="text-blue-500" />
                        <span className="font-medium">SKU:</span> {product.sku ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaBoxOpen className="text-emerald-500" />
                        <span className="font-medium">Container:</span> {product.container_type ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaIndustry className="text-purple-500" />
                        <span className="font-medium">Size:</span> {product.size_ml ? `${product.size_ml} ml` : 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                        {' '}
                        <MdOutlineCategory className="text-pink-500" /> <span className="font-medium">Product Brand:</span> {product.brand?.name ?? 'N/A'}{' '}
                    </div>
                    <div className="flex items-center gap-2">
                        <BiCategory className="text-pink-500" />
                        <span className="font-medium">Product Category:</span> {product.category?.name ?? 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegCircleCheck className={product.status === 'active' ? 'text-green-500' : 'text-red-500'} />
                        <span className="font-medium">Status:</span> {product.status}
                    </div>
                    <div className="flex items-center gap-2">
                        <GiLevelEndFlag className="text-orange-500" />
                        <span className="font-medium">Reorder Level:</span> {product.reorder_level ?? 'N/A'}
                    </div>
                </div>
            </div>
            {Array.isArray(product.images) && product.images.length > 0 && (
                <>
                    <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-between text-sm">
                        <p className="px-3 py-1 rounded-lg text-sm font-medium transition">Product Images</p>
                        <button className="btn btn-sm btn-success" onClick={()=>setModal(true)}>View Products Images</button>
                    </div>
                    <Modal modal={modal} setModal={setModal}>
                        <ImageSlider avatars={product?.images} />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ProductCard;
