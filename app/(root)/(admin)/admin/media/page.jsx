"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import Media from "@/components/application/admin/Media";
import UploadMedia from "@/components/application/admin/UploadMedia";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ADMIN_DASBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AddminPanelRoutes";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const breadcrumbData = [
  { href: ADMIN_DASBOARD, label: "Home" },
  { href: "", label: "Media" },
];

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const trashof = searchParams.get("trashof");
      setSelectedMedia([]);
      if (trashof) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);

  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&limit=10&deleteType=${deleteType}`
    );
    console.log(response);
    return response;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasmore ? nextPage : undefined;
    },
  });

  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  const handleDelete = (ids, deleteType) => {
    let c = true;
    if (deleteType === "PD") {
      c = confirm("Are you sure you want to delete data permantly?");
    }
    if (c) {
      // mutate is for running mutationFn
      deleteMutation.mutate({ ids, deleteType });
    }

    setSelectAll(false);
    setSelectedMedia([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectAll) {
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((media) => media._id)
      );
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll]);

  return (
    <>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-4 px-3 border-b [.border-b:pb-2]">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Trash Media"}
            </h4>
            <div className="flex items-center gap-5">
              {deleteType === "SD" && (
                <UploadMedia isMultiple={true} queryClient={queryClient} />
              )}

              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button type="button" variant="destructive">
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                ) : (
                  <Button type="button">
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>
              <div className="flex gap-2">
                {deleteType === "SD" ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                  >
                    Move to Trash
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => handleDelete(selectedMedia, "RSD")}>
                      Restore
                    </Button>
                    <Button onClick={() => handleDelete(selectedMedia, "PD")}>
                      Delete Permantly
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          {status === "pending" ? (
            <div>Loading....</div>
          ) : status === "error" ? (
            <div>{error.message}</div>
          ) : (
            <>
              {data.pages.flatMap((page) =>
                page?.mediaData?.map((media) => media._id)
              ).length === 0 && (
                <div className="text-center">Data not found</div>
              )}
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media) => (
                      <Media
                        key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          {hasNextPage && (
            <ButtonLoading
              type="button"
              loading={isFetching}
              onClick={() => fetchNextPage()}
              text="Load more"
              className="cursor-pointer"
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MediaPage;
