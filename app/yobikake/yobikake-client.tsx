"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import data from "@/lib/yobikake-questions.json";

type Option = { n: string; name: string; reply: string };
type Q = {
    id: string;
    folder: string;
    q: string;
    mode: "stance" | "free";
    options?: Option[];
    examples?: string[];
};

const QUESTIONS = data.questions as Q[];
const Q2_POOL = data.q2_pool as string[];
/**
 * 2問目に使う選択式の問い。
 *
 * 動画で「①か②」まで決めた人が着地したとき、最初にやることがタップなら
 * 指はもう動いている。そこに空欄が3つ並ぶと「書く」という別の行為に
 * 切り替わって止まる。タップ→タップ→書く、と坂にする。
 *
 * q2_pool は自由記述しか入っていないので、選択式が1問も無いときだけ使う。
 */
const STANCE_IDS = QUESTIONS.filter((q) => q.mode === "stance").map((q) => q.id);
const Q3_POOL = data.q3_pool as string[];

const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

/** 同じ動画から来た人が毎回同じ順路をたどれるよう、IDから決定的に選ぶ */
function pick<T>(pool: T[], seed: string, salt: number): T {
    let h = salt;
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 100003;
    return pool[h % pool.length];
}

type Answer = { q: string; a: string; reply?: string };

/*
 * 使命トリセツ（soulmission358.com）への導線は、意図的にここに置かない。
 *
 * 診断を受けても届く問いが変わらない段階で誘導すると、
 * 「診断しても何も起きなかった」を先に体験させてしまう。
 * ソウルナンバー別の出し分けが実装でき、翌朝のメールで
 * 「あなたの問いが変わりました」と言えるようになってから、
 * 配信4〜6日目のメール内で誘う。
 */


/**
 * LPの通過を記録する。
 *
 * 動画→LP→登録のどこで人が消えているかを見るため。
 * 個人は送らない（段階・問い・流入元だけ）。
 * 計測が落ちても画面は止めないので await しない。
 */
function track(stage: "visit" | "wrote", q: string) {
    try {
        const p = new URLSearchParams(window.location.search);
        void fetch("/api/yobikake/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({
                stage,
                q,
                source: p.get("utm_source") || p.get("from") || "direct",
                referrer: document.referrer || null,
            }),
        }).catch(() => {});
    } catch {
        /* 計測できないだけ。進行は妨げない */
    }
}

export default function YobikakeClient({ qid }: { qid: string }) {
    const q1 = useMemo(() => byId.get(qid) ?? QUESTIONS[0], [qid]);
    const q2 = useMemo(() => {
        // 1問目と同じ問いが続けて出ないように除く
        const pool = STANCE_IDS.filter((id) => id !== q1.id);
        return byId.get(pick(pool.length ? pool : Q2_POOL, q1.id, 7))!;
    }, [q1]);
    const q3text = useMemo(() => pick(Q3_POOL, q1.id, 13), [q1]);

    const [step, setStep] = useState(0);           // 0,1,2 = 設問 / 3 = 完了
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [reply, setReply] = useState<string | null>(null);
    const [text, setText] = useState("");

    const current = step === 0 ? q1 : q2;

    // 到達を1回だけ記録する。StrictMode の二重実行を防ぐ
    const seen = useRef(false);
    useEffect(() => {
        if (seen.current) return;
        seen.current = true;
        track("visit", q1.id);
    }, [q1.id]);

    // 3問書き終えてメール入力の画面に着いたところ。
    // ここと visit の差が「書いてもらえたか」、
    // ここと signup の差が「メールを渡してもらえたか」になる。
    const wrote = useRef(false);
    useEffect(() => {
        if (step !== 3 || wrote.current) return;
        wrote.current = true;
        track("wrote", q1.id);
    }, [step, q1.id]);

    function commit(a: Answer) {
        const next = [...answers, a];
        setAnswers(next);
        setReply(a.reply ?? null);
        try {
            localStorage.setItem("yobikake:answers", JSON.stringify(next));
        } catch {
            /* プライベートウィンドウ等では保存できないが、進行は妨げない */
        }
    }

    function advance() {
        setReply(null);
        setText("");
        setStep((s) => s + 1);
    }

    // ── 答えた直後：必ず何かを返す ────────────────────────────────────────────
    if (reply !== null) {
        const answered = answers[answers.length - 1];
        const others =
            step < 2 && current.mode === "stance"
                ? current.options!.filter((o) => o.name !== answered.a)
                : [];
        return (
            <Shell>
                <p className="text-sm tracking-widest text-neutral-400">あなたの答え</p>
                <p className="mt-3 text-2xl font-bold text-neutral-900">{answered.a}</p>
                {reply && (
                    <p className="mt-6 text-[17px] leading-[1.95] text-neutral-700">{reply}</p>
                )}

                {others.length > 0 && (
                    <div className="mt-10 border-t border-neutral-200 pt-6">
                        <p className="text-sm text-neutral-500">ちなみに、こう感じている人もいます</p>
                        <ul className="mt-4 space-y-4">
                            {others.map((o) => (
                                <li key={o.name} className="text-[15px] leading-[1.9] text-neutral-600">
                                    <span className="font-bold text-neutral-800">{o.name}</span>
                                    <br />
                                    {o.reply}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={advance}
                    className="mt-12 w-full rounded-full bg-neutral-900 py-4 text-[17px] font-bold text-white transition hover:bg-neutral-700"
                >
                    {step < 2 ? "次の問いへ" : "答え終える"}
                </button>
            </Shell>
        );
    }

    // ── 完了 ─────────────────────────────────────────────────────────────────
    if (step >= 3) {
        return (
            <Shell>
                <p className="text-sm tracking-widest text-neutral-400">3つ、答えました</p>
                <h2 className="mt-4 text-[28px] font-bold leading-[1.5] text-neutral-900">
                    明日のあなたは、
                    <br />
                    何と答えるでしょう。
                </h2>
                {/* 日次配信エンジンは未実装。動き出すまで「届きます」と断定しない */}
                <p className="mt-8 text-[17px] leading-[1.95] text-neutral-700">
                    問いは、答えるたびに少しずつ形を変えていきます。
                    答えても、答えなくてもかまいません。
                    大切なのは、問いのほうを覚えておくことです。
                </p>

                <div className="mt-10 rounded-2xl bg-neutral-50 p-6">
                    <p className="text-sm text-neutral-500">いま書いた3つ</p>
                    <ul className="mt-4 space-y-4">
                        {answers.map((a, i) => (
                            <li key={i}>
                                <p className="text-[13px] leading-relaxed text-neutral-500">{a.q}</p>
                                <p className="mt-1 text-[16px] font-bold text-neutral-900">{a.a}</p>
                            </li>
                        ))}
                    </ul>
                    {/* 保存はブラウザ内のみ。サーバー保存も配信も未実装なので約束しない */}
                    <p className="mt-5 text-[13px] leading-relaxed text-neutral-500">
                        いまはこの画面にだけ残っています。
                        ページを閉じると消えます。
                    </p>
                </div>

                <Subscribe answers={answers} qid={q1.id} />
            </Shell>
        );
    }

    // ── Q3：定点観測（自由入力） ───────────────────────────────────────────────
    if (step === 2) {
        return (
            <Shell>
                <p className="text-sm tracking-widest text-neutral-400">3つ目</p>
                <h1 className="mt-4 text-[26px] font-bold leading-[1.6] text-neutral-900">
                    {q3text}
                </h1>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="ひとことで"
                    className="mt-8 w-full resize-none rounded-2xl border border-neutral-300 p-5 text-[17px] leading-relaxed outline-none focus:border-neutral-900"
                />
                <p className="mt-3 text-[13px] text-neutral-400">誰にも公開されません</p>
                <button
                    disabled={!text.trim()}
                    onClick={() =>
                        commit({
                            q: q3text,
                            a: text.trim(),
                            reply: "その一行が、今日のあなたです。同じ問いに、あなたはいつも同じ答えを書くとは限りません。",
                        })
                    }
                    className="mt-8 w-full rounded-full bg-neutral-900 py-4 text-[17px] font-bold text-white transition enabled:hover:bg-neutral-700 disabled:bg-neutral-300"
                >
                    答える
                </button>
            </Shell>
        );
    }

    // ── Q1 / Q2 ──────────────────────────────────────────────────────────────
    return (
        <Shell>
            <p className="text-sm tracking-widest text-neutral-400">今日の呼びかけ</p>
            <h1 className="mt-4 text-[26px] font-bold leading-[1.6] text-neutral-900">
                {current.q}
            </h1>

            {current.mode === "stance" ? (
                <>
                    <div className="mt-10 space-y-3">
                        {current.options!.map((o) => (
                            <button
                                key={o.name}
                                onClick={() => commit({ q: current.q, a: o.name, reply: o.reply })}
                                className="flex w-full items-center gap-4 rounded-2xl border border-neutral-300 px-6 py-5 text-left transition hover:border-neutral-900 hover:bg-neutral-50"
                            >
                                <span className="text-[22px] font-bold text-amber-500">{o.n}</span>
                                <span className="text-[18px] font-bold text-neutral-900">{o.name}</span>
                            </button>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-[13px] text-neutral-400">
                        どれが正しいということはありません
                    </p>
                </>
            ) : (
                <>
                    {current.examples && (
                        <div className="mt-8 rounded-2xl bg-neutral-50 p-5">
                            <p className="text-[13px] text-neutral-500">たとえば</p>
                            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                                {current.examples.join(" ／ ")}
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
                        disabled={!text.trim()}
                        onClick={() =>
                            commit({
                                q: current.q,
                                a: text.trim(),
                                reply: "書けました。答えを持っている、ということです。",
                            })
                        }
                        className="mt-8 w-full rounded-full bg-neutral-900 py-4 text-[17px] font-bold text-white transition enabled:hover:bg-neutral-700 disabled:bg-neutral-300"
                    >
                        答える
                    </button>
                </>
            )}

            <Dots step={step} />
        </Shell>
    );
}

/**
 * メール登録。外部サイト（使命トリセツ）へ送り出す手前に置く。
 * 約束するのは「いま書いた3つをメールで送る」ことだけ。
 * 日次配信は未実装なので「毎朝届く」とは書かない。
 */
function Subscribe({ answers, qid }: { answers: Answer[]; qid: string }) {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [message, setMessage] = useState("");

    async function submit() {
        setState("sending");
        try {
            const res = await fetch("/api/yobikake/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    answers,
                    // どの動画から来た人が登録したかを見るため。
                    // signup の記録はサーバー側で行う（画面からは偽装できない）
                    q: qid,
                    source:
                        new URLSearchParams(window.location.search).get("utm_source") ||
                        new URLSearchParams(window.location.search).get("from") ||
                        "direct",
                }),
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
            <div className="mt-12 rounded-2xl border border-neutral-900 p-6">
                <p className="text-[17px] font-bold text-neutral-900">送りました</p>
                <p className="mt-3 text-[15px] leading-[1.9] text-neutral-600">
                    いま書いた3つを、メールでお送りしました。
                    毎朝の問いをお届けする準備が整いましたら、あらためてご連絡します。
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12 rounded-2xl bg-neutral-50 p-6">
            <p className="text-[16px] font-bold leading-[1.8] text-neutral-900">
                この3つを、消えないところに置いておきますか。
            </p>
            <p className="mt-2 text-[14px] leading-[1.9] text-neutral-600">
                メールでお送りします。あなたの受信箱に残ります。
            </p>
            <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-5 w-full rounded-xl border border-neutral-300 bg-white p-4 text-[16px] outline-none focus:border-neutral-900"
            />
            <button
                disabled={!email.includes("@") || state === "sending"}
                onClick={submit}
                className="mt-4 w-full rounded-full bg-neutral-900 py-4 text-[16px] font-bold text-white transition enabled:hover:bg-neutral-700 disabled:bg-neutral-300"
            >
                {state === "sending" ? "送信中…" : "3つを受け取る"}
            </button>
            {state === "error" && (
                <p className="mt-3 text-[13px] leading-relaxed text-red-600">{message}</p>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-neutral-400">
                答えの内容が誰かに公開されることはありません。
            </p>
        </div>
    );
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-14">
            {children}
        </main>
    );
}

function Dots({ step }: { step: number }) {
    return (
        <div className="mt-10 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-neutral-900" : "bg-neutral-300"}`}
                />
            ))}
        </div>
    );
}
