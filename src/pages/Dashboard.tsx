import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import { Bed, CalendarPlus, ClipboardList, Users, Activity, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({ admitted: 0, availableBeds: 0, todayAdmissions: 0, totalDoctors: 0, pendingBills: 0, pendingLabs: 0 });
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [admitted, beds, todayAdm, doctors, recent] = await Promise.all([
        supabase.from("admissions").select("id", { count: "exact", head: true }).eq("status", "Admitted"),
        supabase.from("beds").select("id", { count: "exact", head: true }).eq("status", "Available"),
        supabase.from("admissions").select("id", { count: "exact", head: true }).gte("admission_date", today),
        supabase.from("doctors").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("admissions").select("*, patients(first_name, last_name), doctors(full_name), wards(name)").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        admitted: admitted.count || 0,
        availableBeds: beds.count || 0,
        todayAdmissions: todayAdm.count || 0,
        totalDoctors: doctors.count || 0,
        pendingBills: 0,
        pendingLabs: 0,
      });
      setRecentAdmissions(recent.data || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Currently Admitted" value={stats.admitted} icon={ClipboardList} variant="primary" />
        <StatCard title="Available Beds" value={stats.availableBeds} icon={Bed} variant="success" />
        <StatCard title="Today's Admissions" value={stats.todayAdmissions} icon={CalendarPlus} variant="info" />
        <StatCard title="Active Doctors" value={stats.totalDoctors} icon={Users} variant="warning" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Admissions</CardTitle>
          <Link to="/admissions" className="text-sm font-medium text-primary hover:underline">View All</Link>
        </CardHeader>
        <CardContent>
          {recentAdmissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No admissions yet. <Link to="/admit" className="text-primary hover:underline">Create one</Link></p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Patient</th>
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">Doctor</th>
                  <th className="pb-2 font-medium">Ward</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {recentAdmissions.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">
                        <Link to={`/admission/${a.id}`} className="text-primary hover:underline">
                          {a.patients?.first_name} {a.patients?.last_name}
                        </Link>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{a.admission_code}</td>
                      <td className="py-2.5">{a.doctors?.full_name}</td>
                      <td className="py-2.5">{a.wards?.name}</td>
                      <td className="py-2.5">
                        <Badge variant={a.status === "Admitted" ? "default" : "secondary"}>{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
