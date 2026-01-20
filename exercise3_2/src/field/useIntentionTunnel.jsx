import { useContext } from "react";
import { FieldContext } from "./FieldContext";

export function useIntentionTunnel() {
  const { emit } = useContext(FieldContext);
  return { emit };
}