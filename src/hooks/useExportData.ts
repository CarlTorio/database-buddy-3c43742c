import { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExportData {
  bookings: any[];
  members: any[];
  patientRecords: any[];
  transactions: any[];
  benefits: any[];
  benefitClaims: any[];
  referralRewards: any[];
}

export const useExportData = () => {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (date: string | null): string => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return date;
    }
  };

  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return '';
    return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateDaysRemaining = (expiryDate: string | null): number | string => {
    if (!expiryDate) return '';
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchAllData = async (): Promise<ExportData> => {
    const [
      { data: bookings },
      { data: members },
      { data: patientRecords },
      { data: transactions },
      { data: benefits },
      { data: benefitClaims },
      { data: referralRewards }
    ] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('patient_records').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('membership_benefits').select('*').order('membership_type', { ascending: true }),
      supabase.from('member_benefit_claims').select('*').order('claimed_at', { ascending: false }),
      supabase.from('referral_rewards').select('*').order('created_at', { ascending: false })
    ]);

    return {
      bookings: bookings || [],
      members: members || [],
      patientRecords: patientRecords || [],
      transactions: transactions || [],
      benefits: benefits || [],
      benefitClaims: benefitClaims || [],
      referralRewards: referralRewards || []
    };
  };

  const createBookingsSheet = (bookings: any[]): any[][] => {
    const headers = [
      'Booking Number', 'Name', 'Email', 'Phone', 'Membership Status',
      'Appointment Date', 'Appointment Time', 'Service/Message', 'Status',
      'Created Date', 'Last Updated'
    ];

    const rows = bookings.map((b, i) => [
      `BK-${String(i + 1).padStart(4, '0')}`,
      b.name,
      b.email,
      b.contact_number,
      b.membership || 'Non-member',
      formatDate(b.preferred_date),
      b.preferred_time,
      b.message || '',
      b.status,
      formatDate(b.created_at),
      formatDate(b.updated_at)
    ]);

    return [headers, ...rows];
  };

  const createMembersSheet = (members: any[]): any[][] => {
    const headers = [
      'Member ID', 'Name', 'Email', 'Phone', 'Membership Tier',
      'Status', 'Join Date', 'Expiration Date', 'Days Remaining',
      'Referral Code', 'Referred By', 'Referral Count', 'Payment Method', 'Amount Paid'
    ];

    const rows = members.map((m, i) => [
      `MEM-${String(i + 1).padStart(4, '0')}`,
      m.name,
      m.email,
      m.phone || '',
      m.membership_type,
      m.status,
      formatDate(m.membership_start_date),
      formatDate(m.membership_expiry_date),
      calculateDaysRemaining(m.membership_expiry_date),
      m.referral_code || '',
      m.referred_by || '',
      m.referral_count || 0,
      m.payment_method || '',
      formatCurrency(m.amount_paid)
    ]);

    return [headers, ...rows];
  };

  const createPatientRecordsSheet = (records: any[]): any[][] => {
    const headers = [
      'Patient ID', 'Name', 'Email', 'Phone', 'Date of Birth', 'Age', 'Gender',
      'Emergency Contact', 'Membership Tier', 'Membership Status',
      'Source', 'Notes (Summary)', 'Created Date', 'Last Updated'
    ];

    const rows = records.map((p, i) => [
      `PT-${String(i + 1).padStart(4, '0')}`,
      p.name,
      p.email,
      p.contact_number || '',
      formatDate(p.date_of_birth),
      p.age || '',
      p.gender || '',
      p.emergency_contact || '',
      p.membership || 'Non-member',
      p.membership_status || '',
      p.source,
      p.notes ? p.notes.substring(0, 200) : '',
      formatDate(p.created_at),
      formatDate(p.updated_at)
    ]);

    return [headers, ...rows];
  };

  const createTransactionsSheet = (transactions: any[], members: any[]): any[][] => {
    const memberMap = new Map(members.map(m => [m.id, m.name]));

    const headers = [
      'Transaction ID', 'Member Name', 'Description', 'Amount', 'Currency',
      'Payment Method', 'Payment Status', 'Transaction Type', 'Transaction Date', 'Notes'
    ];

    const rows = transactions.map((t, i) => [
      `TXN-${String(i + 1).padStart(4, '0')}`,
      memberMap.get(t.member_id) || 'Unknown',
      t.description || '',
      formatCurrency(t.amount),
      t.currency || 'PHP',
      t.payment_method,
      t.payment_status,
      t.transaction_type,
      formatDate(t.created_at),
      t.stripe_payment_intent_id ? `Stripe: ${t.stripe_payment_intent_id}` : ''
    ]);

    return [headers, ...rows];
  };

  const createReferralsSheet = (members: any[]): any[][] => {
    const memberMap = new Map(members.map(m => [m.referral_code, m]));
    
    const headers = [
      'Referrer Name', 'Referrer Code', 'Referred Member Name', 'Referred Member Email',
      'Referral Date', 'Referral Status', "Referrer's Total Referrals"
    ];

    const referrals = members
      .filter(m => m.referred_by)
      .map(m => {
        const referrer = memberMap.get(m.referred_by);
        return [
          referrer?.name || 'Unknown',
          m.referred_by,
          m.name,
          m.email,
          formatDate(m.created_at),
          m.status === 'active' ? 'Converted' : 'Pending',
          referrer?.referral_count || 0
        ];
      });

    return [headers, ...referrals];
  };

  const createBenefitsUsageSheet = (members: any[], benefits: any[], claims: any[]): any[][] => {
    const headers = [
      'Member Name', 'Membership Tier', 'Benefit Name', 'Used', 'Total Available', 'Usage Status'
    ];

    const rows: any[][] = [];

    members.filter(m => m.status === 'active').forEach(member => {
      const memberBenefits = benefits.filter(b => 
        b.membership_type.toLowerCase() === member.membership_type?.toLowerCase()
      );

      memberBenefits.forEach(benefit => {
        const usedCount = claims.filter(c => 
          c.member_id === member.id && c.benefit_id === benefit.id
        ).length;

        rows.push([
          member.name,
          member.membership_type,
          benefit.benefit_name,
          usedCount,
          benefit.total_quantity,
          usedCount >= benefit.total_quantity ? 'Fully Used' : 'Available'
        ]);
      });
    });

    return [headers, ...rows];
  };

  const createSummarySheet = (data: ExportData): any[][] => {
    const activeMembers = data.members.filter(m => m.status === 'active');
    const expiredMembers = data.members.filter(m => m.status === 'expired');
    const pendingMembers = data.members.filter(m => m.status === 'pending');
    
    const greenMembers = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'green').length;
    const goldMembers = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'gold').length;
    const platinumMembers = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'platinum').length;

    const totalRevenue = data.transactions
      .filter(t => t.payment_status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const bookingsByStatus = {
      pending: data.bookings.filter(b => b.status === 'pending').length,
      completed: data.bookings.filter(b => b.status === 'completed').length,
      cancelled: data.bookings.filter(b => b.status === 'cancelled').length,
      noShow: data.bookings.filter(b => b.status === 'no-show').length
    };

    const totalReferrals = data.members.reduce((sum, m) => sum + (m.referral_count || 0), 0);

    return [
      ['HILOMÈ CLINIC - DATA EXPORT SUMMARY'],
      ['Generated Date', formatDate(new Date().toISOString())],
      [''],
      ['=== BOOKINGS OVERVIEW ==='],
      ['Total Bookings', data.bookings.length],
      ['Pending Bookings', bookingsByStatus.pending],
      ['Completed Bookings', bookingsByStatus.completed],
      ['Cancelled Bookings', bookingsByStatus.cancelled],
      ['No-Show Bookings', bookingsByStatus.noShow],
      [''],
      ['=== MEMBERS OVERVIEW ==='],
      ['Total Members', data.members.length],
      ['Active Members', activeMembers.length],
      ['Expired Members', expiredMembers.length],
      ['Pending Applications', pendingMembers.length],
      [''],
      ['=== MEMBERSHIP BY TIER ==='],
      ['Green Members', greenMembers],
      ['Gold Members', goldMembers],
      ['Platinum Members', platinumMembers],
      [''],
      ['=== FINANCIAL OVERVIEW ==='],
      ['Total Revenue', formatCurrency(totalRevenue)],
      ['Total Transactions', data.transactions.length],
      [''],
      ['=== REFERRAL PROGRAM ==='],
      ['Total Referrals Made', totalReferrals],
      ['Members with Referrals', data.members.filter(m => (m.referral_count || 0) > 0).length],
      [''],
      ['=== PATIENT RECORDS ==='],
      ['Total Patient Records', data.patientRecords.length],
      ['Records from Bookings', data.patientRecords.filter(p => p.source === 'booking').length],
      ['Records from Membership', data.patientRecords.filter(p => p.source === 'membership').length],
      ['Manual Records', data.patientRecords.filter(p => p.source === 'manual').length]
    ];
  };

  const applySheetStyles = (ws: XLSX.WorkSheet, dataLength: number) => {
    // Set column widths
    ws['!cols'] = Array(15).fill({ wch: 20 });
    
    // Freeze first row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    return ws;
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      toast.info('Generating export file...', { duration: 2000 });
      
      // Fetch all data
      const data = await fetchAllData();

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create sheets
      const bookingsData = createBookingsSheet(data.bookings);
      const membersData = createMembersSheet(data.members);
      const patientData = createPatientRecordsSheet(data.patientRecords);
      const transactionsData = createTransactionsSheet(data.transactions, data.members);
      const referralsData = createReferralsSheet(data.members);
      const benefitsData = createBenefitsUsageSheet(data.members, data.benefits, data.benefitClaims);
      const summaryData = createSummarySheet(data);

      // Convert to worksheets and add to workbook
      const wsBookings = XLSX.utils.aoa_to_sheet(bookingsData);
      const wsMembers = XLSX.utils.aoa_to_sheet(membersData);
      const wsPatients = XLSX.utils.aoa_to_sheet(patientData);
      const wsTransactions = XLSX.utils.aoa_to_sheet(transactionsData);
      const wsReferrals = XLSX.utils.aoa_to_sheet(referralsData);
      const wsBenefits = XLSX.utils.aoa_to_sheet(benefitsData);
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

      // Apply column widths
      [wsBookings, wsMembers, wsPatients, wsTransactions, wsReferrals, wsBenefits, wsSummary].forEach(ws => {
        ws['!cols'] = Array(15).fill({ wch: 22 });
      });

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary Dashboard');
      XLSX.utils.book_append_sheet(wb, wsBookings, 'Bookings');
      XLSX.utils.book_append_sheet(wb, wsMembers, 'Members');
      XLSX.utils.book_append_sheet(wb, wsPatients, 'Patient Records');
      XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transactions');
      XLSX.utils.book_append_sheet(wb, wsReferrals, 'Referrals');
      XLSX.utils.book_append_sheet(wb, wsBenefits, 'Benefits Usage');

      // Generate filename with date
      const today = new Date().toISOString().split('T')[0];
      const filename = `hilome-data-export-${today}.xlsx`;

      // Write and download file
      XLSX.writeFile(wb, filename);

      toast.success('Export completed successfully!', {
        description: `Downloaded: ${filename}`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToExcel,
    isExporting
  };
};
