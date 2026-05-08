import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, UserRound } from "lucide-react";

const portals = [
  {
    title: "Admin Login",
    description: "Manage projects, assign work, update roles, and review analytics.",
    href: "/admin-login",
    icon: ShieldCheck,
    accent: "text-violet"
  },
  {
    title: "Member Login",
    description: "View assigned projects, move your tasks, and track delivery progress.",
    href: "/member-login",
    icon: UserRound,
    accent: "text-emerald-600"
  }
];

export const LoginChoice = () => (
  <main className="min-h-screen overflow-hidden bg-cloud bg-app-grid bg-[length:32px_32px] text-ink dark:bg-ink dark:text-white">
    <section className="grid min-h-screen place-items-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-aurora-strip shadow-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-normal sm:text-6xl">
            Choose your TaskFlow AI portal.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Admins and members use different login paths so each person enters the correct workspace experience.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={portal.href}
                className="group block h-full rounded-[32px] border border-white/60 bg-white/80 p-7 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-soft dark:bg-white/10">
                    <portal.icon className={`h-7 w-7 ${portal.accent}`} />
                  </div>
                  <ArrowRight className="h-6 w-6 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet" />
                </div>
                <h2 className="mt-8 text-3xl font-black text-ink dark:text-white">{portal.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {portal.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{" "}
          <Link to="/register" className="font-bold text-violet hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </section>
  </main>
);

