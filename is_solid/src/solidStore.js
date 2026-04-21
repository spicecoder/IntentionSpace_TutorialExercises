import { overwriteFile, getFile } from "@inrupt/solid-client";

export function podBaseFromWebId(webId) {
  const marker = "/profile/";
  const idx = webId.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Cannot derive Pod base from WebID: ${webId}`);
  }
  return webId.slice(0, idx + 1);
}

export function buildPaths(podBase) {
  const base = `${podBase}intention-space/`;
  return {
    base,
    intentions: `${base}intentions.json`,
    pulses: `${base}pulses.json`,
    field: `${base}field.json`
  };
}

async function writeJson(fetch, url, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  await overwriteFile(url, blob, {
    contentType: "application/json",
    fetch
  });

  return url;
}

async function readJson(fetch, url) {
  const file = await getFile(url, { fetch });
  const text = await file.text();
  return JSON.parse(text);
}

export async function writeIntentions(fetch, url, intentions) {
  return writeJson(fetch, url, { intentions });
}

export async function writePulses(fetch, url, pulses) {
  return writeJson(fetch, url, { pulses });
}

export async function writeField(fetch, url, field) {
  return writeJson(fetch, url, field);
}

export async function readField(fetch, url) {
  return readJson(fetch, url);
}
