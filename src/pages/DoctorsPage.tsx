import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Activity, Plus } from "lucide-react";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", specialization: "", phone: "", email: "" });

  const fetch = async () => {
    const { data } = await supabase.from("doctors").select("*").order("full_name");
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const addDoctor = async () => {
    const code = `DOC-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("doctors").insert({
      doctor_code: code, full_name: form.fullName, specialization: form.specialization, phone: form.phone || null, email: form.email || null
    });
    if (error) { toast.error(error.message); return; }
    setForm({ fullName: "", specialization: "", phone: "", email: "" });
    setOpen(false);
    toast.success("Doctor added");
    fetch();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Doctor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Doctor</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Dr. John Smith" /></div>
              <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} placeholder="Cardiology" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <Button onClick={addDoctor} className="w-full">Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {doctors.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No doctors registered</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Code</th><th className="px-4 py-3 font-medium">Specialization</th><th className="px-4 py-3 font-medium">Contact</th><th className="px-4 py-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{d.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.doctor_code}</td>
                    <td className="px-4 py-3">{d.specialization}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.phone || d.email || "—"}</td>
                    <td className="px-4 py-3"><Badge variant={d.is_active ? "default" : "secondary"}>{d.is_active ? "Active" : "Inactive"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsPage;
