import React from "react";
import { INotes } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";

export const Note = ({
  note,
  onMouseDown,
  onMouseUp,
  onChangeTitle,
  onChangeBody,
}: {
  note: Pick<
    INotes,
    "id" | "bgColor" | "position" | "size" | "title" | "body" | "zIndex"
  >;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {};
  onChangeTitle: (e: React.FormEvent<HTMLInputElement>, id: string) => void;
  onChangeBody: (e: React.FormEvent<HTMLTextAreaElement>, id: string) => void;
}) => {
  return (
    <div
      className="note"
      style={{
        backgroundColor: note.bgColor,
        top: `${note.position.top}px`,
        left: `${note.position.left}px`,
        width: `${note.size.width}px`,
        height: `${note.size.height}px`,
        zIndex: note.zIndex,
        outlineColor: note.bgColor,
      }}
      onMouseDown={(e) => onMouseDown(e, note.id)}
      onMouseUp={onMouseUp}
    >
      <div className="note__title">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onChangeTitle(e, note.id)}
        />
      </div>
      <div className="note__body">
        <textarea
          value={note.body}
          onChange={(e) => onChangeBody(e, note.id)}
        />
      </div>
      <button className="note_resize-btn">
        <FontAwesomeIcon icon={faUpDown} />
      </button>
    </div>
  );
};
