"use client";

import { useEffect, useRef, useState } from "react";

/**
 * soulmission358 の結果画面から「N を伝える」で来る画面。
 *
 * 記録は POST でしか行わない。リンクを開いただけ（GET）で書き込むと、
 * メールアプリやセキュリティ製品のリンク先読みで、本人が押していないのに
 * 記録されてしまう。読み込み後に一度だけ POST する。
 */
const R2 = "https://pub-b78eb12eaca24cd7a3c56c0cf82f1349.r2.dev";
/** 動画があるのはこの番号だけ。44 はまだ無い。 */
const HAS_VIDEO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

export default function NumberClient({
    soulNumber,
    contactId,
}: {
    soulNumber: number;
    contactId: string;
}) {
    const [state, setState] = useState<"sending" | "done" | "error">("sending");
    const [message, setMessage] = useState("");
    // React の開発モードは effect を2回走らせる。二重送信を防ぐ。
    const sent = useRef(false);

    useEffect(() => {
        if (sent.current) return;
        sent.current = true;
        if (!soulNumber || !contactId) {
            setState("error");
            setMessage("リンクが正しくありません。");
            return;
        }
        (async () => {
            try {
                const res = await fetch("/api/yobikake/number", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contactId, soulNumber }),
                });
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    setMessage(j.error ?? "うまく記録できませんでした。");
                    setState("error");
                    return;
                }
                setState("done");
            } catch {
                setMessage("通信できませんでした。");
                setState("error");
            }
        })();
    }, [soulNumber, contactId]);

    if (state === "error") {
        return (
            <Shell>
                <p className="text-[17px] leading-[1.95] text-neutral-700">{message}</p>
                <p className="mt-4 text-[15px] leading-[1.95] text-neutral-500">
                    診断の結果画面のボタンから、もう一度お試しください。
                </p>
            </Shell>
        );
    }

    if (state === "sending") {
        return (
            <Shell>
                <p className="text-[15px] text-neutral-400">受け取っています…</p>
            </Shell>
        );
    }

    return (
        <Shell>
            <p className="text-sm tracking-widest text-neutral-400">ありがとうございます</p>
            <h1 className="mt-4 text-[24px] font-bold leading-[1.65] text-neutral-900">
                あなたの番号 {soulNumber} を、
                <br />
                受け取りました。
            </h1>

            {HAS_VIDEO.includes(soulNumber) && (
                <div className="mt-8">
                    <p className="mb-3 text-[13px] tracking-[0.1em] text-neutral-500">
                        あなたの1分動画
                    </p>
                    <video
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full rounded-2xl bg-black"
                    >
                        <source src={`${R2}/soul-${soulNumber}.mp4`} type="video/mp4" />
                    </video>
                </div>
            )}

            <p className="mt-8 text-[15px] leading-[1.95] text-neutral-600">
                明日の朝も、いつもどおり問いが届きます。
            </p>
            <p className="mt-4 text-[15px] leading-[1.95] text-neutral-400">
                この画面は閉じて大丈夫です。
            </p>
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
