import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import type { Role } from "../../types";

type LoginValues = {
  email: string;
  password: string;
};

type LoginProps = {
  role: Role;
};

const portalCopy = {
  Admin: {
    title: "Admin Login",
    eyebrow: "Control room access",
    description: "Sign in to manage projects, assign work, update roles, and inspect delivery analytics.",
    button: "Enter admin portal",
    icon: ShieldCheck,
    oppositeLabel: "Member login",
    oppositeHref: "/member-login",
    toast: "Admin workspace ready"
  },
  Member: {
    title: "Member Login",
    eyebrow: "Focus lane access",
    description: "Sign in to view assigned projects, update your task status, and track team progress.",
    button: "Enter member portal",
    icon: UserRound,
    oppositeLabel: "Admin login",
    oppositeHref: "/admin-login",
    toast: "Member workspace ready"
  }
};

export const Login = ({ role }: LoginProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notify } = useToast();
  const copy = portalCopy[role];
  const PortalIcon = copy.icon;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>();

  const submit = handleSubmit(async (values) => {
    try {
      await login(values, role);
      notify({ type: "success", title: "Welcome back", description: copy.toast });
      navigate("/");
    } catch (error) {
      notify({ type: "error", title: `${role} login failed`, description: getApiErrorMessage(error) });
    }
  });

  return (
    <main className="min-h-screen overflow-hidden bg-cloud bg-app-grid bg-[length:32px_32px] text-ink dark:bg-ink dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden items-center justify-center p-10 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-violet shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
              <PortalIcon className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <h1 className="mt-8 text-6xl font-black leading-[0.95] tracking-normal">
              {role === "Admin" ? "Lead the workspace without losing the signal." : "Move your work with clarity and pace."}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              {copy.description}
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {(role === "Admin" ? ["Projects", "Team", "Analytics"] : ["Tasks", "Progress", "Focus"]).map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <p className="text-2xl font-black">{index + 1}</p>
                  <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid place-items-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:p-8"
          >
            <div className="mb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-aurora-strip shadow-soft">
                <PortalIcon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-black">{copy.title}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {copy.description}
              </p>
            </div>

            {role === "Admin" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                  Admin Credentials
                </p>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">Email</p>
                    <p className="font-mono font-bold text-amber-900 dark:text-amber-100">
                      mainuser@gmail.com
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">Password</p>
                    <p className="font-mono font-bold text-amber-900 dark:text-amber-100">
                      Ani@2610
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <form className="grid gap-5" onSubmit={submit}>
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Use a valid email" }
                })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Your secure password"
                error={errors.password?.message}
                {...register("password", { required: "Password is required" })}
              />
              <Button type="submit" size="lg" loading={isSubmitting}>
                {copy.button}
                {!isSubmitting ? <ArrowRight className="h-5 w-5" /> : null}
              </Button>
            </form>

            <div className="mt-6 grid gap-2 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>
                Wrong portal?{" "}
                <Link to={copy.oppositeHref} className="font-bold text-violet hover:underline">
                  {copy.oppositeLabel}
                </Link>
              </p>
              <p>
                New workspace?{" "}
              <Link to="/register" className="font-bold text-violet hover:underline">
                Create your account
              </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};
