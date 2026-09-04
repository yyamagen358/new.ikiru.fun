"use client";

import { useState } from "react";

// 型だけをここに置く。lib/yobikake-mail.ts は process.env を読むサーバ側なので import しない。
type Option = { n: string; name: string; reply: string };
type Q = {
    id: string;
    q: string;
    mode: "stance" | "free";
    options?: Option[];
    examples?: string[];
};

/**
 * 毎朝のメールから1問だけ答える画面。
 *
 * いまは答えをサーバーに保存せず、本人の受信箱に送り返すだけ。
 * 「書いたものを返す」は成立するが、こちら側からは読めない。
 * before/after の証を作る段階で DB（Supabase）に保存する。
 */
export default function AnswerClient({
    q,
    day,
    contactId,
}: {
    q: Q | null;
    day: number;
    contactId: string;
}) {
    const [text, setText] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [message, setMessage] = useState("");

    if (!q) {
        return (
            <Shell>
                <p className="text-[17px] leading-[1.95] text-neutral-700">
                    リンクが正しくありません。
                    メール本文のボタンからもう一度お試しください。
                </p>
            </Shell>
        );
    }

    async function submit() {
        setState("sending");
        try {
            const res = await fetch("/api/yobikake/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactId, day, qid: q!.id, answer: text.trim() }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage(data.error ?? "うまくいきませんでした。");
                setState("error");
                return;
            }
            setState("done");
        } catch {
            setMessage("通信できませんでした。電波の良い場所で試してください。");
            setState("error");
        }
    }

    if (state === "done") {
        return (
            <Shell>
                <p className="text-sm tracking-widest text-neutral-400">{day}日目</p>
                <h1 className="mt-4 text-[22px] font-bold leading-[1.7] text-neutral-900">
                    書き残しました
                </h1>
                <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
                    <p className="text-[13px] leading-relaxed text-neutral-500">{q.q}</p>
                    <p className="mt-2 text-[17px] font-bold leading-[1.8] text-neutral-900">{text}</p>
                </div>
                <p className="mt-8 text-[15px] leading-[1.95] text-neutral-600">
                    いま書いた言葉を、あなたのメールに送りました。
                    受信箱に、あなたの答えが1日ずつ積み上がっていきます。
                </p>
            </Shell>
        );
    }

    return (
        <Shell>
            <p className="text-sm tracking-widest text-neutral-400">{day}日目</p>
            <h1 className="mt-4 text-[24px] font-bold leading-[1.65] text-neutral-900">{q.q}</h1>

            {q.mode === "stance" && q.options && (
                <div className="mt-8 space-y-3">
                    {q.options.map((o) => (
                        <button
                            key={o.name}
                            onClick={() => setText(o.name)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-6 py-4 text-left transition ${
                                text === o.name
                                    ? "border-neutral-900 bg-neutral-50"
                                    : "border-neutral-300 hover:border-neutral-900"
                            }`}
                        >
                            <span className="text-[20px] font-bold text-amber-500">{o.n}</span>
                            <span className="text-[17px] font-bold text-neutral-900">{o.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {q.mode === "free" && q.examples && (
                <div className="mt-8 rounded-2xl bg-neutral-50 p-5">
                    <p className="text-[13px] text-neutral-500">たとえば</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                        {q.examples.join(" ／ ")}
                    </p>
                </div>
            )}

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="ひとことで"
                className="mt-6 w-full resize-none rounded-2xl border border-neutral-300 p-5 text-[17px] leading-relaxed outline-none focus:border-neutral-900"
            />
            <p className="mt-3 text-[13px] text-neutral-400">誰にも公開されません</p>

            <button
                disabled={!text.trim() || state === "sending"}
                onClick={submit}
                className="mt-8 w-full rounded-full bg-neutral-900 py-4 text-[17px] font-bold text-white transition enabled:hover:bg-neutral-700 disabled:bg-neutral-300"
            >
                {state === "sending" ? "送信中…" : "書き残す"}
            </button>
            {state === "error" && (
                <p className="mt-3 text-[13px] leading-relaxed text-red-600">{message}</p>
            )}
        </Shell>
    );
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-14">
            {children}
        </main>
    );
}
