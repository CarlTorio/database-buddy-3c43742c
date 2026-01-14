-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  join_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  expiration_date TEXT NOT NULL,
  last_payment TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create membership_applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT,
  applied_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for public booking/application forms)
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert membership applications" 
ON public.membership_applications 
FOR INSERT 
WITH CHECK (true);

-- Create public select policies for admin access (temporarily public for demo)
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view members" 
ON public.members 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view membership applications" 
ON public.membership_applications 
FOR SELECT 
USING (true);

-- Allow updates and inserts on members table
CREATE POLICY "Anyone can insert members" 
ON public.members 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update members" 
ON public.members 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can update membership applications" 
ON public.membership_applications 
FOR UPDATE 
USING (true);