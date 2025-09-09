import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

interface CommonDataTableProps<T> {
  title?: string;
  data: T[];
  columns: any[];
  searchFields?: (keyof T)[];
  defaultPageSize?: number;
  pageSizes?: number[];
  isLoading?: boolean;

  // ✅ Add these two
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
}

function CommonDataTable<T extends Record<string, any>>({
  title = 'Data Table',
  data,
  columns,
  searchFields = [],
  defaultPageSize = 10,
  pageSizes = [10, 20, 30, 50, 100],
  isLoading = false,
  selectedRecords = [],
  onSelectedRecordsChange,
}: CommonDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [initialRecords, setInitialRecords] = useState(sortBy(data, 'id'));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  // Reset page on page size change
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // Paginate records
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  // Search logic
  useEffect(() => {
    if (searchFields.length === 0) {
      setInitialRecords(sortBy(data, 'id'));
      return;
    }
    setInitialRecords(() =>
      data.filter((item) =>
        searchFields.some((field) =>
          item[field]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }, [search, data, searchFields]);

  // Sorting
  useEffect(() => {
    const sorted = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === 'desc' ? sorted.reverse() : sorted);
  }, [sortStatus]);

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="datatables">
        <DataTable
          className="whitespace-nowrap table-hover"
          records={recordsData}
          columns={columns}
          highlightOnHover
          totalRecords={initialRecords.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={setPage}
          recordsPerPageOptions={pageSizes}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          // ✅ Mantine built-in selection
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={onSelectedRecordsChange}
          minHeight={200}
          fetching={isLoading}
          paginationText={({ from, to, totalRecords }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`
          }
        />
      </div>
    </div>
  );
}

export default CommonDataTable;
