import { Document, Page } from "react-pdf";
import "./Previewer.style.scss";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import type { PDFDocumentProxy } from "pdfjs-dist";

export interface PreviewerProps {
  file: Blob;
  pageNo: number | null;
  pageIndex: number | null;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  onDocumentLoad: (doc: PDFDocumentProxy) => void;
  previewLength: number;
}

export default function Previewer({
  file,
  pageNo,
  pageIndex,
  handleNextPage,
  handlePrevPage,
  onDocumentLoad,
  previewLength,
}: PreviewerProps) {

  return (
    <>
      {file && pageNo !== null && pageIndex !== null && (
        <div className="previewer-container">
          <div className="toolbar-container"></div>
          <div className="document-container">
            <Document
              key={"previewer-document"}
              file={file}
              onLoadSuccess={(document) => {
                onDocumentLoad(document);
              }}
              loading={
                <Box sx={{ height: "100%", width: "100%" }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Page
                key={"previewer-page"}
                pageNumber={pageNo}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <Box sx={{ height: "100%", width: "100%" }}>
                    <CircularProgress />
                  </Box>
                }
              />
            </Document>
          </div>
          <div className="pagination-container">
            <div>
              <IconButton onClick={handlePrevPage} disabled={pageIndex === 0}>
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={handleNextPage}
                disabled={pageIndex === previewLength - 1}
              >
                <NavigateNext />
              </IconButton>
            </div>
            <div className="pageNo">{pageNo}</div>
          </div>
        </div>
      )}
    </>
  );
}
