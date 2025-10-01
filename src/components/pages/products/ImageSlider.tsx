
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import IconCaretDown from '../../../components/Icon/IconCaretDown';

interface ModalProps {
    avatars: string[];
}

const ImageSlider : React.FC<ModalProps> = ({ avatars }) => {

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
                nextEl: '.swiper-button-next1',
                prevEl: '.swiper-button-prev1',
            }}
            pagination={{ clickable: true }}
            className="swiper mx-auto mb-5 max-w-3xl"
            id="slider1"
            dir={themeConfig.rtlClass}
            key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
        >
            <div className="swiper-wrapper">
                {avatars?.map((item, i) => (
                    <SwiperSlide key={i}>
                        <img src={`${import.meta.env.VITE_ASSET}${item}`} className="max-h-80 w-full object-cover" alt="img" />
                    </SwiperSlide>
                ))}
            </div>
            <button
                type="button"
                className="swiper-button-prev1 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1  text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:left-2 rtl:right-2"
            >
                <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
            </button>
            <button
                type="button"
                className="swiper-button-next1 absolute top-1/2 z-[999] grid -translate-y-1/2 place-content-center rounded-full border border-primary p-1 text-primary transition hover:border-primary hover:bg-primary hover:text-white ltr:right-2 rtl:left-2"
            >
                <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
            </button>
            <div className="swiper-pagination"></div>
        </Swiper>
    );
};

export default ImageSlider;
