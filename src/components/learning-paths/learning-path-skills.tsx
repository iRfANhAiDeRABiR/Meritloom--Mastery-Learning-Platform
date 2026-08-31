interface LearningPathSkillsProps {
  skills: string[];
}

export function LearningPathSkills({ skills }: LearningPathSkillsProps) {
  return (
    <section aria-labelledby="skills-heading" className="py-12 sm:py-16 transition-colors">
      <div className="container-page flex flex-col items-center text-center">
        <h2 id="skills-heading" className="text-sm font-extrabold uppercase tracking-wider text-muted">
          Skills you&apos;ll build
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-2xl">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full border border-line bg-card px-4 py-2 text-xs sm:text-sm font-bold text-ink shadow-xs transition-colors hover:border-primary/40 hover:text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
