import { skills, skillCategories } from '@/data/skills';

const colorMap = {
  blue: {
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    heading: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  },
  purple: {
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    heading: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },
  green: {
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    heading: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  orange: {
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/5',
    heading: 'text-orange-400',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  },
  red: {
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    heading: 'text-red-400',
    badge: 'bg-red-500/10 text-red-300 border-red-500/20',
  },
  slate: {
    border: 'border-slate-500/20',
    bg: 'bg-slate-500/5',
    heading: 'text-slate-400',
    badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  },
};

export default function SkillsGrid() {
  return (
    <section className="py-20 bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Technologies I use to build, deploy, and maintain production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat) => {
            const c = colorMap[cat.color];
            const catSkills = skills.filter((s) => s.category === cat.key);
            return (
              <div
                key={cat.key}
                className={`rounded-xl border ${c.border} ${c.bg} p-6 backdrop-blur-sm`}
              >
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${c.heading}`}>
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${c.badge}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
