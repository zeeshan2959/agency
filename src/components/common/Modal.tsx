import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';

interface ModalProps {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ modal, setModal, children }) => {
    return (
        <div>
            <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                <div id="slider_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/10">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <DialogPanel className="animate__animated animate__fadeIn panel my-8 w-full max-w-xl overflow-hidden rounded-lg border-0 py-1 px-4">
                            <div className="flex items-center justify-between py-5 text-lg font-semibold dark:text-white">
                                <span></span>
                                <button onClick={() => setModal(false)} type="button" className="text-white-dark hover:text-dark">
                                    <IconX className="w-5 h-5" />
                                </button>
                            </div>
                            {children}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Modal;
