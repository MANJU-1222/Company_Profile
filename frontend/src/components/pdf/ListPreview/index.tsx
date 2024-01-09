import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./ListPreview.style.scss";
import { Add } from "@mui/icons-material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { IconButton, Button, Box, CircularProgress } from "@mui/material";
import { ISelectedPages } from "../../../pages/View";
import { SortableItem } from "./sortableItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  // verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface ListPreviewProp {
  file: Blob;
  selectedId: string | null;
  handlePageSelect: (id: string) => void;
  mode: "vertical" | "horizontal";
  pageNos?: ISelectedPages[];
  onDocumentLoad: (doc: PDFDocumentProxy) => void;
  handleAddSelectedPage?: (pageNo: number) => void;
  handleDeleteSelectedPage?: (id: string) => void;
  handleDragEnd?: (event: DragEndEvent) => void;
  handleAddAll?: () => void;
}

export default function ListPreview({
  file,
  selectedId,
  handlePageSelect,
  mode = "horizontal",
  pageNos = [],
  onDocumentLoad,
  handleAddSelectedPage = (pageNo) => {
    return pageNo;
  },
  handleDeleteSelectedPage = (id) => id,
  handleDragEnd,
  handleAddAll = () => {}
}: ListPreviewProp) {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();

  return (
    <div className={`preview-container ${mode}`} style={{ overflow: "auto" }}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoad}
        loading={
          <Box>
            <CircularProgress />
          </Box>
        }
      >
        {mode === "vertical" ? (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{ marginBottom: "10px" }}
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={handleAddAll}
            >
              Add all
            </Button>
            {pageNos.map((item) => (
              <div
                className={`preview-page-container ${
                  item.id === selectedId ? "page-selected" : ""
                }`}
                onClick={() => {
                  handlePageSelect(item.id);
                }}
              >
                <div style={{ position: "relative" }}>
                  <Page
                    key={`page_${item.pageNo}`}
                    pageNumber={item.pageNo}
                    // width={pageWidth ? Math.min(pageWidth, maxWidth) : maxWidth}
                    className="preview-page"
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                  <div className="add-button">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        handleAddSelectedPage(item.pageNo);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </div>
                </div>
                <div className="page-no">{item.pageNo}</div>
              </div>
            ))}
          </>
        ) : pageNos.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pageNos}
              strategy={horizontalListSortingStrategy}
            >
              {pageNos.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  handleDeleteSelectedPage={handleDeleteSelectedPage}
                  handlePageSelect={handlePageSelect}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="empty-message">Add pages to download</div>
        )}
      </Document>
    </div>
  );
}
