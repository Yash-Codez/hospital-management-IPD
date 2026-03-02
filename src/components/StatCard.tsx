import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "warning" | "success" | "info";
}

const variantStyles = {
  default: "bg-card border",
  primary: "bg-accent border border-primary/20",
  warning: "bg-warning/10 border border-warning/20",
  success: "bg-success/10 border border-success/20",
  info: "bg-info/10 border border-info/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/20 text-warning",
  success: "bg-success/20 text-success",
  info: "bg-info/20 text-info",
};

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => (
  <div className={cn("rounded-xl p-5 animate-fade-in", variantStyles[variant])}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
      </div>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconStyles[variant])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
