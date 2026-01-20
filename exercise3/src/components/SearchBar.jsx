import { useField } from "../field/FieldContext";

export default function SearchBar() {
  const { updateField } = useField();

  return (
    <input
      placeholder="Search dish..."
      onChange={(e) =>
        updateField("searchQuery", e.target.value, "INT_SEARCH_DISH")
      }
    />
  );
}