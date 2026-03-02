import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Plus, Search } from "lucide-react";

const AdmissionList = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("admissions")
      .select("*, patients(first_name, last_name, patient_code), doctors(full_name), wards(name), beds(bed_number)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setAdmissions(data || []); setLoading(false); });
  }, []);

  const filtered = admissions.filter(a => {
    const q = search.toLowerCase();
    return !q || `${a.patients?.first_name} ${a.patients?.last_name}`.toLowerCase().includes(q) ||
      a.admission_code?.toLowerCase().includes(q) ||
      a.patients?.patient_code?.toLowerCase().includes(q);
  });

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search patients or admission code..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Link to="/admit"><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />New Admission</Button></Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No admissions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Ward / Bed</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/admission/${a.id}`} className="text-primary hover:underline">
                          {a.patients?.first_name} {a.patients?.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.admission_code}</td>
                      <td className="px-4 py-3">{a.doctors?.full_name}</td>
                      <td className="px-4 py-3">{a.wards?.name} / Bed {a.beds?.bed_number}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(a.admission_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={a.status === "Admitted" ? "default" : a.status === "Discharged" ? "secondary" : "outline"}>
                          {a.status}
                        </Badge>
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

export default AdmissionList;
