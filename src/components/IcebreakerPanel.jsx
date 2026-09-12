import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const IcebreakerPanel = ({
  targetUserId,
  onSend,
  sendLabel = "Send",
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState("");
  const [picked, setPicked] = useState(-1);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setOpen(false);
    setLoading(false);
    setError("");
    setData(null);
    setDraft("");
    setPicked(-1);
    setHint("");
  }, [targetUserId]);

  if (!targetUserId) return null;

  const load = async () => {
    setOpen(true);
    if (data || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/ai/icebreakers/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      setData(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        setError("Too many suggestions this hour. Try again later.");
      } else {
        setError(err?.response?.data?.message || "Could not load suggestions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const pick = (line, index) => {
    setPicked(index);
    setDraft(line);
    setHint("Edit the line, then send.");
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSend?.(text);
    setHint("");
    setOpen(false);
  };

  const handleCopy = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setHint("Copied — you can paste it in chat.");
    } catch {
      setHint(text);
    }
  };

  return (
    <div className={compact ? "relative" : "w-full"}>
      <button
        type="button"
        onClick={load}
        className={compact ? "btn-secondary min-h-10 text-sm px-3" : "btn-secondary w-full text-sm"}
      >
        Suggest openers
      </button>

      {open && (
        <div
          className={
            compact
              ? "absolute right-0 top-full mt-2 z-30 w-80 max-w-[min(20rem,calc(100vw-2rem))] surface-card p-3 shadow-xl"
              : "mt-2 surface-card p-3"
          }
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <p className="text-xs text-zinc-400">
              {loading ? "Writing ideas…" : data?.matchNote || "Pick one, then edit it"}
            </p>
            <button type="button" onClick={() => setOpen(false)} className="text-zinc-500 text-xs min-h-8 px-2">
              Close
            </button>
          </div>
          {error && (
            <p className="text-xs text-rose-300 mb-2" role="alert">
              {error}
            </p>
          )}
          {data?.icebreakers?.map((line, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(line, i)}
              className={`block w-full text-left text-xs rounded-xl px-3 py-2.5 mb-1.5 border ${
                picked === i
                  ? "bg-rose-950/50 text-white border-rose-900"
                  : "text-zinc-200 bg-zinc-950 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {line}
            </button>
          ))}

          <label className="block text-[11px] text-zinc-500 mt-2 mb-1">Your version</label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tap a suggestion, then rewrite it in your voice…"
            rows={3}
            className="input-field min-h-[72px] resize-none text-sm"
          />
          {hint && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleCopy} disabled={!draft.trim()} className="btn-secondary flex-1 text-sm">
              Copy
            </button>
            <button type="button" onClick={handleSend} disabled={!draft.trim()} className="btn-primary flex-1 text-sm">
              {sendLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IcebreakerPanel;
