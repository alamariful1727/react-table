import React, { ReactElement, PropsWithChildren, useCallback, useEffect } from 'react';
import { useTable, TableOptions, useSortBy, usePagination, HeaderProps, FilterProps, useFilters } from 'react-table';
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
  TextField,
  Button,
} from '@material-ui/core';
import { camelToWords } from './utils';
import { fuzzyTextFilter } from './filters/fuzzyFilter';
import { numericTextFilter } from './filters/numericFilter';

const rowsPerPageOptions = [3, 5, 10];

//? Filter functionalities
const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
};

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
);

function DefaultColumnFilter<T extends object>({
  column: { id, index, filterValue, setFilter, render, parent },
}: FilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '');

  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '');
  }, [filterValue]);

  const firstIndex = !(parent && parent.index);
  return (
    <TextField
      fullWidth
      name={id}
      label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}
      variant={'standard'}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    />
  );
}

const defaultColumn = {
  Filter: DefaultColumnFilter,
  // Cell: TooltipCell,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
};

interface ReactTableProps<T extends object = {}> extends TableOptions<T> {
  showPagination?: boolean;
  onRowSelect?: (data: T) => void;
}

export function ReactTable<T extends object>({
  data,
  columns,
  showPagination = true,
  onRowSelect,
}: PropsWithChildren<ReactTableProps<T>>): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    rows,
    state: { pageIndex, pageSize, filters },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    pageOptions,
    allColumns,
    setAllFilters,
  } = useTable<T>(
    {
      columns,
      filterTypes,
      defaultColumn,
      data,
      initialState: { pageIndex: 0, pageSize: rowsPerPageOptions[0] },
    },
    useFilters,
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

  const resetFilters = useCallback(() => {
    setAllFilters([]);
  }, [setAllFilters]);

  return (
    <div>
      <h2>Filters</h2>
      <div>
        {allColumns
          .filter((it) => {
            return it.canFilter;
          })
          .map((column) => {
            return <div key={column.id}>{column.render('Filter')}</div>;
          })}
      </div>
      {/* Reset filters */}
      {Object.keys(filters).length > 0 && (
        <Button color="primary" onClick={resetFilters}>
          Reset
        </Button>
      )}
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
                  <TableRow
                    {...row.getRowProps()}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onRowSelect && onRowSelect(row.values as T)}
                  >
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
      {showPagination && rows.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 12px' }}>
            <FormControlLabel
              control={<Switch color="primary" checked={dense} onChange={handleChangeDense} />}
              label="Dense table"
            />
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={rows.length}
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
        </>
      )}
    </div>
  );
}
