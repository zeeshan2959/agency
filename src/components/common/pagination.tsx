import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  perPage,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / perPage);

  // Generate page numbers (basic version: all pages)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8">
      <div className="flex justify-center items-end flex-col w-full">
        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
          {/* First */}
          <li>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(1)}
              className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
            >
              <MdOutlineKeyboardDoubleArrowLeft className="h-5 w-5" />
            </button>
          </li>

          {/* Prev */}
          <li>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
            >
              <MdKeyboardArrowLeft className="h-5 w-5" />
            </button>
          </li>

          {/* Page numbers */}
          {pages.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition
                  ${
                    p === page
                      ? "bg-primary text-white dark:bg-primary"
                      : "bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                  }`}
              >
                {p}
              </button>
            </li>
          ))}

          {/* Next */}
          <li>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
            >
              <MdKeyboardArrowRight className="h-5 w-5" />
            </button>
          </li>

          {/* Last */}
          <li>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => onPageChange(totalPages)}
              className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50 dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
            >
              <MdOutlineKeyboardDoubleArrowRight className="h-5 w-5" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
