/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ListPreview from "../../components/pdf/ListPreview";
import { toast } from "react-toastify";
import "./ViewPage.style.scss";
import { useCallback, useEffect, useState } from "react";
import Previewer from "../../components/pdf/Previewer";
import type { PDFDocumentProxy } from "pdfjs-dist";
import pdfService from "../../service/pdfService";
import Select from "react-select";
import { searchOptions } from "../../contants/searchOptions";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Download, Close as CloseIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import JsFileDownload from "js-file-download";

export interface ISelectedPages {
  id: string;
  pageNo: number;
}

interface IOptions {
  label: string;
  value: string;
}

export default function ViewPage() {
  const [previewFile, setPreviewFile] = useState<Blob | null>(null);
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [fileId] = useState<string>("1");
  const [selectedPages, setSelectedPages] = useState<ISelectedPages[]>(
    [] as unknown as ISelectedPages[]
  );
  const [previewPages, setPreviewPages] = useState<ISelectedPages[]>(
    [] as unknown as ISelectedPages[]
  );
  const [selectedTag, setSelectedTag] = useState<IOptions[]>([]);
  const [fileName, setFileName] = useState("");
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

  const getPdf = useCallback(async () => {
    try {
      const data = await pdfService.getPdfById(fileId);
      const fileBlob = new Blob([data], { type: "text/pdf" });
      setPreviewFile(fileBlob);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong!");
    }
  }, [fileId]);

  const getPdfByTags = async (selectedTag: IOptions[]) => {
    try {
      const tags: string[] = selectedTag.map((tag: IOptions) => tag?.value);
      const data = await pdfService.filterPdfByTags("1", tags);
      return data;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    }
  };

  const downloadPdfByIdAndPageNo = async () => {
    try {
      const data = await pdfService.getPdfByIdAndPageNos(
        fileId,
        selectedPages.map((item) => item.pageNo)
      );
      JsFileDownload(data, `${fileName}.pdf`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    }
  };

  const handleOnDocumentLoad = (document: PDFDocumentProxy) => {
    setTotalPages(document.numPages);
  };

  const handleAddSelectedPage = (pageNo: number) => {
    setSelectedPages((prev) => {
      return [
        ...prev,
        {
          id: uuidv4(),
          pageNo: pageNo,
        },
      ];
    });
  };

  const handleRemovePage = (id: string) => {
    setSelectedPages((prev) => {
      return prev.filter((page) => page.id !== id);
    });
  };

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedTag(selectedOptions);
  };

  const handlePageSelect = (id: string) => {
    setPreviewPageId(id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSelectedPages((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleNextPage = () => {
    const currIdx = previewPages.findIndex((item) => item.id === previewPageId);
    setPreviewPageId((prev) => {
      if (prev) {
        return currIdx !== previewPages.length - 1
          ? previewPages[currIdx + 1].id
          : previewPages[currIdx].id;
      }
      return prev;
    });
  };

  const handlePrevPage = () => {
    const currIdx = previewPages.findIndex((item) => item.id === previewPageId);
    setPreviewPageId((prev) => {
      if (prev) {
        return currIdx !== 0
          ? previewPages[currIdx - 1].id
          : previewPages[currIdx].id;
      }
      return prev;
    });
  };

  const handleAddAll = () => {
    setSelectedPages((prev) => {
      return [
        ...prev,
        ...previewPages.map((item) => ({
          id: uuidv4() as string,
          pageNo: item.pageNo,
        })),
      ];
    });
  };

  useEffect(() => {
    getPdf();
  }, [getPdf]);

  useEffect(() => {
    getPdfByTags(selectedTag).then((value: any) => {
      const arr = value as number[];
      let pageList = arr.map((value) => {
        return {
          id: uuidv4() as string,
          pageNo: value,
        };
      });
      if (pageList.length === 0) {
        pageList = Array.from(new Array(totalPages || 0), (_, index) => ({
          id: `${index}`,
          pageNo: index + 1,
        }));
      }
      setPreviewPages(pageList);
      setPreviewPageId(pageList[0]?.id || null);
    });
  }, [selectedTag, totalPages]);

  return (
    <div className="overall-container-screen">
      {/* container with two columns - right side bar, container with top bar as well as previewer */}
      <div className="viewpage-container">
        {/* right side bar */}
        <div className="right-sidebar">
          <Select
            isMulti
            name="colors"
            options={searchOptions}
            className="filter-select"
            classNamePrefix="select"
            placeholder={"Select Filters"}
            onChange={handleSelectChange}
            styles={{
              control: (base) => ({
                ...base,
                margin: "2px",
              }),
              clearIndicator: (base) => ({
                ...base,
                padding: "0px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0px",
              }),
              valueContainer: (base) => ({
                ...base,
                maxHeight: "100px",
                overflow: "auto",
                padding: "2px 2px",
              }),
            }}
          />
          {previewFile && totalPages && (
            <ListPreview
              key={"vertical_list_preview"}
              file={previewFile}
              handlePageSelect={handlePageSelect}
              onDocumentLoad={handleOnDocumentLoad}
              selectedId={previewPageId}
              handleAddSelectedPage={handleAddSelectedPage}
              pageNos={previewPages}
              mode="vertical"
              handleAddAll={handleAddAll}
            />
          )}
        </div>
        {/* left container with top bar and previewer */}
        <div className="left-container">
          {/* Top bar */}
          <div className="topbar">
            {previewFile && (
              <ListPreview
                mode="horizontal"
                key={`list_preview`}
                file={previewFile}
                selectedId={previewPageId}
                pageNos={selectedPages}
                handlePageSelect={handlePageSelect}
                handleDeleteSelectedPage={handleRemovePage}
                onDocumentLoad={handleOnDocumentLoad}
                handleDragEnd={handleDragEnd}
              />
            )}
          </div>
          {/* previewer */}
          <div className="previewer">
            {previewFile && (
              <Previewer
                file={previewFile}
                pageIndex={previewPages.findIndex(
                  (item) => item.id === previewPageId
                )}
                pageNo={
                  previewPages.find((item) => item.id === previewPageId)
                    ?.pageNo || null
                }
                onDocumentLoad={handleOnDocumentLoad}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                previewLength={previewPages.length}
              />
            )}
          </div>
          {/* Download button */}
          <div className="download">
            <Button
              variant="contained"
              startIcon={<Download />}
              endIcon={<>{selectedPages.length}</>}
              color="primary"
              disabled={selectedPages.length == 0}
              onClick={() => {
                setOpenDownloadDialog(true);
              }}
            >
              Download
            </Button>
            <Modal
              open={openDownloadDialog}
              onClose={() => setOpenDownloadDialog(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  borderRadius: "10px",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => setOpenDownloadDialog(false)}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    color: "black",
                    cursor: "pointer",
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <InputLabel sx={{ marginBottom: '1rem' }}>Enter FileName</InputLabel>
                  <OutlinedInput
                    size="small"
                    autoFocus
                    onChange={(e) => setFileName(e.target.value)}
                    sx={{ marginBottom: '0.75rem' }}
                  />
                </Typography>
                <Typography style={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    onClick={downloadPdfByIdAndPageNo}
                    disabled={fileName === ""}
                  >
                    Download
                  </Button>
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
