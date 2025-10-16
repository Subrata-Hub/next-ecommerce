import { createAction, original } from "@reduxjs/toolkit";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import { RestoreFromTrash } from "@mui/icons-material";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Row selection state

  const [rowSelection, setRowSelection] = useState({});
  // Export loading state
  const [exportLoading, setExportLoading] = useState(false);

  // Handle delete method
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);
  const handleDelete = (ids, deleteType) => {
    let c;
    if (deleteType === "PD") {
      c = confirm("Are you sure you want to delete data permantly?");
    } else {
      c = confirm("Are you sure you want to move data into trash?");
    }
    if (c) {
      // mutate is for running mutationFn
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };

  // Export method
  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "csv-data",
      });

      const sanitizeData = (data) =>
        data.map((item) =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => {
              if (Array.isArray(value)) return [key, value.join(", ")];
              if (typeof value === "object" && value !== null)
                return [key, JSON.stringify(value)];
              return [key, value];
            })
          )
        );

      let csv;
      if (Object.keys(rowSelection).length > 0) {
        // export only selected rows
        const rowData = selectedRows.map((row) => row.original);
        csv = generateCsv(csvConfig)(sanitizeData(rowData));
      } else {
        // export all data
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) {
          throw new Error(response.message);
        }
        csv = generateCsv(csvConfig)(sanitizeData(response.data));
      }
      download(csvConfig)(csv);
    } catch (error) {
      console.log(error);
      showToast("error", error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // Data fetching logic
  const {
    data: { data = [], meta } = {},
    isError,

    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.toString());
      return response;
    },
    placeholderData: keepPreviousData,
  });

  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && (
          <Tooltip title="Recyle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <Tooltip title="Restore Data">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected
              }
              onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
            >
              <RestoreFromTrashIcon />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <Tooltip title="Permanetly Delete Data">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          type="button"
          text={
            <>
              <SaveAltIcon fontSize="30" /> Export
            </>
          }
          loading={exportLoading}
          onclick={() => handleExport(table.getSelectedRowModel().rows)}
          className="cursor-pointer"
        />
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Datatable;
