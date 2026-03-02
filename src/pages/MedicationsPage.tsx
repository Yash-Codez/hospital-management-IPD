import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Activity, Plus } from "lucide-react";

const MedicationsPage = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", genericName: "", category: "", unit: "mg", unitPrice: "0" });

  const fetch = async () => {
    const { data } = await supabase.from("medications").select("*").order("name");
    setMedications(data || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const add = async () => {
    const { error } = await supabase.from("medications").insert({
      name: form.name, generic_name: form.genericName || null, category: form.category || null, unit: form.unit, unit_price: parseFloat(form.unitPrice)
    });
    if (error) { toast.error(error.message); return; }
    setForm({ name: "", genericName: "", category: "", unit: "mg", unitPrice: "0" });
    setOpen(false);
    toast.success("Medication added");
    fetch();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Medication</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Medication</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Amoxicillin" /></div>
              <div><Label>Generic Name</Label><Input value={form.genericName} onChange={e => setForm(f => ({ ...f, genericName: e.target.value }))} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Antibiotic" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></div>
                <div><Label>Price (₹)</Label><Input type="number" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} /></div>
              </div>
              <Button onClick={add} className="w-full">Add Medication</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {medications.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No medications. Add some to get started.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Generic</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Unit</th><th className="px-4 py-3 font-medium text-right">Price</th>
              </tr></thead>
              <tbody>
                {medications.map(m => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{m.name}</td><td className="px-4 py-3 text-muted-foreground">{m.generic_name || "—"}</td>
                    <td className="px-4 py-3">{m.category || "—"}</td><td className="px-4 py-3">{m.unit}</td>
                    <td className="px-4 py-3 text-right">₹{Number(m.unit_price).toLocaleString()}</td>
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

export default MedicationsPage;
