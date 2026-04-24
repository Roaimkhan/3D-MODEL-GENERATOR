"use client";

import { FormEvent, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import SplineScene from "@/components/spline-scene";

type GeneratedResult = {
  prompt: string;
  modelUrl: string;
  createdAt: string;
  status: string;
  formats: string[];
};

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const latest = useMemo(() => history[0], [history]);

  const pollTaskUntilDone = useCallback(async (taskId: string) => {
    const maxAttempts = 120;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const response = await fetch(`/api/generate/${encodeURIComponent(taskId)}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fallback = "Failed to get generation status.";
        const reason = typeof payload.error === "string" ? payload.error : fallback;
        throw new Error(reason);
      }

      const status = typeof payload.status === "string" ? payload.status.toUpperCase() : "UNKNOWN";
      const modelUrls = typeof payload.modelUrls === "object" && payload.modelUrls ? payload.modelUrls : {};

      if (status === "SUCCEEDED") {
        const urlCandidates = ["glb", "obj", "fbx", "stl", "usdz"];
        const selectedUrl = urlCandidates
          .map((key) => modelUrls[key])
          .find((value): value is string => typeof value === "string" && value.length > 0);

        if (!selectedUrl) {
          throw new Error("Generation finished but no model URL was returned.");
        }

        return {
          modelUrl: selectedUrl,
          status,
          formats: Object.keys(modelUrls),
        };
      }

      if (["FAILED", "ERROR", "CANCELLED"].includes(status)) {
        throw new Error("Generation failed on backend.");
      }

      setProgressMessage(`Generating 3D model... (${attempt}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }

    throw new Error("Generation timed out. Please try a shorter prompt.");
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      return;
    }

    setErrorMessage(null);
    setProgressMessage("Submitting prompt...");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fallback = "Failed to start generation.";
        const reason = typeof payload.error === "string" ? payload.error : fallback;
        throw new Error(reason);
      }

      const taskId = typeof payload.taskId === "string" ? payload.taskId : "";
      if (!taskId) {
        throw new Error("Backend did not return a valid task ID.");
      }

      const completed = await pollTaskUntilDone(taskId);

      setHistory((prev) => [
        {
          prompt: cleanPrompt,
          modelUrl: completed.modelUrl,
          createdAt: new Date().toLocaleTimeString(),
          status: completed.status,
          formats: completed.formats,
        },
        ...prev,
      ]);
      setPrompt("");
      setProgressMessage("Model is ready.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected generation error.";
      setErrorMessage(message);
      setProgressMessage(null);
    } finally {
      setIsGenerating(false);
    }
  }, [pollTaskUntilDone, prompt]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50 text-slate-900">
      <div className="pointer-events-none absolute -left-28 top-0 z-0 h-64 w-64 rounded-full bg-cyan-200/10" />
      <div className="pointer-events-none absolute right-0 top-1/3 z-0 h-72 w-72 rounded-full bg-violet-200/10" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 z-0 h-64 w-64 rounded-full bg-emerald-200/8" />

      <div className="absolute inset-0 z-[2]">
        <SplineScene scene="https://prod.spline.design/wi-mp9AWOQYfl893/scene.splinecode" className="h-full w-full opacity-100" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_center,transparent_50%,rgb(0, 0, 0)_100%)]" />
        <div className="pointer-events-none absolute bottom-2 right-2 z-[9999] h-[54px] w-[170px] rounded-[1.2rem] bg-[#13181f] shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_10px_20px_-16px_rgba(2,6,23,0.7)] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] opacity-92" />
      </div>

      <section className="pointer-events-none relative z-10 mx-auto grid min-h-screen w-full max-w-[1360px] grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-4 p-4 md:grid-cols-[minmax(0,26.5rem)_minmax(0,1fr)_minmax(0,26.5rem)] md:grid-rows-[minmax(0,1fr)_auto] md:gap-x-6 md:px-8 md:pt-6 md:pb-4">
        <div className="pointer-events-none md:col-start-1 md:row-start-1 md:self-start md:-ml-[20px] lg:-ml-[20px]">
          <div className="pointer-events-auto translate-y-6 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-5 opacity-0 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] hover:ring-white/40 backdrop-blur-xl animate-glass-drift">
            <Link href="/" className="text-xs font-medium text-slate-500 transition hover:text-slate-900 hover:underline underline-offset-2">
              Back
            </Link>

            <div className="mt-3 space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Output</p>
              <h2 className="text-2xl font-bold text-slate-900">Latest Result</h2>
            </div>

            <div className="mt-4 rounded-xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-5 backdrop-blur-xl ring-1 ring-white/30">
              {latest ? (
                <div className="space-y-3">
                  <div className="space-y-1.5 border-b border-white/10 pb-3">
                    <p className="text-[9px] uppercase tracking-widest text-white/60">Prompt</p>
                    <p className="text-sm leading-relaxed text-white">{latest.prompt}</p>
                  </div>
                  <div className="space-y-1.5 border-b border-white/10 pb-3">
                    <p className="text-[9px] uppercase tracking-widest text-white/60">Generated</p>
                    <p className="text-xs font-mono text-white">{latest.createdAt}</p>
                  </div>
                  <div className="space-y-1.5 border-b border-white/10 pb-3">
                    <p className="text-[9px] uppercase tracking-widest text-white/60">Status</p>
                    <p className="text-xs font-mono text-white">{latest.status}</p>
                  </div>
                  <div className="space-y-1.5 border-b border-white/10 pb-3">
                    <p className="text-[9px] uppercase tracking-widest text-white/60">Model URL</p>
                    <p className="truncate text-xs font-mono text-white" title={latest.modelUrl}>{latest.modelUrl}</p>
                  </div>
                  <div className="space-y-2 rounded-lg border border-white/10 bg-[rgba(0,0,0,0.85)] p-3 text-xs text-white/80">
                    <p className="text-[9px] uppercase tracking-widest text-white/60">Preview</p>
                    <iframe
                      src={latest.modelUrl}
                      title="Generated 3D model preview"
                      className="h-[180px] w-full rounded-md bg-black/40"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={latest.modelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/15"
                      >
                        Open Model
                      </a>
                      <span className="text-[10px] text-white/65">
                        Formats: {latest.formats.length ? latest.formats.join(", ") : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[185px] place-items-center text-center">
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-white">No output yet</p>
                    <p className="text-sm text-white/70">Generate your first 3D model</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto md:col-start-3 md:row-start-1 md:self-start md:justify-self-end md:-mr-[20px] lg:-mr-[20px]">
          <div className="translate-y-6 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-4 opacity-0 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] hover:ring-white/40 backdrop-blur-xl animate-float-soft">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] px-3 py-1.5 ring-1 ring-white/20">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white">Prompt Studio</span>
              </div>
              <p className="text-sm leading-6 text-white">
                Describe the object, mood, or product and keep refining until it feels production-ready.
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.16)] ring-1 ring-white/20 backdrop-blur-md animate-glass-drift">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-white/60">Precision</p>
                <p className="text-xs text-white">Use material, lighting, and silhouette words.</p>
              </div>
              <div className="rounded-lg border border-white/35 bg-[linear-gradient(180deg,rgba(0, 0, 0),rgba(0, 0, 0))] p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.16)] ring-1 ring-white/20 backdrop-blur-md animate-glass-drift [animation-delay:0.8s]">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-white/60">Speed</p>
                <p className="text-xs text-white">Start short, then iterate with detail.</p>
              </div>
              <div className="rounded-lg border border-white/35 bg-[linear-gradient(180deg,rgba(0, 0, 0),rgba(0, 0, 0))] p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.16)] ring-1 ring-white/20 backdrop-blur-md animate-glass-drift [animation-delay:1.6s]">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-white/60">Style</p>
                <p className="text-xs text-white">Favor clear shape language and contrast.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto md:col-start-2 md:row-start-2 md:self-end md:-mt-[30px] md:mb-3 lg:-mt-[100px]">
          <div className="rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgba(0, 0, 0),rgba(0, 0, 0))] p-5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 backdrop-blur-xl transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:mt-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white">Enter your prompt</p>
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5 lg:flex-row">
              <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="e.g. futuristic red sports car with holographic details..."
                className="h-11 w-full rounded-xl border border-white/20 bg-[rgba(0,0,0,0.55)] px-4 text-sm text-white outline-none ring-1 ring-white/10 transition-all placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="h-11 rounded-xl bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-black/50 lg:min-w-[180px]"
              >
                {isGenerating ? "Generating..." : "Generate 3D Model"}
              </button>
            </form>
            {progressMessage ? <p className="mt-2 text-[10px] text-white/75">{progressMessage}</p> : null}
            {errorMessage ? <p className="mt-2 text-[10px] text-rose-300">{errorMessage}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
