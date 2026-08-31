export function WhyMeritloom() {
  return (
    <section aria-labelledby="why-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column: Mission Narrative */}
          <div className="flex flex-col items-start gap-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Our Purpose
            </span>
            <h2 id="why-heading" className="heading-2 text-ink">
              Why Meritloom exists
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted">
              <p>
                There is more high-quality learning material online today than ever before. But finding a useful video is not the same as having a clear learning journey.
              </p>
              <p>
                Learners often move between random tutorials, disjointed playlists, and blog posts without knowing:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-ink/90 font-medium text-xs sm:text-sm">
                <li>What to learn first</li>
                <li>What comes next in the sequence</li>
                <li>What they actually understood vs passively watched</li>
                <li>Where they stopped when returning days later</li>
                <li>How different foundational skills connect to build real projects</li>
              </ul>
              <p>
                Meritloom is designed specifically to organize that learning experience into a calm, focused environment.
              </p>
            </div>
          </div>

          {/* Right Column: Abstract Before vs After Visual */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Before: Without Structure */}
            <div className="flex flex-col rounded-[22px] border border-dashed border-line bg-card/60 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Without Structure</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded">Scattered</span>
              </div>
              <div className="mt-4 flex flex-col gap-2 relative">
                <div className="p-2.5 rounded-lg border border-line bg-surface/80 text-xs text-muted">
                  Random Video Playlist
                </div>
                <div className="p-2.5 rounded-lg border border-line bg-surface/80 text-xs text-muted ml-3">
                  Disconnected Article
                </div>
                <div className="p-2.5 rounded-lg border border-line bg-surface/80 text-xs text-muted">
                  Passive Tutorial
                </div>
                <div className="p-2.5 rounded-lg border border-line bg-surface/80 text-xs text-muted ml-2">
                  Unclear Next Step
                </div>
              </div>
            </div>

            {/* After: With Meritloom */}
            <div className="flex flex-col rounded-[22px] border border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-5 shadow-soft ring-1 ring-primary/20">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">With Meritloom</span>
                <span className="text-[10px] font-bold text-mint-ink bg-mint/30 px-2 py-0.5 rounded">Organized</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold text-ink">
                  1. Structured Course
                </div>
                <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold text-ink">
                  2. Bite-sized Lessons
                </div>
                <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold text-ink">
                  3. Practical Checkpoint
                </div>
                <div className="p-2 rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold text-ink">
                  4. Capstone Project
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
