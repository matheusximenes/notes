import { useEffect, useRef, useState } from "react";
import { Note } from "./components/Note";
import uuid from "react-uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export interface INotes {
  id: string;
  title: string;
  body: string;
  bgColor: string;
  position: IPosition;
  size: {
    width: number;
    height: number;
  };
  initialTop: number;
  initialLeft: number;
  lastTop: number;
  lastLeft: number;
  zIndex: number;
}

export interface IPosition {
  top: number;
  left: number;
}

const DEFAULT_NOTE_SIZE = {
  width: 250,
  height: 350,
};

const CONTAINER_MARGIN = 20;

const App = () => {
  const [notes, setNotes] = useState<INotes[]>([]);
  const [activeID, setActiveID] = useState<string | null>(null);
  const zIndex = useRef<number>(0);
  const deleteID = useRef<string>(null);
  const containerRed = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localStorageNotes = getStorageNotes();
    if (localStorageNotes.length > 0) {
      setNotes(localStorageNotes);
      zIndex.current =
        Math.max(...localStorageNotes.map((n: INotes) => n.zIndex)) + 1;
    }
  }, []);

  useEffect(() => {
    saveLocalStorageNotes();
  }, [notes]);

  const saveLocalStorageNotes = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  const getStorageNotes = () => {
    const storageNotes = localStorage.getItem("notes");
    if (storageNotes === null) return [];
    return JSON.parse(storageNotes);
  };

  const createNote = () => {
    const containerRect = containerRed.current.getBoundingClientRect();
    const top =
      Math.random() *
      (containerRect.height - DEFAULT_NOTE_SIZE.height - CONTAINER_MARGIN);
    const left =
      Math.random() *
      (containerRect.width - DEFAULT_NOTE_SIZE.width - CONTAINER_MARGIN);
    zIndex.current++;
    setNotes([
      ...notes,
      {
        id: uuid(),
        title: "Mock Title",
        body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum, at.",
        bgColor: `#${(((1 << 24) * Math.random()) | 0)
          .toString(16)
          .padStart(6, "0")}`,
        position: {
          top: top,
          left: left,
        },
        size: {
          width: DEFAULT_NOTE_SIZE.width,
          height: DEFAULT_NOTE_SIZE.height,
        },
        initialTop: top,
        initialLeft: left,
        lastTop: top,
        lastLeft: left,
        zIndex: zIndex.current,
      },
    ]);
  };

  const hasConcatWithTrash = (note: INotes) => {
    if (trashRef?.current === null) return false;
    const currentTrash = trashRef.current.getBoundingClientRect();
    return (
      currentTrash.left <= note.position.left + note.size.width &&
      currentTrash.top <= note.position.top + note.size.height
    );
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeID === null) return;
    const index = notes.findIndex((n) => n.id === activeID);
    const newPosition = {
      top: e.clientY - notes[index].initialTop + notes[index].lastTop,
      left: e.clientX - notes[index].initialLeft + notes[index].lastLeft,
    };
    notes[index].position = newPosition;
    if (hasConcatWithTrash(notes[index])) {
      trashRef.current.style.border = "3px dashed #F2A71B";
      deleteID.current = activeID;
    } else {
      trashRef.current.style.border = "3px dashed #012E40";
      deleteID.current = null;
      setNotes([...notes]);
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    zIndex.current++;
    const index = notes.findIndex((n) => n.id === id);
    notes[index].initialTop = e.clientY;
    notes[index].initialLeft = e.clientX;
    notes[index].zIndex = zIndex.current;
    setNotes([...notes]);
    setActiveID(id);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (deleteID.current !== null) {
      const filteredNotes = notes.filter((n) => n.id !== deleteID.current);
      console.log(filteredNotes);
      setNotes(filteredNotes);
    } else {
      const index = notes.findIndex((n) => n.id === activeID);
      notes[index].lastTop = e.target.offsetTop;
      notes[index].lastLeft = e.target.offsetLeft;
      setNotes([...notes]);
    }
    setActiveID(null);
  };

  const onChangeTitle = (
    event: React.FormEvent<HTMLInputElement>,
    id: string
  ) => {
    event.stopPropagation();
    const index = notes.findIndex((n) => n.id === id);
    notes[index].title = event.currentTarget.value;
    setNotes([...notes]);
  };

  const onChangeBody = (
    event: React.FormEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    event.stopPropagation();
    const index = notes.findIndex((n) => n.id === id);
    notes[index].body = event.currentTarget.value;
    setNotes([...notes]);
  };

  return (
    <main className="container">
      <div
        ref={containerRed}
        className="container__notes"
        onMouseMove={onMouseMove}
        // onMouseLeave={onMouseUp}
      >
        {notes.map((n) => (
          <Note
            key={n.id}
            note={{
              id: n.id,
              title: n.title,
              body: n.body,
              bgColor: n.bgColor,
              position: {
                top: n.position.top,
                left: n.position.left,
              },
              size: {
                width: n.size.width,
                height: n.size.height,
              },
              zIndex: n.zIndex,
            }}
            onMouseDown={(e) => onMouseDown(e, n.id)}
            onMouseUp={onMouseUp}
            onChangeTitle={(e) => onChangeTitle(e, n.id)}
            onChangeBody={(e) => onChangeBody(e, n.id)}
          />
        ))}
      </div>
      <div className="container__new-note">
        <button onClick={createNote} className="new-note__button">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div ref={trashRef} className="container__trash">
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </main>
  );
};

export default App;
