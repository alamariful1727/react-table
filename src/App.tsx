import React, { useMemo } from 'react';
import { CellProps, Column, FilterProps } from 'react-table';
import { MenuItem, TextField } from '@material-ui/core';
import { ReactTable } from './react-table';

interface IReactTable {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'F' | 'M';
  grade: number;
}

const SelectColumnFilter = ({
  column: { filterValue, render, setFilter, preFilteredRows, id },
}: FilterProps<IReactTable>) => {
  const options = useMemo(() => {
    const options = new Set<any>();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...Array.from(options.values())];
  }, [id, preFilteredRows]);

  return (
    <TextField
      fullWidth
      select
      label={render('Header')}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <MenuItem value={''}>All</MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

const App = () => {
  const columns: Column<IReactTable>[] = [
    {
      Header: 'First Name',
      accessor: 'firstName',
      aggregate: 'count',
      Aggregated: ({ cell: { value } }: CellProps<IReactTable>) => `${value} Names`,
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
      aggregate: 'uniqueCount',
      filter: 'fuzzyText',
      Aggregated: ({ cell: { value } }: CellProps<IReactTable>) => `${value} Unique Names`,
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Gender',
      accessor: 'gender',
      Filter: SelectColumnFilter,
      filter: 'includes',
    },
    {
      Header: 'Grade',
      accessor: 'grade',
    },
  ];

  const data: IReactTable[] = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      age: 9,
      gender: 'F',
      grade: 4,
    },
    {
      firstName: 'Mike',
      lastName: 'Ford',
      age: 5,
      gender: 'M',
      grade: 1,
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      age: 8,
      gender: 'M',
      grade: 4,
    },
    {
      firstName: 'Joe',
      lastName: 'Johnson',
      age: 11,
      gender: 'M',
      grade: 6,
    },
    {
      firstName: 'Linda',
      lastName: 'Ford',
      age: 8,
      gender: 'F',
      grade: 5,
    },
    {
      firstName: 'Noah',
      lastName: 'Wilson',
      age: 9,
      gender: 'M',
      grade: 3,
    },
    {
      firstName: 'Emma',
      lastName: 'Lee',
      age: 7,
      gender: 'F',
      grade: 3,
    },
    {
      firstName: 'James',
      lastName: 'Jones',
      age: 10,
      gender: 'M',
      grade: 5,
    },
    {
      firstName: 'Mia',
      lastName: 'Brown',
      age: 8,
      gender: 'F',
      grade: 5,
    },
    {
      firstName: 'William',
      lastName: 'Davis',
      age: 11,
      gender: 'M',
      grade: 6,
    },
  ];

  const onRowSelect = (data: IReactTable) => {
    console.log('onRowSelect data', data);
  };

  return (
    <div>
      <h1>React - Table</h1>
      <div>
        <ReactTable<IReactTable> data={data} columns={columns} onRowSelect={onRowSelect} />
      </div>
    </div>
  );
};

export default App;
