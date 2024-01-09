/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ISelectedPages } from "../../../pages/View";
import { IconButton } from "@mui/material";
import { Remove } from "@mui/icons-material";
import { Page } from "react-pdf";
import './ListPreview.style.scss';

export interface SortableItemProps {
  id: string;
  item: ISelectedPages;
  handlePageSelect: (id: string) => void;
  handleDeleteSelectedPage: (id: string) => void;
}

export function SortableItem({
  id,
  item,
  handlePageSelect,
  handleDeleteSelectedPage,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div>
      <div
        className={`preview-page-vertical`}
        onPointerDown={(event: any) => {
          handlePageSelect(item.id);
          event.stopPropagation();
        }}
        ref={setNodeRef} style={style} {...attributes} {...listeners}
      >
        <Page
          key={`page_preview_${item.pageNo}`}
          pageNumber={item.pageNo}
          className="preview-page"
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
        <div className="delete-button-container">
          <IconButton
            color="primary"
            onPointerDown={(event: any) => {
              handleDeleteSelectedPage(item.id);
              event.stopPropagation();
            }}
            className="delete-button"
          >
            <Remove />
          </IconButton>
        </div>
        <div className="page-no">{item.pageNo}</div>
      </div>
    </div>
  );
}
