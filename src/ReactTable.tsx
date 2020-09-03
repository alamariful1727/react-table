import React, { ReactElement, PropsWithChildren } from 'react'
import { useTable, TableOptions } from 'react-table'
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@material-ui/core';

interface Table<T extends object = {}> extends TableOptions<T> {
}

export function ReactTable<T extends object>(props: PropsWithChildren<Table<T>>): ReactElement {
  const { data, columns } = props
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    data,
    columns
  });
  
  return (
    <div>
      <TableContainer>
        <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </TableContainer>
    </div>
  )
}
