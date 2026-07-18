export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-100 selection:bg-teal-500/30">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-[128px]" />

      {/* Card Content */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              LabCircle Status
            </span>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-3xs font-medium text-slate-300">
            v1.0.0-alpha
          </span>
        </div>

        <h1 className="font-sans text-3xl font-bold tracking-tight text-white mb-2">
          LabCircle Web
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The monorepo web client shell has been successfully initialized. Core UI and layout design
          will begin once the PRD and design systems are finalized.
        </p>

        <div className="space-y-3.5 border-t border-slate-800/80 pt-5 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Framework</span>
            <span className="font-semibold text-slate-200">Next.js 15 (App Router)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Styling</span>
            <span className="font-semibold text-slate-200">Tailwind CSS v4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Language</span>
            <span className="font-semibold text-slate-200">TypeScript</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Components Library</span>
            <span className="font-semibold text-slate-200">shadcn/ui (Configured)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
