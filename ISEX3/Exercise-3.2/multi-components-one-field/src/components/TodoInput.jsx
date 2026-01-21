import { useState } from "react";
import { useIntentionTunnel } from "../field/useIntentionTunnel";

export function TodoInput() {
  const [text, setText] = useState("");
  const { emit } = useIntentionTunnel();

  return (
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add todo"
      />
      <button
        onClick={() => {
          emit("INT_ADD_TODO", { text });
          setText("");
        }}
      >
        Add
      </button>
    </div>
  );
}
