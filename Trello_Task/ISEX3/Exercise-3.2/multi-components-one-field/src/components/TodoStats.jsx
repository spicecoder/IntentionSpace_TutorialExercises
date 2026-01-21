import { useFieldPulse } from "../field/useFieldPulse";

export function TodoStats() {
  const total = useFieldPulse("todo_count");
  const active = useFieldPulse("active_count");
  const done = useFieldPulse("done_count");

  return (
    <p>
      {total} total | {active} active | {done} done
    </p>
  );
}
