import { useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { ToggleButton } from "./ToggleButton";
import axios from "axios";
import { TextField } from "./TextField";
import { CopyButton } from "./CopyButton";
import { BACKEND_URL } from "../config";

export function ShareContentModal({open, onClose} : {open:boolean, onClose:() => void}) {
    const [toggled, setToggled] = useState(false)
    const [link,setLink] = useState("")
    useEffect(() => {
      if (!open) return;
      axios.get(`${BACKEND_URL}/app/v1/brain/share/enabled`, {
          headers: { token: localStorage.getItem("token") }
      }).then(async (res) => {
          setToggled(res.data.share);
          if (res.data.share) {
              try {
                  const linkRes = await axios.get(`${BACKEND_URL}/api/v1/brain/getLink`, {
                      headers: { token: localStorage.getItem("token") }
                  });
                  setLink(linkRes.data.Link);
              } catch (err) {
                  console.error("Failed to fetch link:", err);
              }
          } else {
              setLink("");
          }
      });
  }, [open]);

    if (!open) return null;
    async function handleToggled() {
        const next = !toggled;
        try {
            await axios.post(
              `${BACKEND_URL}/app/v1/brain/share`,
              { share: next },
              { headers: { token: localStorage.getItem("token") } }
            );

            setToggled(next);
            if (next) {
              const res = await axios.get(`${BACKEND_URL}/api/v1/brain/getLink`, {
                headers: { token: localStorage.getItem("token") },
              });
              setLink(res.data.Link);
            } else {
              setLink("");
            }
          } catch (err) {
            console.error("Failed to toggle share:", err);
          }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/55 backdrop-blur-[3px] transition-opacity"
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-brain-title"
                className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/45 bg-linear-to-br from-blue-300 via-sky-200/95 to-indigo-200/90 p-6 shadow-[0_25px_60px_-15px_rgba(49,46,129,0.45)] ring-1 ring-indigo-300/30"
            >
                <div
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-violet-400/25 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl"
                    aria-hidden
                />
                <div
                    className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-indigo-500 via-violet-500 to-sky-400"
                    aria-hidden
                />

                <div className="relative mb-5 flex items-start gap-3 pt-1">
                    <div className="w-9 shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1 text-center">
                        <h1
                            id="share-brain-title"
                            className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-lg font-bold tracking-tight text-transparent drop-shadow-sm"
                        >
                            Share Your Brain
                        </h1>
                    </div>
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/35 text-slate-800 shadow-sm ring-1 ring-white/50 transition hover:rotate-90 hover:bg-white/55"
                        onClick={onClose}
                    >
                        <CrossIcon />
                    </button>
                </div>

                <div className="relative flex flex-col gap-4">
                    <div className="rounded-2xl border border-white/40 bg-white/25 p-4 shadow-inner backdrop-blur-md">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                    Make your brain public
                                </p>
                            </div>
                            <div className="shrink-0">
                                <ToggleButton toggled={toggled} setToggled={handleToggled} />
                            </div>
                        </div>
                    </div>

                    {toggled && (
                        <div className="flex flex-col gap-3">
                            <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                                <span className="h-px w-6 bg-linear-to-r from-transparent to-indigo-400/80" aria-hidden />
                                Your link
                                <span className="h-px w-6 bg-linear-to-l from-transparent to-indigo-400/80" aria-hidden />
                            </p>
                            <div className="w-full rounded-xl bg-white/35 p-1 shadow-inner ring-1 ring-white/50 backdrop-blur-[2px] [&_input]:m-0 [&_input]:w-full [&_input]:max-w-none [&_input]:rounded-lg [&_input]:border-indigo-200/60 [&_input]:bg-white/90 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-slate-800 [&_input]:shadow-sm">
                                <TextField value={link} />
                            </div>
                            <div className="flex justify-center pt-0.5">
                                <div className="w-full rounded-xl bg-linear-to-r from-indigo-600/15 via-violet-500/15 to-indigo-600/15 p-[3px] shadow-lg shadow-indigo-900/15 ring-1 ring-white/40">
                                    <div className="rounded-[10px] bg-transparent px-1 py-0.5">
                                        <CopyButton name={link} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
