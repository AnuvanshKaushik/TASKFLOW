import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../services/api";
import { userService } from "../services/userService";
import { initials } from "../utils/formatters";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";

type ProfileValues = {
  name: string;
};

export const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, setCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notify } = useToast();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileValues>({
    defaultValues: {
      name: user?.name ?? ""
    }
  });

  const submit = handleSubmit(async (values) => {
    try {
      setSaving(true);
      const updated = await userService.updateProfile(values.name);
      setCurrentUser(updated);
      notify({ type: "success", title: "Profile updated" });
    } catch (error) {
      notify({ type: "error", title: "Profile update failed", description: getApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
      <section className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <div className="grid place-items-center text-center">
          <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-ink text-3xl font-black text-white shadow-soft dark:bg-white dark:text-ink">
            {initials(user?.name ?? "TF")}
          </div>
          <h2 className="mt-5 text-2xl font-black text-ink dark:text-white">{user?.name}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          <Badge className="mt-4 bg-violet/10 text-violet ring-violet/20 dark:bg-violet/20 dark:text-violet-100">
            {user?.role}
          </Badge>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-aurora-strip">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-violet">Profile</p>
              <h2 className="text-xl font-black text-ink dark:text-white">Identity details</h2>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <Input
              label="Display name"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Use at least 2 characters" }
              })}
            />
            <div>
              <Button type="submit" loading={saving}>
                Save profile
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase text-mint">Appearance</p>
              <h2 className="text-xl font-black text-ink dark:text-white">Theme preference</h2>
            </div>
            <Button type="button" variant="secondary" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase text-coral">Session</p>
              <h2 className="text-xl font-black text-ink dark:text-white">Account access</h2>
            </div>
            <Button type="button" variant="danger" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

