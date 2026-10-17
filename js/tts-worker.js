/* Genius Kids Academy - human AI voice that runs on the device (Kokoro, open source, free, no key).
   Runs in a worker so the app never freezes while it speaks. The model downloads once and the browser keeps it. */
let tts = null, loading = null;
async function load(opts) {
  if (tts) return tts;
  if (loading) return loading;
  loading = (async () => {
    const { KokoroTTS } = await import("https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm");
    const progress = (p) => { if (p && p.status === "progress" && p.total) postMessage({ type: "progress", loaded: p.loaded, total: p.total, file: p.file }); };
    try { tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: opts.dtype || "q8", device: opts.device || "wasm", progress_callback: progress }); }
    catch (e) { if ((opts.device || "wasm") !== "wasm") tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "wasm", progress_callback: progress }); else throw e; }
    return tts;
  })();
  return loading;
}
self.onmessage = async (ev) => {
  const m = ev.data || {};
  try {
    if (m.type === "load") { await load(m); postMessage({ type: "ready" }); return; }
    if (m.type === "gen") {
      const t = await load(m);
      const audio = await t.generate(m.text, { voice: m.voice || "af_heart", speed: m.speed || 1 });
      postMessage({ type: "clip", id: m.id, blob: audio.toBlob() });
    }
  } catch (e) { postMessage({ type: m.type === "gen" ? "clip-error" : "error", id: m.id, message: String((e && e.message) || e) }); loading = tts ? loading : null; }
};
