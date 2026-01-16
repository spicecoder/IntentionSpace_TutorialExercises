import { useContext } from "react";
import { FieldContext } from "./FieldContext";

export function useFieldPulse(name) {
  const ctx = useContext(FieldContext);
   if (!ctx || !ctx.field || !ctx.field.pulses) {
    throw new Error(
      "useFieldPulse must be used inside CartFieldProvider"
    );
  }
 
  return ctx.field.pulses[name]
}
