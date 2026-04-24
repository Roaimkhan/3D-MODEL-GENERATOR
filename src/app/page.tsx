import Link from "next/link";
import SplineScene from "@/components/spline-scene";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden text-slate-900">
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#d7f7ff_0%,_#f7fafc_35%,_#ffffff_100%)]" />
        <div className="pointer-events-none absolute -left-24 -top-24 z-[1] h-72 w-72 rounded-full bg-cyan-300/18 blur-3xl animate-float-soft" />
        <div className="pointer-events-none absolute -right-28 top-24 z-[1] h-80 w-80 rounded-full bg-violet-300/14 blur-3xl animate-glass-drift" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-1/3 z-[1] h-72 w-72 rounded-full bg-emerald-300/12 blur-3xl animate-float-soft" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(rgba(15,23,42,0.06)_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-10" />

        <div className="absolute inset-0 z-[5]">
          <SplineScene scene="https://prod.spline.design/S5nVcBGIPDDuMqVr/scene.splinecode" className="h-full w-full" />
          <div className="pointer-events-none absolute bottom-3 right-3 z-[9999] h-[64px] w-[188px] bg-[#d3d3d6] [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_100%)]" />
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-screen w-full max-w-7xl grid-rows-[minmax(auto,130px)_1fr_auto_minmax(12rem,auto)] px-3 py-3 sm:px-4 sm:py-4 lg:px-4 lg:py-4">
          {/* TOP ROW: Left and Right Info Cards */}
          <div className="pointer-events-none relative px-1">
            <div className="flex items-start justify-between gap-3">
              {/* TOP LEFT CARD */}
              <div className="pointer-events-auto relative -ml-8">
                <div className="w-[280px] translate-y-6 space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0)p-3.5 opacity-0 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                  <p className="inline-block rounded-full border border-cyan-200 bg-cyan-100 px-2.5 py-1 text-[10px] font-semibold text-cyan-900">
                    AI Generator
                  </p>
                  <h3 className="text-[1.3rem] font-bold leading-tight tracking-tight md:text-[1.5rem]">
                    Text to 3D Magic
                  </h3>
                  <p className="text-[9px] leading-5 text-slate-700 md:text-[9.5px]">
                    Transform text descriptions into stunning 3D models instantly. No technical skills required-just describe what you want to create.
                  </p>
                  <div className="space-y-1.5 border-t border-white/30 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-semibold text-slate-600">✓ Instant Generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-semibold text-slate-600">✓ Browser-Based</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP RIGHT CARDS */}
              <div className="-mr-8 flex flex-col gap-2.5 sm:gap-3">
                {/* INNOVATION CARD */}
                <div className="pointer-events-auto relative">
                  <div className="w-[280px] translate-y-6 space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0.12))] p-3.5 opacity-0 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                    <p className="inline-block rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-900">
                      Innovation
                    </p>
                    <h3 className="text-[1.25rem] font-bold leading-tight tracking-tight">
                      Speed & Quality
                    </h3>
                    <p className="text-[9px] leading-5 text-slate-700">
                      Photorealistic models generated in seconds using cutting-edge AI architecture and advanced neural networks.
                    </p>
                    <div className="space-y-1.5 border-t border-white/30 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-semibold text-slate-600">⚡ Lightning Fast</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-semibold text-slate-600">🎨 High Fidelity</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPERIENCE CARD */}
                <div className="pointer-events-auto relative">
                  <div className="w-[280px] translate-y-6 space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0.12))] p-3.5 opacity-0 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition-all duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                    <p className="inline-block rounded-full border border-violet-200 bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-900">
                      Experience
                    </p>
                    <h3 className="text-[1.25rem] font-bold leading-tight tracking-tight">
                      Zero Friction
                    </h3>
                    <p className="text-[9px] leading-5 text-slate-700">
                      No downloads, no plugins-pure interactive 3D right in your browser instantly. Start creating in seconds.
                    </p>
                    <div className="space-y-1.5 border-t border-white/30 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-semibold text-slate-600">🌐 Web Native</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-semibold text-slate-600">✨ Seamless</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO SPLINE ANIMATION */}
          <div className="row-start-2 flex items-center justify-center py-2 sm:py-3">
            <div className="relative h-[42vh] w-full max-w-[760px] md:h-[46vh] lg:max-w-[880px]" />
          </div>

          {/* CTA BUTTONS - MOVED HIGHER */}
          <section className="pointer-events-none row-start-3 flex items-start justify-center px-1 py-0 sm:py-1">
            <div className="pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-2 rounded-2xl border border-white/60 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] px-3.5 py-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)] backdrop-blur-xl ring-1 ring-white/40 sm:gap-3 sm:px-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">Start</p>
              <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:justify-end sm:gap-2">
                <Link
                  href="/generate"
                  className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-center text-[10px] font-semibold text-white transition hover:bg-slate-700 sm:px-4 sm:py-2 sm:text-[11px]"
                >
                  Generate 3D
                </Link>
                <a
                  href="#footer-links"
                  className="rounded-xl border border-slate-300 bg-white/90 px-3.5 py-1.5 text-center text-[10px] font-semibold text-slate-800 transition hover:border-slate-400 sm:px-4 sm:py-2 sm:text-[11px]"
                >
                  Help
                </a>
              </div>
            </div>
          </section>

          <footer id="footer-links" className="group/footer pointer-events-auto row-start-4 flex min-h-[12rem] items-end pb-0 pt-2">
            <div className="flex h-full w-full items-end justify-center rounded-[1.2rem] opacity-0 transition-all duration-500 ease-out group-hover/footer:opacity-100 group-hover/footer:translate-y-0 translate-y-6">
              <div className="grid w-full gap-2.5 rounded-[1rem] border border-white/22 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-3 md:grid-cols-3 md:gap-3.5 md:p-4">
                <div className="group/about space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-3.5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition duration-500 ease-out group-hover/about:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">About</p>
                  <h3 className="text-[0.95rem] font-bold tracking-tight text-slate-900">AI-Powered 3D</h3>
                  <p className="text-[9.5px] leading-4.5 text-slate-700">
                    We revolutionize 3D creation by combining advanced AI with intuitive browser-first design. Transform text descriptions into stunning interactive 3D experiences instantly.
                  </p>
                </div>

                <div className="group/contact space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0),rgb(0, 0, 0))] p-3.5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition duration-500 ease-out group-hover/contact:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Contact</p>
                  <h3 className="text-[0.95rem] font-bold tracking-tight text-slate-900">Let&apos;s Collaborate</h3>
                  <div className="space-y-1.5">
                    <p className="text-[9.5px] leading-4.5 text-slate-700">
                      Enterprise solutions, API integration, or custom 3D workflows for your business.
                    </p>
                    <div className="space-y-1 pt-1">
                      <p className="text-[9px] font-semibold text-slate-800">Email:</p>
                      <p className="text-[9px] font-mono text-slate-600">2501102@students.au.edu.pk</p>
                    </div>
                  </div>
                </div>

                <div className="group/resources space-y-2 rounded-2xl border border-white/35 bg-[linear-gradient(180deg,rgb(0, 0, 0)a(255,255,255,0.12))] p-3.5 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.14)] ring-1 ring-white/30 transition duration-500 ease-out group-hover/resources:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] md:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Resources</p>
                  <h3 className="text-[0.95rem] font-bold tracking-tight text-slate-900">Learn & Build</h3>
                  <div className="flex flex-col gap-2 pt-1">
                    <a href="/generate" className="text-[9.5px] font-semibold text-slate-700 transition hover:text-slate-950 hover:underline">
                      → Start Creating
                    </a>
                    <a href="#docs" className="text-[9.5px] font-semibold text-slate-700 transition hover:text-slate-950 hover:underline">
                      → API Docs
                    </a>
                    <a href="#tutorials" className="text-[9.5px] font-semibold text-slate-700 transition hover:text-slate-950 hover:underline">
                      → Tutorials
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
