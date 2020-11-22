import React from 'react';
import { ReactTable } from './ReactTable';
import { Column } from 'react-table';
interface IReactTable {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  grade: number;
}

const App = () => {
  const columns: Column<IReactTable>[] = [
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Gender',
      accessor: 'gender',
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
