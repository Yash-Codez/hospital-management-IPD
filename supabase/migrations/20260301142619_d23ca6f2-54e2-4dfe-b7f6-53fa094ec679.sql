-- ===============================
-- DEMO MODE: Allow anon access
-- ===============================

-- WARDS
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Demo allow all on wards" ON public.wards;
CREATE POLICY "Demo allow all on wards"
ON public.wards
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- BEDS
DROP POLICY IF EXISTS "Demo allow all on beds" ON public.beds;
CREATE POLICY "Demo allow all on beds"
ON public.beds
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- PATIENTS
DROP POLICY IF EXISTS "Demo allow all on patients" ON public.patients;
CREATE POLICY "Demo allow all on patients"
ON public.patients
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- DOCTORS
DROP POLICY IF EXISTS "Demo allow all on doctors" ON public.doctors;
CREATE POLICY "Demo allow all on doctors"
ON public.doctors
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ADMISSIONS
DROP POLICY IF EXISTS "Demo allow all on admissions" ON public.admissions;
CREATE POLICY "Demo allow all on admissions"
ON public.admissions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- DOCTOR ASSIGNMENTS
DROP POLICY IF EXISTS "Demo allow all on doctor_assignments" ON public.doctor_assignments;
CREATE POLICY "Demo allow all on doctor_assignments"
ON public.doctor_assignments
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- PROGRESS NOTES
DROP POLICY IF EXISTS "Demo allow all on progress_notes" ON public.progress_notes;
CREATE POLICY "Demo allow all on progress_notes"
ON public.progress_notes
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- MEDICATIONS
DROP POLICY IF EXISTS "Demo allow all on medications" ON public.medications;
CREATE POLICY "Demo allow all on medications"
ON public.medications
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- MEDICATION ORDERS
DROP POLICY IF EXISTS "Demo allow all on medication_orders" ON public.medication_orders;
CREATE POLICY "Demo allow all on medication_orders"
ON public.medication_orders
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- LAB TESTS
DROP POLICY IF EXISTS "Demo allow all on lab_tests" ON public.lab_tests;
CREATE POLICY "Demo allow all on lab_tests"
ON public.lab_tests
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- LAB ORDERS
DROP POLICY IF EXISTS "Demo allow all on lab_orders" ON public.lab_orders;
CREATE POLICY "Demo allow all on lab_orders"
ON public.lab_orders
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- BILLING ITEMS
DROP POLICY IF EXISTS "Demo allow all on billing_items" ON public.billing_items;
CREATE POLICY "Demo allow all on billing_items"
ON public.billing_items
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- PAYMENTS
DROP POLICY IF EXISTS "Demo allow all on payments" ON public.payments;
CREATE POLICY "Demo allow all on payments"
ON public.payments
FOR ALL
TO anon
USING (true)
WITH CHECK (true);