export function runMiniCpux(field) {
  const next = structuredClone(field);

  const hasIntention = next.intentions.includes("todo:create");
  const todoPulse = next.pulses.find(
    (p) => p.name === "p_todo_text" && p.tv === "Y"
  );

  const todoText = extractTodoText(todoPulse);
  const todoPriority = extractTodoPriority(todoPulse);

  if (hasIntention && todoText) {
    upsertPulse(next.pulses, {
      name: "p_todo_valid",
      tv: "Y",
      responses: ["validated"]
    });

    upsertPulse(next.pulses, {
      name: "p_todo_created",
      tv: "Y",
      responses: [
        ["META", "text", "priority", "status"],
        [todoText, todoPriority || "normal", "created"]
      ]
    });
  }

  next.lastRunAt = new Date().toISOString();
  return next;
}

function extractTodoText(pulse) {
  if (!pulse || !Array.isArray(pulse.responses) || pulse.responses.length === 0) {
    return "";
  }

  const first = pulse.responses[0];
  if (typeof first === "string") {
    return first;
  }

  if (Array.isArray(first) && first[0] === "META" && pulse.responses[1]) {
    const meta = first.slice(1);
    const row = pulse.responses[1];
    const idx = meta.indexOf("text");
    if (idx >= 0) return row[idx] || "";
  }

  return "";
}

function extractTodoPriority(pulse) {
  if (!pulse || !Array.isArray(pulse.responses) || pulse.responses.length < 2) {
    return "";
  }

  const first = pulse.responses[0];
  if (Array.isArray(first) && first[0] === "META") {
    const meta = first.slice(1);
    const row = pulse.responses[1];
    const idx = meta.indexOf("priority");
    if (idx >= 0) return row[idx] || "";
  }

  return "";
}

function upsertPulse(pulses, pulse) {
  const idx = pulses.findIndex((p) => p.name === pulse.name);
  if (idx >= 0) {
    pulses[idx] = pulse;
  } else {
    pulses.push(pulse);
  }
}

export function pulseFlow(field) {
  const names = (field?.pulses || []).map((p) => `${p.name} (${p.tv})`);
  return names.join(" → ");
}
