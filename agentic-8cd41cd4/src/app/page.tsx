"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Newspaper,
  PlayCircle,
  ScrollText,
  Share2,
  TriangleAlert,
} from "lucide-react";
import type { AgentLog, AgentResponse, AgentResult } from "@/types/agent";

type Platform = AgentResult["social"]["platform"] | "none";

const stageCopy: Record<AgentLog["stage"], { label: string; icon: ReactNode }> = {
  news: {
    label: "Gather Headlines",
    icon: <Newspaper className="h-4 w-4" aria-hidden />,
  },
  script: {
    label: "Draft Script",
    icon: <ScrollText className="h-4 w-4" aria-hidden />,
  },
  video: {
    label: "Generate Video",
    icon: <PlayCircle className="h-4 w-4" aria-hidden />,
  },
  social: {
    label: "Publish",
    icon: <Share2 className="h-4 w-4" aria-hidden />,
  },
};

const statusClasses: Record<AgentLog["status"], string> = {
  pending: "border-amber-500/40 bg-amber-500/5 text-amber-600",
  success: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600",
  error: "border-rose-500/40 bg-rose-500/5 text-rose-600",
  skipped: "border-slate-500/30 bg-slate-500/5 text-slate-500",
};

const statusIcon: Record<AgentLog["status"], ReactNode> = {
  pending: <Loader2 className="h-4 w-4 animate-spin" aria-hidden />,
  success: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  error: <TriangleAlert className="h-4 w-4" aria-hidden />,
  skipped: <ArrowRight className="h-4 w-4" aria-hidden />,
};

const defaultTopic = "Global technology policy";

function formatTimestamp(input: string) {
  const date = new Date(input);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [topic, setTopic] = useState(defaultTopic);
  const [platform, setPlatform] = useState<Platform>("buffer");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const latestStatus = useMemo(() => logs.at(-1)?.status ?? "pending", [logs]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRunning(true);
    setError(null);
    setLogs([]);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, platform }),
      });

      const data = (await response.json()) as AgentResponse;

      if (data.success) {
        setResult(data.result);
        setLogs(data.result.logs);
      } else {
        setResult(null);
        setLogs(data.logs);
        setError(data.error);
      }
    } catch (err) {
      setResult(null);
      setLogs([]);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-10 shadow-xl">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-sm uppercase tracking-wide text-emerald-300">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Autonomous News Agent
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn Google News into ready-to-post social videos in minutes.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              The agent picks the freshest headlines, drafts a narration, calls AI
              video generation, and optionally pushes the finished clip to your
              social queue.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-2xl border border-white/10 bg-slate-950/40 p-8 shadow-inner shadow-black/50 md:grid-cols-[2fr,1fr,auto]"
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Topic or Keywords
              <input
                required
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="AI ethics"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Social Platform
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value as Platform)}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="buffer">Buffer queue</option>
                <option value="x">X (Twitter)</option>
                <option value="none">Skip auto-post</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={isRunning}
              className="inline-flex h-fit items-center justify-center gap-2 self-end rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Running
                </>
              ) : (
                <>
                  Launch agent
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">
              {error}
            </div>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
                <PlayCircle className="h-5 w-5 text-emerald-400" aria-hidden />
                Latest run
              </h2>
              {result ? (
                <div className="mt-4 space-y-6">
                  <video
                    className="w-full rounded-2xl border border-white/10 bg-black"
                    controls
                    preload="metadata"
                    poster={result.video.previewImage}
                    src={result.video.url}
                  />
                  <div className="space-y-3 text-sm text-slate-300">
                    <div>
                      <span className="font-semibold text-white">Topic:</span> {" "}
                      {result.topic}
                    </div>
                    <div>
                      <span className="font-semibold text-white">Summary:</span> {" "}
                      {result.summary || "No summary available."}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Narration Script
                    </h3>
                    <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
                      {result.narrationScript || "Script not generated."}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Social Caption
                    </h3>
                    <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                      {result.socialCaption}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-6 py-14 text-center text-sm text-slate-400">
                  <PlayCircle className="h-8 w-8 text-slate-500" aria-hidden />
                  Trigger a run to see the generated video, script, and captions here.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-white">
                <Newspaper className="h-5 w-5 text-emerald-400" aria-hidden />
                Source Headlines
              </h2>
              {result?.news ? (
                <ol className="mt-4 space-y-4 text-sm text-slate-300">
                  {result.news.map((story) => (
                    <li
                      key={`${story.title}-${story.link}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      <a
                        href={story.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-white transition hover:text-emerald-300"
                      >
                        {story.title}
                      </a>
                      <p className="mt-2 text-slate-400">{story.snippet}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
                        <span>{story.source ?? "Google News"}</span>
                        <span>•</span>
                        <span>{new Date(story.published).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  Run the agent to see the stories it selected.
                </p>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Run Timeline</h2>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses[latestStatus]}`}
                >
                  {statusIcon[latestStatus]}
                  {latestStatus}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {logs.length ? (
                  logs.map((log) => (
                    <li
                      key={`${log.stage}-${log.timestamp}-${log.status}`}
                      className={`flex flex-col gap-1 rounded-2xl border bg-slate-950/70 p-4 text-sm ${statusClasses[log.status]}`}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        {stageCopy[log.stage].icon}
                        {stageCopy[log.stage].label}
                        <span className="ml-auto text-xs font-normal text-slate-300">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200">{log.message}</p>
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-400">
                    Launch the agent to review each stage of the workflow.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-sm text-emerald-100">
              <h2 className="text-lg font-semibold text-emerald-100">
                Integrate Production APIs
              </h2>
              <p className="mt-3 leading-relaxed">
                Configure environment variables such as <code className="font-mono">OPENAI_API_KEY</code>,{" "}
                <code className="font-mono">REPLICATE_API_TOKEN</code>, and your preferred social
                credentials to unlock fully automated runs. Without them, the app
                returns safe placeholders so you can verify the flow end-to-end.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
