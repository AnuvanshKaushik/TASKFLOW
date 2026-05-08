import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban } from "lucide-react";
import { analyticsService } from "../services/analyticsService";
import { getApiErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { DashboardAnalytics } from "../types";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/dashboard/StatCard";
import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { ProjectPulse } from "../components/dashboard/ProjectPulse";
import { OverdueList } from "../components/dashboard/OverdueList";

const pieColors = ["#6750f5", "#ffb703", "#2ec4b6"];
const priorityColors = ["#2ec4b6", "#ffb703", "#ff715b"];

export const Dashboard = () => {
  const { notify } = useToast();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setAnalytics(await analyticsService.dashboard());
      } catch (error) {
        notify({ type: "error", title: "Dashboard unavailable", description: getApiErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [notify]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={analytics.stats.totalTasks}
          icon={<ClipboardList className="h-5 w-5" />}
          accent="violet"
        />
        <StatCard
          label="Completed"
          value={analytics.stats.completedTasks}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="mint"
        />
        <StatCard
          label="Projects"
          value={analytics.stats.activeProjects}
          icon={<FolderKanban className="h-5 w-5" />}
          accent="saffron"
        />
        <StatCard
          label="Overdue"
          value={analytics.stats.overdueTasks}
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="coral"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-violet">Completion analytics</p>
              <h2 className="text-xl font-black text-ink dark:text-white">Seven-day finish rhythm</h2>
            </div>
            <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-100">
              {analytics.stats.completionRate}% completion
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.completionTrend}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6750f5" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2ec4b6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" />
                <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    border: "0",
                    borderRadius: "18px",
                    boxShadow: "0 18px 60px rgba(20,22,33,0.14)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6750f5"
                  strokeWidth={3}
                  fill="url(#completedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-5">
            <p className="text-xs font-black uppercase text-coral">Task mix</p>
            <h2 className="text-xl font-black text-ink dark:text-white">Status distribution</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                >
                  {analytics.statusBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "0",
                    borderRadius: "18px",
                    boxShadow: "0 18px 60px rgba(20,22,33,0.14)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-5">
            <p className="text-xs font-black uppercase text-saffron">Priority load</p>
            <h2 className="text-xl font-black text-ink dark:text-white">Risk contour</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.priorityBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(103,80,245,0.06)" }}
                  contentStyle={{
                    border: "0",
                    borderRadius: "18px",
                    boxShadow: "0 18px 60px rgba(20,22,33,0.14)"
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                  {analytics.priorityBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={priorityColors[index % priorityColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {analytics.workload.length > 0 ? (
          <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mb-5">
              <p className="text-xs font-black uppercase text-mint">Team load</p>
              <h2 className="text-xl font-black text-ink dark:text-white">Assignment balance</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.workload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(46,196,182,0.06)" }}
                    contentStyle={{
                      border: "0",
                      borderRadius: "18px",
                      boxShadow: "0 18px 60px rgba(20,22,33,0.14)"
                    }}
                  />
                  <Bar dataKey="assigned" fill="#6750f5" radius={[12, 12, 4, 4]} />
                  <Bar dataKey="completed" fill="#2ec4b6" radius={[12, 12, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <ProjectPulse projects={analytics.projectProgress} />
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <OverdueList tasks={analytics.overdue} />
        <ActivityTimeline activities={analytics.activities} />
      </section>
    </motion.div>
  );
};

