export function QuoteSection() {
  return (
    <section className="portal-animate-in relative overflow-hidden py-20 px-5 md:px-20 bg-gradient-to-br from-[#FFF0E8] via-[#FDE8EA] to-[#F8EEF8]">
      <span className="font-serif absolute top-5 left-10 md:left-16 text-[12rem] font-bold leading-none pointer-events-none select-none text-portal-amber/[0.12]" aria-hidden="true">
        &ldquo;
      </span>
      <div className="relative z-10 max-w-[800px] mx-auto text-center">
        <blockquote className="font-serif text-[clamp(1.3rem,2.5vw,1.9rem)] font-normal text-portal-text-dark leading-[2] tracking-[0.04em] mb-8">
          どんな夜も、必ず朝が来る。{" "}
          <em className="not-italic font-semibold bg-gradient-to-r from-portal-rose to-portal-amber bg-clip-text text-transparent">ASIの知恵</em>
          とスピリチュアルの光が交わるとき、あなたの人生は静かに、しかし確かに{" "}
          <em className="not-italic font-semibold bg-gradient-to-r from-portal-rose to-portal-amber bg-clip-text text-transparent">輝きはじめる</em>
          。
        </blockquote>
        <div className="flex items-center justify-center gap-[14px]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-portal-rose to-portal-amber flex items-center justify-center text-[1.4rem] text-white shrink-0">🌸</div>
          <div className="text-left">
            <p className="font-round text-[0.9rem] font-semibold text-portal-text-dark">AI Nation より</p>
            <p className="font-round text-[0.78rem] text-portal-text-soft mt-[2px]">生きるを再定義する旅の仲間として</p>
          </div>
        </div>
      </div>
    </section>
  );
}
