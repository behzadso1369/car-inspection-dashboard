import React from 'react';
import Pagination from '@mui/material/Pagination';
import { Stack } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
interface PaginationProps extends React.PropsWithChildren {
page:number;
rowsPerPage:number;
setPage:any;
setRowsPerPage:any;
}


export const PaginationLib: React.FunctionComponent<PaginationProps> = ({page,setPage,setRowsPerPage,rowsPerPage}) => {



  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event)
    debugger
    setPage(value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  return (
    <div
      className="px-4 py-2 flex justify-between items-center"
      style={{ direction: 'ltr' }}
    >
      <Stack spacing={2}>
        <Pagination sx={{ color: '#B2E7FD' }} shape="rounded" count={10} onChange={handleChange} />
      </Stack>
      <TablePagination
        component="div"
        count={100}
        page={page}
      
        onPageChange={() =>{}}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={': تعداد سطر در هر صفحه'}
        SelectProps={{
          IconComponent: () => {
            return <FontAwesomeIcon className="mx-2" icon={faCaretDown} />;
          },
        }}
        sx={{
          '.MuiTablePagination-displayedRows': {
            color: '#1B263B',
            display: 'none',
          },
          '.MuiTablePagination-selectLabel': {
            color: '#1B263B',
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
          },
        }}
      />
    </div>
  );
};

export default PaginationLib;