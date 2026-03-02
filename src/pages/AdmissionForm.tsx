import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity } from "lucide-react";

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const [form, setForm] = useState({
    patientId: "", isNewPatient: false,
    firstName: "", lastName: "", dob: "", gender: "Male", phone: "", email: "", address: "",
    emergencyName: "", emergencyPhone: "", bloodGroup: "",
    doctorId: "", wardId: "", bedId: "", reason: "", advancePayment: "0",
  });

  useEffect(() => {
    const load = async () => {
      const [d, w, p] = await Promise.all([
        supabase.from("doctors").select("*").eq("is_active", true),
        supabase.from("wards").select("*").eq("is_active", true),
        supabase.from("patients").select("*").order("last_name"),
      ]);
      setDoctors(d.data || []);
      setWards(w.data || []);
      setPatients(p.data || []);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (form.wardId) {
      supabase.from("beds").select("*").eq("ward_id", form.wardId).eq("status", "Available")
        .then(({ data }) => setBeds(data || []));
    } else {
      setBeds([]);
    }
  }, [form.wardId]);

  const update = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let patientId = form.patientId;

      if (form.isNewPatient) {
        const code = `PAT-${Date.now().toString(36).toUpperCase()}`;
        const { data: newPat, error: patErr } = await supabase.from("patients").insert({
          patient_code: code,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          date_of_birth: form.dob || null,
          gender: form.gender,
          phone: form.phone || null,
          email: form.email || null,
          address: form.address || null,
          emergency_contact_name: form.emergencyName || null,
          emergency_contact_phone: form.emergencyPhone || null,
          blood_group: form.bloodGroup || null,
        }).select().single();
        if (patErr) throw patErr;
        patientId = newPat.id;
      }

      if (!patientId || !form.doctorId || !form.bedId || !form.wardId || !form.reason.trim()) {
        toast.error("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      const admCode = `ADM-${Date.now().toString(36).toUpperCase()}`;
      const { error: admErr } = await supabase.from("admissions").insert({
        admission_code: admCode,
        patient_id: patientId,
        doctor_id: form.doctorId,
        bed_id: form.bedId,
        ward_id: form.wardId,
        admission_reason: form.reason.trim(),
        advance_payment: parseFloat(form.advancePayment) || 0,
      });
      if (admErr) throw admErr;

      // Mark bed as occupied
      await supabase.from("beds").update({ status: "Occupied" as any }).eq("id", form.bedId);

      // Record doctor assignment
      const { data: adm } = await supabase.from("admissions").select("id").eq("admission_code", admCode).single();
      if (adm) {
        await supabase.from("doctor_assignments").insert({ admission_id: adm.id, doctor_id: form.doctorId });
      }

      // Record advance payment
      if (parseFloat(form.advancePayment) > 0 && adm) {
        await supabase.from("payments").insert({
          admission_id: adm.id,
          amount: parseFloat(form.advancePayment),
          payment_method: "Cash" as any,
          receipt_number: `RCP-${Date.now().toString(36).toUpperCase()}`,
          notes: "Advance payment at admission",
        });
      }

      toast.success("Patient admitted successfully!");
      navigate("/admissions");
    } catch (err: any) {
      toast.error(err.message || "Failed to admit patient");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      {/* Patient Selection */}
      <Card>
        <CardHeader><CardTitle className="text-base">Patient Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button type="button" variant={!form.isNewPatient ? "default" : "outline"} size="sm" onClick={() => update("isNewPatient", false)}>Existing Patient</Button>
            <Button type="button" variant={form.isNewPatient ? "default" : "outline"} size="sm" onClick={() => update("isNewPatient", true)}>New Patient</Button>
          </div>

          {!form.isNewPatient ? (
            <div>
              <Label>Select Patient *</Label>
              <Select value={form.patientId} onValueChange={v => update("patientId", v)}>
                <SelectTrigger><SelectValue placeholder="Choose patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.patient_code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>First Name *</Label><Input value={form.firstName} onChange={e => update("firstName", e.target.value)} required /></div>
              <div><Label>Last Name *</Label><Input value={form.lastName} onChange={e => update("lastName", e.target.value)} required /></div>
              <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} /></div>
              <div><Label>Gender</Label>
                <Select value={form.gender} onValueChange={v => update("gender", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={e => update("address", e.target.value)} rows={2} /></div>
              <div><Label>Emergency Contact Name</Label><Input value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} /></div>
              <div><Label>Emergency Contact Phone</Label><Input value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} /></div>
              <div><Label>Blood Group</Label><Input value={form.bloodGroup} onChange={e => update("bloodGroup", e.target.value)} placeholder="e.g., A+" /></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admission Details */}
      <Card>
        <CardHeader><CardTitle className="text-base">Admission Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Attending Doctor *</Label>
            <Select value={form.doctorId} onValueChange={v => update("doctorId", v)}>
              <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
              <SelectContent>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.full_name} — {d.specialization}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ward *</Label>
            <Select value={form.wardId} onValueChange={v => { update("wardId", v); update("bedId", ""); }}>
              <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
              <SelectContent>
                {wards.map(w => (
                  <SelectItem key={w.id} value={w.id}>{w.name} ({w.ward_type}) — ₹{w.rate_per_day}/day</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bed *</Label>
            <Select value={form.bedId} onValueChange={v => update("bedId", v)} disabled={!form.wardId}>
              <SelectTrigger><SelectValue placeholder={form.wardId ? `${beds.length} available` : "Select ward first"} /></SelectTrigger>
              <SelectContent>
                {beds.map(b => (
                  <SelectItem key={b.id} value={b.id}>Bed {b.bed_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Advance Payment (₹)</Label>
            <Input type="number" min="0" value={form.advancePayment} onChange={e => update("advancePayment", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Admission Reason *</Label>
            <Textarea value={form.reason} onChange={e => update("reason", e.target.value)} rows={3} required placeholder="Describe the reason for admission" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate("/admissions")}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Admitting..." : "Admit Patient"}</Button>
      </div>
    </form>
  );
};

export default AdmissionForm;
