import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Activity, FileText, FlaskConical, Pill, Receipt, UserMinus } from "lucide-react";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userName, userRole } = useAuth();
  const [admission, setAdmission] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [medOrders, setMedOrders] = useState<any[]>([]);
  const [labOrders, setLabOrders] = useState<any[]>([]);
  const [billingItems, setBillingItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [noteText, setNoteText] = useState("");
  const [medForm, setMedForm] = useState({ medicationId: "", dosage: "", frequency: "", duration: "", notes: "" });
  const [labForm, setLabForm] = useState({ labTestId: "", notes: "" });
  const [billingForm, setBillingForm] = useState({ category: "Procedure" as string, description: "", quantity: "1", unitPrice: "0" });
  const [paymentForm, setPaymentForm] = useState({ amount: "", method: "Cash", notes: "" });
  const [dischargeSummary, setDischargeSummary] = useState("");

  const fetchAll = async () => {
    if (!id) return;
    const [adm, n, mo, lo, bi, pay, meds, tests, docs] = await Promise.all([
      supabase.from("admissions").select("*, patients(*), doctors(full_name, specialization), wards(name, ward_type, rate_per_day), beds(bed_number)").eq("id", id).single(),
      supabase.from("progress_notes").select("*").eq("admission_id", id).order("created_at", { ascending: false }),
      supabase.from("medication_orders").select("*, medications(name, unit), ordered_by_doctor:doctors!medication_orders_ordered_by_fkey(full_name)").eq("admission_id", id).order("created_at", { ascending: false }),
      supabase.from("lab_orders").select("*, lab_tests(test_name, test_code), ordered_by_doctor:doctors!lab_orders_ordered_by_fkey(full_name)").eq("admission_id", id).order("created_at", { ascending: false }),
      supabase.from("billing_items").select("*").eq("admission_id", id).order("created_at", { ascending: false }),
      supabase.from("payments").select("*").eq("admission_id", id).order("created_at", { ascending: false }),
      supabase.from("medications").select("*"),
      supabase.from("lab_tests").select("*"),
      supabase.from("doctors").select("*").eq("is_active", true),
    ]);
    setAdmission(adm.data);
    setNotes(n.data || []);
    setMedOrders(mo.data || []);
    setLabOrders(lo.data || []);
    setBillingItems(bi.data || []);
    setPayments(pay.data || []);
    setMedications(meds.data || []);
    setLabTests(tests.data || []);
    setDoctors(docs.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const addNote = async () => {
    if (!noteText.trim() || !user) return;
    await supabase.from("progress_notes").insert({
      admission_id: id, author_id: user.id, author_name: userName || "Staff", author_role: userRole || "nurse", note: noteText.trim()
    });
    setNoteText("");
    toast.success("Note added");
    fetchAll();
  };

  const addMedOrder = async () => {
    if (!medForm.medicationId || !medForm.dosage || !medForm.frequency || !medForm.duration) return;
    const doctor = admission?.doctor_id;
    await supabase.from("medication_orders").insert({
      admission_id: id, medication_id: medForm.medicationId, dosage: medForm.dosage, frequency: medForm.frequency,
      duration: medForm.duration, ordered_by: doctor, notes: medForm.notes || null
    });
    const med = medications.find(m => m.id === medForm.medicationId);
    if (med) {
      await supabase.from("billing_items").insert({
        admission_id: id, category: "Medication" as any, description: `${med.name} - ${medForm.dosage}`, quantity: 1, unit_price: med.unit_price, total_price: med.unit_price
      });
    }
    setMedForm({ medicationId: "", dosage: "", frequency: "", duration: "", notes: "" });
    toast.success("Medication order added");
    fetchAll();
  };

  const addLabOrder = async () => {
    if (!labForm.labTestId) return;
    const doctor = admission?.doctor_id;
    await supabase.from("lab_orders").insert({
      admission_id: id, lab_test_id: labForm.labTestId, ordered_by: doctor, notes: labForm.notes || null
    });
    const test = labTests.find(t => t.id === labForm.labTestId);
    if (test) {
      await supabase.from("billing_items").insert({
        admission_id: id, category: "Lab" as any, description: test.test_name, quantity: 1, unit_price: test.unit_price, total_price: test.unit_price
      });
    }
    setLabForm({ labTestId: "", notes: "" });
    toast.success("Lab order placed");
    fetchAll();
  };

  const addBillingItem = async () => {
    const total = parseFloat(billingForm.quantity) * parseFloat(billingForm.unitPrice);
    await supabase.from("billing_items").insert({
      admission_id: id, category: billingForm.category as any, description: billingForm.description, quantity: parseFloat(billingForm.quantity), unit_price: parseFloat(billingForm.unitPrice), total_price: total
    });
    setBillingForm({ category: "Procedure", description: "", quantity: "1", unitPrice: "0" });
    toast.success("Billing item added");
    fetchAll();
  };

  const addPayment = async () => {
    if (!paymentForm.amount) return;
    await supabase.from("payments").insert({
      admission_id: id, amount: parseFloat(paymentForm.amount), payment_method: paymentForm.method as any,
      receipt_number: `RCP-${Date.now().toString(36).toUpperCase()}`, notes: paymentForm.notes || null
    });
    setPaymentForm({ amount: "", method: "Cash", notes: "" });
    toast.success("Payment recorded");
    fetchAll();
  };

  const handleDischarge = async () => {
    if (!admission) return;
    // Calculate room charges
    const days = Math.max(1, Math.ceil((Date.now() - new Date(admission.admission_date).getTime()) / 86400000));
    const roomRate = admission.wards?.rate_per_day || 0;
    await supabase.from("billing_items").insert({
      admission_id: id, category: "Room" as any, description: `Room charges (${days} days)`, quantity: days, unit_price: roomRate, total_price: days * roomRate
    });
    // Update admission
    await supabase.from("admissions").update({ status: "Discharged" as any, discharge_date: new Date().toISOString(), discharge_summary: dischargeSummary || null }).eq("id", id);
    // Free bed
    await supabase.from("beds").update({ status: "Available" as any }).eq("id", admission.bed_id);
    toast.success("Patient discharged successfully");
    fetchAll();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!admission) return <p className="py-12 text-center text-muted-foreground">Admission not found</p>;

  const totalBilled = billingItems.reduce((s, i) => s + (Number(i.total_price) || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const balance = totalBilled - totalPaid;
  const isAdmitted = admission.status === "Admitted";

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{admission.patients?.first_name} {admission.patients?.last_name}</h2>
              <Badge variant={isAdmitted ? "default" : "secondary"}>{admission.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {admission.admission_code} · {admission.patients?.patient_code} · {admission.wards?.name} / Bed {admission.beds?.bed_number}
            </p>
            <p className="text-sm text-muted-foreground">Doctor: {admission.doctors?.full_name} ({admission.doctors?.specialization})</p>
            <p className="text-sm text-muted-foreground">Admitted: {new Date(admission.admission_date).toLocaleString()}</p>
            {admission.discharge_date && <p className="text-sm text-muted-foreground">Discharged: {new Date(admission.discharge_date).toLocaleString()}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-2xl font-bold text-foreground">₹{totalBilled.toLocaleString()}</p>
            <p className={`text-sm font-medium ${balance > 0 ? "text-destructive" : "text-success"}`}>Balance: ₹{balance.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="notes">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notes"><FileText className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Notes</TabsTrigger>
          <TabsTrigger value="meds"><Pill className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Meds</TabsTrigger>
          <TabsTrigger value="labs"><FlaskConical className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Labs</TabsTrigger>
          <TabsTrigger value="billing"><Receipt className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Billing</TabsTrigger>
          <TabsTrigger value="discharge"><UserMinus className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />Discharge</TabsTrigger>
        </TabsList>

        {/* Progress Notes */}
        <TabsContent value="notes" className="space-y-4">
          {isAdmitted && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                <Textarea placeholder="Add a progress note..." value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} />
                <Button size="sm" onClick={addNote} disabled={!noteText.trim()}>Add Note</Button>
              </CardContent>
            </Card>
          )}
          {notes.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No notes yet</p> : (
            <div className="space-y-3">
              {notes.map(n => (
                <Card key={n.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{n.author_name}</span>
                      <Badge variant="outline" className="text-xs">{n.author_role}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{n.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Medications */}
        <TabsContent value="meds" className="space-y-4">
          {isAdmitted && medications.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">New Medication Order</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Select value={medForm.medicationId} onValueChange={v => setMedForm(f => ({ ...f, medicationId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select medication" /></SelectTrigger>
                  <SelectContent>{medications.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.unit})</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Dosage (e.g., 500mg)" value={medForm.dosage} onChange={e => setMedForm(f => ({ ...f, dosage: e.target.value }))} />
                <Input placeholder="Frequency (e.g., TID)" value={medForm.frequency} onChange={e => setMedForm(f => ({ ...f, frequency: e.target.value }))} />
                <Input placeholder="Duration (e.g., 7 days)" value={medForm.duration} onChange={e => setMedForm(f => ({ ...f, duration: e.target.value }))} />
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm" onClick={addMedOrder}>Add Order</Button>
                </div>
              </CardContent>
            </Card>
          )}
          {medOrders.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No medication orders</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Medication</th><th className="pb-2 font-medium">Dosage</th><th className="pb-2 font-medium">Frequency</th><th className="pb-2 font-medium">Duration</th><th className="pb-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {medOrders.map(o => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2">{o.medications?.name}</td><td className="py-2">{o.dosage}</td><td className="py-2">{o.frequency}</td><td className="py-2">{o.duration}</td>
                      <td className="py-2"><Badge variant={o.status === "Active" ? "default" : "secondary"}>{o.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Lab Orders */}
        <TabsContent value="labs" className="space-y-4">
          {isAdmitted && labTests.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">New Lab Order</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Select value={labForm.labTestId} onValueChange={v => setLabForm(f => ({ ...f, labTestId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select test" /></SelectTrigger>
                  <SelectContent>{labTests.map(t => <SelectItem key={t.id} value={t.id}>{t.test_name} ({t.test_code})</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Notes (optional)" value={labForm.notes} onChange={e => setLabForm(f => ({ ...f, notes: e.target.value }))} />
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm" onClick={addLabOrder}>Order Test</Button>
                </div>
              </CardContent>
            </Card>
          )}
          {labOrders.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No lab orders</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Test</th><th className="pb-2 font-medium">Code</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Result</th><th className="pb-2 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {labOrders.map(o => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2">{o.lab_tests?.test_name}</td><td className="py-2 text-muted-foreground">{o.lab_tests?.test_code}</td>
                      <td className="py-2"><Badge variant={o.status === "Completed" ? "default" : o.status === "Pending" ? "outline" : "secondary"}>{o.status}</Badge></td>
                      <td className="py-2">{o.result || "—"}</td>
                      <td className="py-2 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4"><p className="text-sm text-muted-foreground">Total Billed</p><p className="text-xl font-bold">₹{totalBilled.toLocaleString()}</p></Card>
            <Card className="p-4"><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-xl font-bold text-success">₹{totalPaid.toLocaleString()}</p></Card>
            <Card className="p-4"><p className="text-sm text-muted-foreground">Balance</p><p className={`text-xl font-bold ${balance > 0 ? "text-destructive" : "text-success"}`}>₹{balance.toLocaleString()}</p></Card>
          </div>

          {isAdmitted && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Add Charge</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Select value={billingForm.category} onValueChange={v => setBillingForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Room","Procedure","Medication","Lab","Consultation","Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Description" value={billingForm.description} onChange={e => setBillingForm(f => ({ ...f, description: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" placeholder="Qty" value={billingForm.quantity} onChange={e => setBillingForm(f => ({ ...f, quantity: e.target.value }))} />
                    <Input type="number" placeholder="Unit Price" value={billingForm.unitPrice} onChange={e => setBillingForm(f => ({ ...f, unitPrice: e.target.value }))} />
                  </div>
                  <Button size="sm" onClick={addBillingItem} className="w-full">Add Charge</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Record Payment</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input type="number" placeholder="Amount (₹)" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} />
                  <Select value={paymentForm.method} onValueChange={v => setPaymentForm(f => ({ ...f, method: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Cash","Card","Insurance","UPI","Bank Transfer"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Notes" value={paymentForm.notes} onChange={e => setPaymentForm(f => ({ ...f, notes: e.target.value }))} />
                  <Button size="sm" onClick={addPayment} className="w-full">Record Payment</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {billingItems.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Itemized Charges</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Description</th><th className="px-4 py-2 font-medium">Category</th><th className="px-4 py-2 font-medium text-right">Qty</th><th className="px-4 py-2 font-medium text-right">Rate</th><th className="px-4 py-2 font-medium text-right">Total</th>
                  </tr></thead>
                  <tbody>
                    {billingItems.map(i => (
                      <tr key={i.id} className="border-b last:border-0">
                        <td className="px-4 py-2">{i.description}</td><td className="px-4 py-2"><Badge variant="outline">{i.category}</Badge></td>
                        <td className="px-4 py-2 text-right">{i.quantity}</td><td className="px-4 py-2 text-right">₹{Number(i.unit_price).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-medium">₹{Number(i.total_price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Discharge */}
        <TabsContent value="discharge" className="space-y-4">
          {isAdmitted ? (
            <Card>
              <CardHeader><CardTitle className="text-base">Discharge Patient</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <p><span className="font-medium">Days admitted:</span> {Math.max(1, Math.ceil((Date.now() - new Date(admission.admission_date).getTime()) / 86400000))}</p>
                  <p><span className="font-medium">Room rate:</span> ₹{admission.wards?.rate_per_day}/day</p>
                  <p><span className="font-medium">Estimated room charges:</span> ₹{(Math.max(1, Math.ceil((Date.now() - new Date(admission.admission_date).getTime()) / 86400000)) * (admission.wards?.rate_per_day || 0)).toLocaleString()}</p>
                  <p><span className="font-medium">Current balance:</span> <span className={balance > 0 ? "text-destructive font-medium" : "text-success"}>₹{balance.toLocaleString()}</span></p>
                </div>
                <div>
                  <Label>Discharge Summary</Label>
                  <Textarea value={dischargeSummary} onChange={e => setDischargeSummary(e.target.value)} rows={5} placeholder="Enter discharge summary, instructions, follow-up..." />
                </div>
                <Button variant="destructive" onClick={handleDischarge}>
                  <UserMinus className="mr-1.5 h-4 w-4" />Discharge Patient
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="font-medium">Patient has been discharged</p>
                {admission.discharge_summary && (
                  <div className="mt-3 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-1">Discharge Summary</p>
                    <p className="text-sm whitespace-pre-wrap">{admission.discharge_summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdmissionDetails;
