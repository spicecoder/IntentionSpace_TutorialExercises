import { useContext, useState } from "react";
import { FieldContext } from "../intention-tunnel";


export default function ToDoInput() {
  const { emit } = useContext(FieldContext);
  const [text, setText] = useState("");

  const handleAdd = () => {
    emit({
      type: "INT_ADD_TODO",
      signal: { text }
    });
    setText("");
  };

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
    </>
  );
}
