import React from 'react';
import Pagination from '@mui/material/Pagination';
import { Stack } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps extends React.PropsWithChildren {
  page: number;
  rowsPerPage: number;
  setPage: any;
  setRowsPerPage: any;
  count: number;
}

export const PaginationLib: React.FunctionComponent<PaginationProps> = ({
  page,
  setPage,
  setRowsPerPage,
  rowsPerPage,
  count,
}) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const pageCount = Math.max(1, Math.ceil(count / rowsPerPage) || 1);

  return (
    <div
      className="px-3 sm:px-4 py-2 flex flex-row flex-wrap justify-between items-center gap-2 min-h-[56px]"
      style={{ direction: 'ltr' }}
    >
      <Stack spacing={1} className="w-full sm:w-auto overflow-x-auto">
        <Pagination
          sx={{
            '& .MuiPaginationItem-root': {
              minWidth: 36,
              height: 36,
              fontSize: '0.85rem',
            },
            '& .Mui-selected': {
              backgroundColor: '#0237fe !important',
              color: '#fff !important',
            },
            '& .MuiPaginationItem-root:hover': {
              backgroundColor: 'rgba(2, 55, 254, 0.08)',
            },
          }}
          shape="rounded"
          size="medium"
          siblingCount={0}
          boundaryCount={1}
          page={page}
          count={pageCount}
          onChange={handleChange}
        />
      </Stack>
      <TablePagination
        component="div"
        count={Number(count)}
        page={Math.max(0, page - 1)}
        onPageChange={() => {}}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 100]}
        labelRowsPerPage="تعداد در صفحه"
        SelectProps={{
          IconComponent: () => {
            return <FontAwesomeIcon className="mx-2" icon={faCaretDown} />;
          },
        }}
        sx={{
          '.MuiTablePagination-toolbar': {
            minHeight: 44,
            paddingLeft: 0,
            paddingRight: 0,
            flexWrap: 'wrap',
            justifyContent: 'center',
          },
          '.MuiTablePagination-displayedRows': {
            color: '#1B263B',
            display: 'none',
          },
          '.MuiTablePagination-selectLabel': {
            color: '#1B263B',
            fontSize: '0.75rem',
            margin: 0,
          },
          '.MuiTablePagination-actions': {
            display: 'none',
          },
          '.MuiToolbar-gutters': {
            display: 'flex',
            flexDirection: 'row-reverse',
          },
          '.MuiTablePagination-input': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row-reverse',
            marginRight: 0,
            marginLeft: 8,
          },
        }}
      />
    </div>
  );
};

export default PaginationLib;
