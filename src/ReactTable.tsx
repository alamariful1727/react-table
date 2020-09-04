import React, { ReactElement, PropsWithChildren, useCallback } from 'react';
import { useTable, TableOptions, useSortBy, usePagination } from 'react-table';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableSortLabel,
  TablePagination,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

interface ReactTableProps<T extends object = {}> extends TableOptions<T> {}

const rowsPerPageOptions = [3, 5, 10];

export function ReactTable<T extends object>(props: PropsWithChildren<ReactTableProps<T>>): ReactElement {
  const { data, columns } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageCount,
    canNextPage,
    canPreviousPage,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: rowsPerPageOptions[0] },
    },
    useSortBy,
    usePagination,
  );

  const [dense, setDense] = React.useState(false);

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage();
      } else if (newPage === pageIndex - 1) {
        previousPage();
      } else {
        gotoPage(newPage);
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage],
  );

  const handleChangeRowsPerPage = useCallback(
    (e) => {
      setPageSize(Number(e.target.value));
      gotoPage(0);
    },
    [gotoPage, setPageSize],
  );

  const handleChangeDense = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDense(event.target.checked);
    },
    [setDense],
  );

  const emptyRows = page.length
    ? pageSize - Math.min(pageSize, data.length - pageIndex * pageSize)
    : pageSize - Math.min(pageSize, data.length - pageIndex * pageSize) - 1;

  return (
    <div>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2,
          )}
        </code>
      </pre>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <TableSortLabel active={column.isSorted} direction={column.isSortedDesc ? 'desc' : 'asc'}>
                        {column.render('Header')}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.length ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell align="right">No data</TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 12px' }}>
        <FormControlLabel
          control={<Switch color="primary" checked={dense} onChange={handleChangeDense} />}
          label="Dense table"
        />
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {rowsPerPageOptions.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
