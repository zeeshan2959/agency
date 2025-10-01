import { DataTable } from 'mantine-datatable';

interface CommonDataTableProps<T> {
  title?: string;
  data: T[];
  columns: any[];
  searchFields?: (keyof T)[];
  isLoading?: boolean;

  // ✅ Selection
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;

  // ✅ Server-side pagination
  pagination?: {
    page: number;
    perPage: number;
    total: number;
  };
  onPageChange?: (page: number, perPage: number) => void;

  // ✅ Search (server-side)
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

function CommonDataTable<T extends Record<string, any>>({
  title = 'Data Table',
  data,
  columns,
  searchFields = [],
  isLoading = false,
  selectedRecords = [],
  onSelectedRecordsChange,
  pagination,
  onPageChange,
  searchQuery = '',
  onSearchChange,
}: CommonDataTableProps<T>) {
  return (
    <div className="panel mt-6">
      <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
        <h5 className="font-semibold text-lg dark:text-white-light">{title}</h5>
        <div className="ltr:ml-auto rtl:mr-auto">
          {searchFields.length > 0 && (
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="datatables">
        <DataTable
          className="whitespace-nowrap table-hover"
          records={data}
          columns={columns}
          highlightOnHover
          minHeight={200}
          fetching={isLoading}
          // ✅ Server-side pagination
          totalRecords={pagination?.total || 0}
          recordsPerPage={pagination?.perPage || 10}
          page={pagination?.page || 1}
          onPageChange={(page) => onPageChange?.(page, pagination?.perPage || 10)}

          // ✅ Per-page dropdown
          recordsPerPageOptions={[10, 20, 30, 50, 100]}
          onRecordsPerPageChange={(perPage) => onPageChange?.(1, perPage)}

          // ✅ Selection
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={onSelectedRecordsChange}

          // ✅ Pagination text
          paginationText={({ from, to, totalRecords }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`
          }
        />
      </div>
    </div>
  );
}

export default CommonDataTable;
