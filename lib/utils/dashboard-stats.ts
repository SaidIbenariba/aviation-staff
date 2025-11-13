import professionalsData from "@/lib/data/professionals.json";
import jobSeekersData from "@/lib/data/job-seekers.json";
import jobOffersData from "@/lib/data/job-offers.json";
import inspirationsData from "@/lib/data/inspirations.json";
import jobSeekersPendingData from "@/lib/data/job-seekers-pending.json";
import professionalsPendingData from "@/lib/data/professional-pending.json";
import inspirationsPendingData from "@/lib/data/inspirations-pending.json";
import inspirationsRejectedData from "@/lib/data/inspirations-rejected.json";

export interface DashboardStats {
  professionals: {
    total: number;
    pending: number;
    trend: number;
  };
  jobSeekers: {
    total: number;
    pending: number;
    rejected: number;
    trend: number;
  };
  jobOffers: {
    total: number;
    active: number;
    trend: number;
  };
  inspirations: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    archived: number;
    byCategory: Record<string, number>;
    trend: number;
  };
  pendingValidations: number;
  recentActivity: {
    last7Days: number;
    last30Days: number;
  };
}

export interface ChartDataPoint {
  date?: string;
  [key: string]: string | number | undefined;
}

export function getDashboardStats(): DashboardStats {
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Professionals stats
  const professionalsTotal = professionalsData.length;
  const professionalsPending = professionalsPendingData.length;
  const professionalsLast30 = professionalsData.filter((p) => {
    const date = new Date(p.dateInscription);
    return date >= last30Days && date < now;
  }).length;
  const professionalsPrevious30 = professionalsData.filter((p) => {
    const date = new Date(p.dateInscription);
    return date >= previous30Days && date < last30Days;
  }).length;
  const professionalsTrend = professionalsPrevious30 > 0
    ? ((professionalsLast30 - professionalsPrevious30) / professionalsPrevious30) * 100
    : professionalsLast30 > 0 ? 100 : 0;

  // Job Seekers stats
  const jobSeekersTotal = jobSeekersData.length;
  const jobSeekersPending = jobSeekersPendingData.length;
  const jobSeekersRejected = 0; // No rejected data file yet
  const jobSeekersLast30 = jobSeekersData.filter((js) => {
    const date = parseDate(js.dateInscription);
    return date && date >= last30Days && date < now;
  }).length;
  const jobSeekersPrevious30 = jobSeekersData.filter((js) => {
    const date = parseDate(js.dateInscription);
    return date && date >= previous30Days && date < last30Days;
  }).length;
  const jobSeekersTrend = jobSeekersPrevious30 > 0
    ? ((jobSeekersLast30 - jobSeekersPrevious30) / jobSeekersPrevious30) * 100
    : jobSeekersLast30 > 0 ? 100 : 0;

  // Job Offers stats
  const jobOffersTotal = jobOffersData.length;
  const jobOffersActive = jobOffersData.filter((jo) => jo.etat === "En ligne").length;
  const jobOffersLast30 = jobOffersData.filter((jo) => {
    const date = parseDate(jo.datePublication);
    return date && date >= last30Days && date < now;
  }).length;
  const jobOffersPrevious30 = jobOffersData.filter((jo) => {
    const date = parseDate(jo.datePublication);
    return date && date >= previous30Days && date < last30Days;
  }).length;
  const jobOffersTrend = jobOffersPrevious30 > 0
    ? ((jobOffersLast30 - jobOffersPrevious30) / jobOffersPrevious30) * 100
    : jobOffersLast30 > 0 ? 100 : 0;

  // Inspirations stats
  const inspirationsTotal = inspirationsData.length;
  const inspirationsApproved = inspirationsData.filter((i) => i.statut === "approved").length;
  const inspirationsPending = inspirationsPendingData.length;
  const inspirationsRejected = inspirationsRejectedData.length;
  const inspirationsArchived = inspirationsData.filter((i) => i.statut === "archived").length;
  
  const inspirationsByCategory: Record<string, number> = {};
  inspirationsData.forEach((insp) => {
    if (insp.categorie) {
      inspirationsByCategory[insp.categorie] = (inspirationsByCategory[insp.categorie] || 0) + 1;
    }
  });

  const inspirationsLast30 = inspirationsData.filter((i) => {
    const date = parseDate(i.createdAt);
    return date && date >= last30Days && date < now;
  }).length;
  const inspirationsPrevious30 = inspirationsData.filter((i) => {
    const date = parseDate(i.createdAt);
    return date && date >= previous30Days && date < last30Days;
  }).length;
  const inspirationsTrend = inspirationsPrevious30 > 0
    ? ((inspirationsLast30 - inspirationsPrevious30) / inspirationsPrevious30) * 100
    : inspirationsLast30 > 0 ? 100 : 0;

  // Pending validations
  const pendingValidations = professionalsPending + jobSeekersPending + inspirationsPending;

  // Recent activity
  const allItems = [
    ...professionalsData.map((p) => ({ date: p.dateInscription, type: "professional" })),
    ...jobSeekersData.map((js) => ({ date: js.dateInscription, type: "jobSeeker" })),
    ...jobOffersData.map((jo) => ({ date: jo.datePublication, type: "jobOffer" })),
    ...inspirationsData.map((i) => ({ date: i.createdAt, type: "inspiration" })),
  ];

  const recentActivityLast7 = allItems.filter((item) => {
    const date = parseDate(item.date);
    return date && date >= last7Days && date < now;
  }).length;

  const recentActivityLast30 = allItems.filter((item) => {
    const date = parseDate(item.date);
    return date && date >= last30Days && date < now;
  }).length;

  return {
    professionals: {
      total: professionalsTotal,
      pending: professionalsPending,
      trend: Math.round(professionalsTrend),
    },
    jobSeekers: {
      total: jobSeekersTotal,
      pending: jobSeekersPending,
      rejected: jobSeekersRejected,
      trend: Math.round(jobSeekersTrend),
    },
    jobOffers: {
      total: jobOffersTotal,
      active: jobOffersActive,
      trend: Math.round(jobOffersTrend),
    },
    inspirations: {
      total: inspirationsTotal,
      approved: inspirationsApproved,
      pending: inspirationsPending,
      rejected: inspirationsRejected,
      archived: inspirationsArchived,
      byCategory: inspirationsByCategory,
      trend: Math.round(inspirationsTrend),
    },
    pendingValidations,
    recentActivity: {
      last7Days: recentActivityLast7,
      last30Days: recentActivityLast30,
    },
  };
}

function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  try {
    // Handle different date formats
    if (dateString.includes("T")) {
      return new Date(dateString);
    }
    if (dateString.includes(" ")) {
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
}

export function getRegistrationTrendsData(days: number = 90): ChartDataPoint[] {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Group by date
  const dataMap = new Map<string, { jobSeekers: number; professionals: number }>();
  
  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    dataMap.set(dateKey, { jobSeekers: 0, professionals: 0 });
  }

  // Process job seekers
  jobSeekersData.forEach((js) => {
    const date = parseDate(js.dateInscription);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { jobSeekers: 0, professionals: 0 };
      existing.jobSeekers++;
      dataMap.set(dateKey, existing);
    }
  });

  // Process professionals
  professionalsData.forEach((p) => {
    const date = parseDate(p.dateInscription);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { jobSeekers: 0, professionals: 0 };
      existing.professionals++;
      dataMap.set(dateKey, existing);
    }
  });

  // Convert to array and sort
  return Array.from(dataMap.entries())
    .map(([date, values]) => ({
      date,
      jobSeekers: values.jobSeekers,
      professionals: values.professionals,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getJobOffersTimelineData(days: number = 90): ChartDataPoint[] {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const dataMap = new Map<string, { online: number; total: number }>();
  
  // Initialize dates
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    dataMap.set(dateKey, { online: 0, total: 0 });
  }

  jobOffersData.forEach((jo) => {
    const date = parseDate(jo.datePublication);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { online: 0, total: 0 };
      existing.total++;
      if (jo.etat === "En ligne") {
        existing.online++;
      }
      dataMap.set(dateKey, existing);
    }
  });

  return Array.from(dataMap.entries())
    .map(([date, values]) => ({
      date,
      online: values.online,
      total: values.total,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getInspirationsStatusData(): ChartDataPoint[] {
  const stats = getDashboardStats();
  return [
    { status: "Approuvé", value: stats.inspirations.approved, color: "var(--status-approved)" },
    { status: "En attente", value: stats.inspirations.pending, color: "var(--status-pending)" },
    { status: "Refusé", value: stats.inspirations.rejected, color: "var(--status-rejected)" },
    { status: "Archivé", value: stats.inspirations.archived, color: "var(--status-archived)" },
  ];
}

export function getCategoryDistributionData(): ChartDataPoint[] {
  const stats = getDashboardStats();
  return Object.entries(stats.inspirations.byCategory).map(([category, count]) => ({
    category,
    value: count,
  }));
}

export function getActivityOverviewData(days: number = 90): ChartDataPoint[] {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const dataMap = new Map<string, { registrations: number; jobOffers: number; inspirations: number }>();
  
  // Initialize dates
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    dataMap.set(dateKey, { registrations: 0, jobOffers: 0, inspirations: 0 });
  }

  // Process registrations (job seekers + professionals)
  [...jobSeekersData, ...professionalsData].forEach((item) => {
    const date = parseDate(item.dateInscription);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { registrations: 0, jobOffers: 0, inspirations: 0 };
      existing.registrations++;
      dataMap.set(dateKey, existing);
    }
  });

  // Process job offers
  jobOffersData.forEach((jo) => {
    const date = parseDate(jo.datePublication);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { registrations: 0, jobOffers: 0, inspirations: 0 };
      existing.jobOffers++;
      dataMap.set(dateKey, existing);
    }
  });

  // Process inspirations
  inspirationsData.forEach((insp) => {
    const date = parseDate(insp.createdAt);
    if (date && date >= startDate && date < now) {
      const dateKey = date.toISOString().split("T")[0];
      const existing = dataMap.get(dateKey) || { registrations: 0, jobOffers: 0, inspirations: 0 };
      existing.inspirations++;
      dataMap.set(dateKey, existing);
    }
  });

  return Array.from(dataMap.entries())
    .map(([date, values]) => ({
      date,
      registrations: values.registrations,
      jobOffers: values.jobOffers,
      inspirations: values.inspirations,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

