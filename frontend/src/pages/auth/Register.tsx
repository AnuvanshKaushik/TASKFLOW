import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

const signals = ["First account becomes Admin", "JWT session persistence", "Role-aware workspace"];

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterValues>();

  const submit = handleSubmit(async (values) => {
    try {
      await registerAccount(values);
      notify({ type: "success", title: "Workspace created", description: "TaskFlow AI is ready to run." });
      navigate("/");
    } catch (error) {
      notify({ type: "error", title: "Signup failed", description: getApiErrorMessage(error) });
    }
  });

  return (
    <main className="min-h-screen overflow-hidden bg-cloud bg-app-grid bg-[length:32px_32px] text-ink dark:bg-ink dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="grid place-items-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:p-8"
          >
            <div className="mb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-aurora-strip shadow-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-black">Create workspace</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Start with a secure account and invite your team after login.
              </p>
            </div>

            <form className="grid gap-5" onSubmit={submit}>
              <Input
                label="Name"
                placeholder="Alex Morgan"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Use at least 2 characters" }
                })}
              />
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
                placeholder="At least 8 chars, upper, lower, number"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Use at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Include uppercase, lowercase, and a number"
                  }
                })}
              />
              <Button type="submit" size="lg" loading={isSubmitting}>
                Create account
                {!isSubmitting ? <ArrowRight className="h-5 w-5" /> : null}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-violet hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </section>

        <section className="relative hidden items-center justify-center p-10 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <h1 className="text-6xl font-black leading-[0.95] tracking-normal">
              A task manager that feels designed, not assembled.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              Build projects, assign ownership, and watch delivery health evolve through animated
              analytics.
            </p>
            <div className="mt-10 grid gap-4">
              {signals.map((signal, index) => (
                <motion.div
                  key={signal}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.08 }}
                  className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold">{signal}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

