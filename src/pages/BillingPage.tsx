import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const BillingPage = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("admissions")
        .select("*, patients(first_name, last_name), billing_items(total_price), payments(amount)")
        .order("created_at", { ascending: false });
      setAdmissions(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardContent className="p-0">
          {admissions.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No billing data</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Code</th><th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Billed</th><th className="px-4 py-3 font-medium text-right">Paid</th><th className="px-4 py-3 font-medium text-right">Balance</th>
              </tr></thead>
              <tbody>
                {admissions.map(a => {
                  const billed = (a.billing_items || []).reduce((s: number, i: any) => s + Number(i.total_price || 0), 0);
                  const paid = (a.payments || []).reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
                  const balance = billed - paid;
                  return (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/admission/${a.id}`} className="text-primary hover:underline">{a.patients?.first_name} {a.patients?.last_name}</Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.admission_code}</td>
                      <td className="px-4 py-3"><Badge variant={a.status === "Admitted" ? "default" : "secondary"}>{a.status}</Badge></td>
                      <td className="px-4 py-3 text-right">₹{billed.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-success">₹{paid.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-medium ${balance > 0 ? "text-destructive" : "text-success"}`}>₹{balance.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
