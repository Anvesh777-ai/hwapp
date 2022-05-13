import React from 'react'
import styled from 'styled-components'
import { useTable, useRowSelect } from 'react-table'

import getTableData from './data'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid #D3D3D3;
    box-shadow: 2px 2px 3px #E5E4E2;
    border-radius: 5px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    .rowSelected {
      background: #E5E4E2;
    }

    th,
    td {
      margin: 10rem 0;
      padding: 1rem;
      border-bottom: 1px solid lightgrey;

      :last-child {
        border-right: 0;
      }
    }
    
    tbody {
      tr:hover {
        background: #F3EFEE;
        cursor: pointer;
      }
    }
  }
`

const handleSelected = function (e, selectedRows) {
  e.preventDefault();
  let array = [];
  if (selectedRows.length === 0) {
    alert ('None Selected');
  } else {
    selectedRows.forEach(val => {
      if (val.values.status === 'Available'){
          array.push({'Device': val.values.device, 'path': val.values.path} );
      }
    });
    alert(
        'These are the items available for download\n\n'
        + JSON.stringify(array) + '\n\n'
    );
  }
}

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
          <>
            <input type="checkbox" ref={resolvedRef} {...rest} />
          </>
      )
    }
)

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
      {
        columns,
        data,
      },
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
                <div>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
                <div>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
            ),
          },
          ...columns,
        ])
      }
  )

  // Render the UI for your table
  return (
      <>
        <p>
          <span>Selected Rows: {Object.keys(selectedRowIds).length}</span>
          <span style={{ cursor: 'pointer', marginLeft: '20px'}} onClick={e => handleSelected(e, selectedFlatRows)}><i className='fa fa-download'></i> Download</span>
        </p>
          <table {...getTableProps()}>
          <thead>
          {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row, i) => {
            prepareRow(row);
            console.log(row);
            return (
                <tr {...row.getRowProps()} className={row.isSelected ? 'rowSelected' : ''}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
            )
          })}
          </tbody>
        </table>
        {/*<pre>*/}
        {/*<code>*/}
          {/*{JSON.stringify(*/}
              {/*{*/}
                {/*selectedRowIds: selectedRowIds,*/}
                {/*'selectedFlatRows[].original': selectedFlatRows.map(*/}
                    {/*d => d.original*/}
                {/*),*/}
              {/*},*/}
              {/*null,*/}
              {/*2*/}
          {/*)}*/}
        {/*</code>*/}
      {/*</pre>*/}
      </>
  )
}

function App() {
  const columns = React.useMemo(
      () => [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Device',
            accessor: 'device',
          },
          {
            Header: 'Path',
            accessor: 'path',
          },
          {
            Header: 'Status',
            accessor: 'status',
            Cell: (props) => {
                  if(props.value === 'Available') {
                   return (<div>
                      <span style={{
                        marginLeft: '-15px',
                        marginRight: '5px',
                        height: '10px',
                        width: '10px',
                        backgroundColor: 'lightgreen',
                        borderRadius: '50%',
                        display: 'inline-block'}}></span>
                      <span>
                        {props.value}
                      </span>
                    </div>)

                  } else {
                    return (<span> {props.value}</span>)
                  }
            }
          }
      ],
      []
  )

  const data = React.useMemo(() => getTableData(), [])

  return (
      <Styles>
        <Table columns={columns} data={data} />
      </Styles>
  )
}

export default App
