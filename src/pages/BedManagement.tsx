import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Activity, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Available: "bg-success/20 text-success border-success/30",
  Occupied: "bg-destructive/15 text-destructive border-destructive/30",
  Maintenance: "bg-warning/20 text-warning border-warning/30",
};

const BedManagement = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wardForm, setWardForm] = useState({ name: "", type: "General", floor: "1", rate: "0" });
  const [bedForm, setBedForm] = useState({ wardId: "", bedNumber: "" });
  const [wardOpen, setWardOpen] = useState(false);
  const [bedOpen, setBedOpen] = useState(false);

  const fetch = async () => {
    const [w, b] = await Promise.all([
      supabase.from("wards").select("*").order("name"),
      supabase.from("beds").select("*, wards(name)").order("bed_number"),
    ]);
    setWards(w.data || []);
    setBeds(b.data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const addWard = async () => {
    const { error } = await supabase.from("wards").insert({
      name: wardForm.name, ward_type: wardForm.type, floor: parseInt(wardForm.floor), rate_per_day: parseFloat(wardForm.rate)
    });
    if (error) { toast.error(error.message); return; }
    setWardForm({ name: "", type: "General", floor: "1", rate: "0" });
    setWardOpen(false);
    toast.success("Ward added");
    fetch();
  };

  const addBed = async () => {
    const { error } = await supabase.from("beds").insert({ ward_id: bedForm.wardId, bed_number: bedForm.bedNumber });
    if (error) { toast.error(error.message); return; }
    setBedForm({ wardId: "", bedNumber: "" });
    setBedOpen(false);
    toast.success("Bed added");
    fetch();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  // Group beds by ward
  const bedsByWard = wards.map(w => ({
    ...w,
    beds: beds.filter(b => b.ward_id === w.id),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-3">
        <Dialog open={wardOpen} onOpenChange={setWardOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Ward</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Ward</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={wardForm.name} onChange={e => setWardForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Type</Label>
                <Select value={wardForm.type} onValueChange={v => setWardForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["General","Semi-Private","Private","ICU","NICU","Pediatric"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Floor</Label><Input type="number" value={wardForm.floor} onChange={e => setWardForm(f => ({ ...f, floor: e.target.value }))} /></div>
              <div><Label>Rate/Day (₹)</Label><Input type="number" value={wardForm.rate} onChange={e => setWardForm(f => ({ ...f, rate: e.target.value }))} /></div>
              <Button onClick={addWard} className="w-full">Add Ward</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={bedOpen} onOpenChange={setBedOpen}>
          <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="mr-1.5 h-4 w-4" />Add Bed</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Bed</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Ward</Label>
                <Select value={bedForm.wardId} onValueChange={v => setBedForm(f => ({ ...f, wardId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                  <SelectContent>{wards.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Bed Number</Label><Input value={bedForm.bedNumber} onChange={e => setBedForm(f => ({ ...f, bedNumber: e.target.value }))} placeholder="e.g., 101" /></div>
              <Button onClick={addBed} className="w-full">Add Bed</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {bedsByWard.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No wards configured. Add a ward to get started.</p>
      ) : (
        bedsByWard.map(w => (
          <Card key={w.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{w.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{w.ward_type} · Floor {w.floor} · ₹{w.rate_per_day}/day</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {w.beds.filter((b: any) => b.status === "Available").length}/{w.beds.length} available
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {w.beds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No beds in this ward</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {w.beds.map((b: any) => (
                    <div key={b.id} className={cn("flex flex-col items-center justify-center rounded-lg border p-3 text-center text-xs", statusColors[b.status] || "")}>
                      <span className="font-bold">{b.bed_number}</span>
                      <span className="mt-0.5">{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default BedManagement;
