import { useContext } from 'react';
import { FieldContext } from './FieldContext';

export function useFieldPulse(pulseName) {
  const { field } = useContext(FieldContext);
  return field.pulses[pulseName];
}
