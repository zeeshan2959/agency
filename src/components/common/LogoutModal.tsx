import { signOutUser, signOutUserFromAllDevices } from '../../api/services/auth/auth';
import { Toast } from './Toast';
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
    setOpenLogoutModal: Dispatch<SetStateAction<boolean>>;
};

const LogoutModal = ({ setOpenLogoutModal }: ModalProps) => {
    const [loading, setLoading] = useState({ single: false, all: false });

    const handleLogout = async () => {
        setLoading((prev) => ({ ...prev, single: true }));
        try {
            const res = await signOutUser();
            if (res.status === 200) {
                Toast('success', res.data.message || 'Logout successful!');
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(';').forEach((c) => {
                    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                });
                setLoading((prev) => ({ ...prev, single: false }));
                setOpenLogoutModal(false);
                setTimeout(() => (window.location.href = '/login'), 1000);
            }
        } catch (err) {
            setLoading((prev) => ({ ...prev, single: false }));
            const axiosError = err as AxiosError<any>;
            if (axiosError.response) {
                Toast('danger', axiosError.response.data.message || 'Something went wrong!');
            } else if (axiosError.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', axiosError.message || 'Unexpected error occurred.');
            }
        }
    };
    const handleLogoutAll = async () => {
        setLoading((prev) => ({ ...prev, all: true }));
        try {
            const res = await signOutUserFromAllDevices();
            if (res.status === 200) {
                Toast('success', res.data.message || 'Logout from all devices!');
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(';').forEach((c) => {
                    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                });
                setLoading((prev) => ({ ...prev, all: false }));
                setOpenLogoutModal(false);
                setTimeout(() => (window.location.href = '/login'), 1000);
            }
        } catch (err) {
            setLoading((prev) => ({ ...prev, all: true }));
            const axiosError = err as AxiosError<any>;
            if (axiosError.response) {
                Toast('danger', axiosError.response.data.message || 'Something went wrong!');
            } else if (axiosError.request) {
                Toast('danger', 'No response from server. Please try again.');
            } else {
                Toast('danger', axiosError.message || 'Unexpected error occurred.');
            }
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-[90%] max-w-xl text-center transform scale-100 transition-all duration-200">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Log Out?</h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8">Are you sure you want to sign out of your account? You’ll need to log in again to access your dashboard.</p>

                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleLogout}
                        disabled={loading.single}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 focus:ring-4 focus:ring-red-400/40"
                    >
                        {loading.single ? 'Logging out...' : 'Yes, Logout'}
                    </button>

                    <button
                        onClick={handleLogoutAll}
                        disabled={loading.all}
                        className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium rounded-lg shadow-sm transition-all duration-200 border border-red-400/40"
                    >
                        {loading.all ? 'Logging out...' : 'Logout All Devices'}
                    </button>

                    <button
                        onClick={() => setOpenLogoutModal(false)}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
