"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import DatatableWrapper from "@/components/application/admin/DatatableWrapper";
import DeleteAction from "@/components/application/admin/DeleteAction";
import EditAction from "@/components/application/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASBOARD,
  ADMIN_TRASH,
} from "@/routes/AddminPanelRoutes";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { FiPause, FiPlus } from "react-icons/fi";

const breadCrumbData = [
  {
    href: ADMIN_DASBOARD,
    label: "Home",
  },
  {
    href: ADMIN_TRASH,
    label: "Trash",
  },
];

const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
};

const Trash = () => {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof");

  const config = TRASH_CONFIG[trashOf];
  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-4 px-3 border-b [.border-b:pb-2]">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config.title}</h4>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Trash;
