// deleteMessage.ts
import Swal from 'sweetalert2';

export const deleteMessage = async (onConfirm: () => void) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-secondary',
      cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      popup: 'sweet-alerts',
    },
    buttonsStyling: false,
  });

  const result = await swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true,
    padding: '2em',
  });

  if (result.isConfirmed) {
    onConfirm();
    swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire('Cancelled', 'Your file is safe 🙂', 'error');
  }
};
