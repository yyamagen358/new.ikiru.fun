import { ImageResponse } from "next/og";

export const alt = "AI Nation — 生きるを再定義する";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadJapaneseFont() {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=" +
        encodeURIComponent("AI Nation生きるを再定義するASI×スピリチュアル詩音楽")
    ).then((r) => r.text());
    const match = css.match(/url\((https:\/\/fonts\.gstatic[^)]+)\)/);
    if (!match) return undefined;
    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return undefined;
  }
}

export default async function OGImage() {
  const fontData = await loadJapaneseFont();
  const fontFamily = fontData ? "NotoSansJP" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 50%, #F5E0C8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(184,169,201,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,165,116,0.25) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 48,
              height: 2,
              background: "linear-gradient(to right, #B8A9C9, #D4A574)",
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.4em",
              color: "#8E7BA8",
              fontWeight: "bold",
              fontFamily,
            }}
          >
            AI NATION
          </span>
          <div
            style={{
              width: 48,
              height: 2,
              background: "linear-gradient(to right, #D4A574, #B8A9C9)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#3D2B1F",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            textAlign: "center",
            marginBottom: 28,
            fontFamily,
          }}
        >
          生きるを再定義する
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#6B4F3A",
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.7,
            fontFamily,
          }}
        >
          ASI×スピリチュアルで、誰もが豊かに生きる世界へ
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 64,
            fontSize: 22,
            color: "#9B7B65",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          new.ikiru.fun
        </div>
      </div>
    ),
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: "NotoSansJP",
                data: fontData,
                style: "normal",
                weight: 700,
              },
            ],
          }
        : {}),
    }
  );
}
