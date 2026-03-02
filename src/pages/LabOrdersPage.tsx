import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, Plus } from "lucide-react";

const LabOrdersPage = () => {
  const [labTests, setLabTests] = useState<any[]>([]);
  const [labOrders, setLabOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testOpen, setTestOpen] = useState(false);
  const [testForm, setTestForm] = useState({ name: "", code: "", category: "", price: "0" });

  const fetch = async () => {
    const [tests, orders] = await Promise.all([
      supabase.from("lab_tests").select("*").order("test_name"),
      supabase.from("lab_orders").select("*, lab_tests(test_name, test_code), ordered_by_doctor:doctors!lab_orders_ordered_by_fkey(full_name), admissions(admission_code, patients(first_name, last_name))").order("created_at", { ascending: false }).limit(50),
    ]);
    setLabTests(tests.data || []);
    setLabOrders(orders.data || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const addTest = async () => {
    const { error } = await supabase.from("lab_tests").insert({
      test_name: testForm.name, test_code: testForm.code, category: testForm.category || null, unit_price: parseFloat(testForm.price)
    });
    if (error) { toast.error(error.message); return; }
    setTestForm({ name: "", code: "", category: "", price: "0" });
    setTestOpen(false);
    toast.success("Lab test added");
    fetch();
  };

  const updateStatus = async (orderId: string, status: string, result?: string) => {
    const update: any = { status };
    if (result !== undefined) update.result = result;
    if (status === "Completed") update.result_date = new Date().toISOString();
    await supabase.from("lab_orders").update(update).eq("id", orderId);
    toast.success("Status updated");
    fetch();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">Lab Tests Catalog & Orders</h3>
        <Dialog open={testOpen} onOpenChange={setTestOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Lab Test</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Lab Test</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Test Name</Label><Input value={testForm.name} onChange={e => setTestForm(f => ({ ...f, name: e.target.value }))} placeholder="Complete Blood Count" /></div>
              <div><Label>Test Code</Label><Input value={testForm.code} onChange={e => setTestForm(f => ({ ...f, code: e.target.value }))} placeholder="CBC" /></div>
              <div><Label>Category</Label><Input value={testForm.category} onChange={e => setTestForm(f => ({ ...f, category: e.target.value }))} placeholder="Hematology" /></div>
              <div><Label>Price (₹)</Label><Input type="number" value={testForm.price} onChange={e => setTestForm(f => ({ ...f, price: e.target.value }))} /></div>
              <Button onClick={addTest} className="w-full">Add Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {labOrders.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No lab orders yet</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Patient</th><th className="px-4 py-3 font-medium">Test</th><th className="px-4 py-3 font-medium">Ordered By</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {labOrders.map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{o.admissions?.patients?.first_name} {o.admissions?.patients?.last_name}</td>
                    <td className="px-4 py-3 font-medium">{o.lab_tests?.test_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.ordered_by_doctor?.full_name}</td>
                    <td className="px-4 py-3"><Badge variant={o.status === "Completed" ? "default" : "outline"}>{o.status}</Badge></td>
                    <td className="px-4 py-3">{o.result || "—"}</td>
                    <td className="px-4 py-3">
                      {o.status === "Pending" && <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, "In Progress")}>Start</Button>}
                      {o.status === "In Progress" && (
                        <Button size="sm" variant="outline" onClick={() => {
                          const result = prompt("Enter result:");
                          if (result) updateStatus(o.id, "Completed", result);
                        }}>Complete</Button>
                      )}
                    </td>
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

export default LabOrdersPage;
