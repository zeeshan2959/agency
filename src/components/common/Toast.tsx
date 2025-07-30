import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export const Toast = (color: any, text: string) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`,
            },
        });
        toast.fire({
            title: text || 'Signup successful!',
        });
    };
