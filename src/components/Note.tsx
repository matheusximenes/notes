import React, { useEffect, useRef } from "react";
import { INotes } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";

export const Note = ({
  id,
  bgColor,
  positionTop,
  positionLeft,
  sizeWidth,
  sizeHeight,
  title,
  body,
  zIndex,
  onMouseDown,
  onMouseUp,
  onChangeTitle,
  onChangeBody,
  handleResize,
}: {
  id: string;
  title: string;
  body: string;
  bgColor: string;
  positionTop: number;
  positionLeft: number;
  sizeWidth: number;
  sizeHeight: number;
  zIndex: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => {};
  onChangeTitle: (e: React.FormEvent<HTMLSpanElement>, id: string) => void;
  onChangeBody: (e: React.FormEvent<HTMLSpanElement>, id: string) => void;
  handleResize: (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string | null
  ) => void;
}) => {
  const titleRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    titleRef.current.innerText = title;
    bodyRef.current.innerText = body;
  }, [title, body]);

  const handleStopPropagation = (e: React.MouseEvent<HTMLSpanElement>) =>
    e.stopPropagation();

  return (
    <div
      className="note"
      style={{
        backgroundColor: bgColor,
        top: `${positionTop}px`,
        left: `${positionLeft}px`,
        width: `${sizeWidth}px`,
        height: `${sizeHeight}px`,
        zIndex: zIndex,
        outlineColor: bgColor,
      }}
      onMouseDown={(e) => onMouseDown(e, id)}
      onMouseUp={onMouseUp}
    >
      <div className="note__title">
        <span
          onMouseUp={handleStopPropagation}
          onMouseDown={handleStopPropagation}
          aria-label="title"
          role="textbox"
          onBlur={(e) => onChangeTitle(e, id)}
          contentEditable={true}
          ref={titleRef}
        />
      </div>
      <div className="note__body">
        <span
          aria-label="body"
          role="textbox"
          onMouseUp={handleStopPropagation}
          onMouseDown={handleStopPropagation}
          onBlur={(e) => onChangeBody(e, id)}
          contentEditable={true}
          ref={bodyRef}
        />
      </div>
      <button
        className="note_resize-btn"
        onMouseUp={(e) => {
          handleResize(e, null);
        }}
        onMouseDown={(e) => {
          handleResize(e, id);
        }}
      >
        <FontAwesomeIcon icon={faUpDown} />
      </button>
    </div>
  );
};
