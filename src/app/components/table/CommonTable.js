import { forwardRef, useRef, useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import clsx from "clsx";
import CommonTablePaginationActions from "./CommonTablePaginationActions";
import CommonHeader from "./CommonHeader";
import Input from "@material-ui/core/Input";
import { useResizeDetector } from 'react-resize-detector';

import './index.css'
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <Checkbox ref={resolvedRef} {...rest} />
    </>
  );
});

const CommonTable = ({ columns, data, onRowClick, onAdd, icon, newText, onBack, headerTitle, underHeader, updateValues }) => {
  const [dataTable, setDataTable] = useState(data);
  const [filters, setFilters] = useState([])
  const { width, height, ref } = useResizeDetector();

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: dataTable,
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((_columns) => [
        {
          id: "selection",
          sortable: false,
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              {/*
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                onClick={(ev) => ev.stopPropagation()}
              />
         */}
            </div>
          ),
        },
        ..._columns,
      ]);
    }
  );
  useEffect(() => {
    data.map(d => {
      Object.keys(d).forEach((item) => {
        if (d[item] == "undefined") {
          d[item] = ''
        }
      })
    })
    console.log('entrou aqui')
    setDataTable(data)
  }, [data])

  useEffect(() => {
    if (updateValues) {
      updateValues(dataTable)
    }
  }, [dataTable])

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  const filteringData = (text) => {
    const newData = data.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(text.toLowerCase())
    );
    setDataTable(newData);
  };

  const filterColumn = (column, text) => {
    filters[column] = text
    setFilters(filters)

    const newData = data.filter(function (element) {
      return Object.keys(filters).every(filter => {
        return element[filter] && element[filter].toString().toLowerCase().includes(filters[filter] && filters[filter].toLowerCase())
      })
    })

    setDataTable(newData)
  }
  return (
    <div ref={ref}>

      <CommonHeader
        title={headerTitle}
        filterData={filteringData}
        onAdd={onAdd}
        search={true}
        icon={icon}
        newText={newText}
        isList={true}
        onBack={onBack}
        width={width}
      />

      <div className="flex flex-col min-h-full sm:border-1 sm:rounded-16 overflow-hidden table">
        {underHeader ? underHeader : null}
        <TableContainer className="flex flex-1">
          <Table
            {...getTableProps()}
            stickyHeader
            className="simple borderless"
          >
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <td>
                      <TableCell
                        className="whitespace-nowrap p-4 md:p-12"
                        {...(!column.sortable
                          ? column.getHeaderProps()
                          : column.getHeaderProps(column.getSortByToggleProps()))}
                        style={{ fontSize: 18, fontWeight: 'bold' }}
                      >
                        {column.render("Header")}
                        {column.sortable ? (
                          <TableSortLabel
                            active={column.isSorted}
                            // react-table has a unsorted state which is not treated here
                            direction={column.isSortedDesc ? "desc" : "asc"}
                          />
                        ) : null}
                      </TableCell>
                      {!['selection', 'action'].includes(column.id) && column.noSearchable != true? (
                        <Input
                          placeholder="Buscar"
                          className="flex flex-1 px-16 searchColumn"
                          disableUnderline
                          fullWidth
                          //  value={searchText}
                          inputProps={{
                            "aria-label": "Search",
                          }}
                          onChange={(evt) => filterColumn(column.id, evt.target.value)}
                        />
                      ) : null}
                    </td>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <TableRow
                    {...row.getRowProps()}
                    onClick={(ev) => onRowClick(ev, row)}
                    className="truncate cursor-pointer"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          className={clsx("p-4 md:p-12", cell.column.className)}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          classes={{
            root: "flex-shrink-0 border-t-1",
          }}
          rowsPerPageOptions={[
            5,
            10,
            25,
            { label: "Todos", value: data.length + 1 },
          ]}
          colSpan={5}
          count={data.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "Itens por p??gina" },
            native: false,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={CommonTablePaginationActions}
        />
      </div>
    </div>
  );
};

CommonTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
};

export default CommonTable;
