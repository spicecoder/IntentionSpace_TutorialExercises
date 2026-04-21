import { useEffect, useMemo, useState } from "react";
import {
  getDefaultSession,
  handleIncomingRedirect
} from "@inrupt/solid-client-authn-browser";
import { runMiniCpux, pulseFlow } from "./cpux";
import {
  podBaseFromWebId,
  buildPaths,
  writeIntentions,
  writePulses,
  writeField,
  readField
} from "./solidStore";

const ISSUER = "https://pods.solidcommunity.au";
const REDIRECT_URL = `${window.location.origin}/callback`;

function prettyResponses(responses) {
  if (!Array.isArray(responses)) return "-";
  if (responses.length === 1 && typeof responses[0] === "string") {
    return responses[0];
  }
  return JSON.stringify(responses);
}

export default function App() {
  const session = useMemo(() => getDefaultSession(), []);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [webId, setWebId] = useState("");
  const [podBase, setPodBase] = useState("");
  const [todoText, setTodoText] = useState("Buy milk");
  const [priority, setPriority] = useState("high");
  const [status, setStatus] = useState("Starting...");
  const [field, setField] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        await handleIncomingRedirect({ restorePreviousSession: true });
        const isLoggedIn = session.info.isLoggedIn;
        const currentWebId = session.info.webId || "";
        setLoggedIn(isLoggedIn);
        setWebId(currentWebId);
        if (isLoggedIn && currentWebId) {
          const pod = podBaseFromWebId(currentWebId);
          setPodBase(pod);
          setStatus(`Logged in as ${currentWebId}`);
        } else {
          setStatus("Not logged in.");
        }
      } catch (err) {
        console.error(err);
        setStatus(`Init error: ${err.message}`);
      } finally {
        setReady(true);
      }
    }
    init();
  }, [session]);

  async function login() {
    await session.login({
      oidcIssuer: ISSUER,
      redirectUrl: REDIRECT_URL,
      clientName: "Intention Space Demo"
    });
  }

  async function logout() {
    await session.logout();
    setLoggedIn(false);
    setWebId("");
    setPodBase("");
    setField(null);
    setStatus("Logged out.");
  }

  async function seedAndRun() {
    try {
      if (!session.info.isLoggedIn) throw new Error("Please log in first.");

      const fetch = session.fetch;
      const pod = podBaseFromWebId(session.info.webId);
      const paths = buildPaths(pod);

      const intentions = ["todo:create"];
      const pulses = [
        {
          name: "p_todo_text",
          tv: "Y",
          responses: [
            ["META", "text", "priority"],
            [todoText, priority]
          ]
        }
      ];

      const initialField = { intentions, pulses };

      setStatus("Writing initial intentions, pulses, and field to Pod...");
      await writeIntentions(fetch, paths.intentions, intentions);
      await writePulses(fetch, paths.pulses, pulses);
      await writeField(fetch, paths.field, initialField);

      setStatus("Running mini CPUX locally...");
      const updatedField = runMiniCpux(initialField);

      setStatus("Writing updated field back to Pod...");
      await writeField(fetch, paths.field, updatedField);
      setField(updatedField);
      setStatus(`Done. Written under ${paths.base}`);
    } catch (err) {
      console.error(err);
      setStatus(`Run error: ${err.message}`);
    }
  }

  async function loadFieldFromPod() {
    try {
      if (!session.info.isLoggedIn) throw new Error("Please log in first.");
      const fetch = session.fetch;
      const pod = podBaseFromWebId(session.info.webId);
      const paths = buildPaths(pod);
      setStatus("Reading field from Pod...");
      const loadedField = await readField(fetch, paths.field);
      setField(loadedField);
      setStatus("Field loaded from Pod.");
    } catch (err) {
      console.error(err);
      setStatus(`Read error: ${err.message}`);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 980 }}>
      <h1>Solid + Intention Space Demo</h1>

      <p><strong>Issuer:</strong> {ISSUER}</p>
      <p><strong>Redirect URL:</strong> {REDIRECT_URL}</p>
      <p><strong>Status:</strong> {status}</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {!loggedIn ? (
          <button onClick={login}>Login with Solid</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        <button onClick={seedAndRun} disabled={!loggedIn || !ready}>
          Seed + Run CPUX + Write to Pod
        </button>
        <button onClick={loadFieldFromPod} disabled={!loggedIn || !ready}>
          Read Field from Pod
        </button>
      </div>

      <div style={{ display: "grid", gap: 12, maxWidth: 640, marginBottom: 20 }}>
        <label>
          Todo text:{" "}
          <input
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            style={{ width: 420 }}
          />
        </label>
        <label>
          Priority:{" "}
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">low</option>
            <option value="normal">normal</option>
            <option value="high">high</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p><strong>Logged in:</strong> {String(loggedIn)}</p>
        <p><strong>WebID:</strong> {webId || "-"}</p>
        <p><strong>Pod Base:</strong> {podBase || "-"}</p>
      </div>

      <div style={{ marginBottom: 20, padding: 16, background: "#f7f7f7", borderRadius: 10 }}>
        <h2 style={{ marginTop: 0 }}>Pulse Flow</h2>
        <div style={{ fontSize: 18, lineHeight: 1.6 }}>
          {field ? pulseFlow(field) : "No field loaded yet."}
        </div>
      </div>

      <div style={{ marginBottom: 20, padding: 16, background: "#f7f7f7", borderRadius: 10 }}>
        <h2 style={{ marginTop: 0 }}>Pulse Summary</h2>
        {field?.pulses?.length ? (
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Pulse</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>TV</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Responses</th>
              </tr>
            </thead>
            <tbody>
              {field.pulses.map((pulse) => (
                <tr key={pulse.name}>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{pulse.name}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{pulse.tv}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{prettyResponses(pulse.responses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No pulses available.</div>
        )}
      </div>

      <div>
        <h2>Current Field</h2>
        <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, overflow: "auto" }}>
{JSON.stringify(field, null, 2)}
        </pre>
      </div>
    </div>
  );
}
