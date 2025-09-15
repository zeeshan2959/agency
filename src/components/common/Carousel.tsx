import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import IconBell from '../../components/Icon/IconBell';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';

const Carousel = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Carousel'));
    });
    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [tabs, setTabs] = useState<string[]>([]);
    const toggleCode = (name: string) => {
        if (tabs.includes(name)) {
            setTabs((value) => value.filter((d) => d !== name));
        } else {
            setTabs([...tabs, name]);
        }
    };

    return (
        <div>
            <div className="pt-5 space-y-8">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Basic</h5>
                        </div>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation={{ nextEl: '.swiper-button-next-ex1', prevEl: '.swiper-button-prev-ex1' }}
                            pagination={{ clickable: true }}
                            className="swiper max-w-3xl mx-auto mb-5"
                            id="slider1"
                            dir={themeConfig.rtlClass}
                            key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
                        >
                            <div className="swiper-wrapper">
                                {items.map((item, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <img src={`/assets/images/${item}`} className="w-full max-h-80 object-cover" alt="itemImage" />
                                        </SwiperSlide>
                                    );
                                })}
                            </div>
                            <button className="swiper-button-prev-ex1 grid place-content-center ltr:left-2 rtl:right-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
                                <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
                            </button>
                            <button className="swiper-button-next-ex1 grid place-content-center ltr:right-2 rtl:left-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
                                <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
                            </button>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
