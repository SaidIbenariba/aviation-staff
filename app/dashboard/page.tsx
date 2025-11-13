"use client";

import { useMemo } from "react";
import { StatsCard } from "./_components/stats-card";
import { RegistrationTrendsChart } from "./_components/registration-trends-chart";
import { JobOffersTimelineChart } from "./_components/job-offers-timeline-chart";
import { InspirationsStatusChart } from "./_components/inspirations-status-chart";
import { CategoryDistributionChart } from "./_components/category-distribution-chart";
import { ActivityOverviewChart } from "./_components/activity-overview-chart";
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { getDashboardStats } from "@/lib/utils/dashboard-stats";

export default function DashboardPage() {
  const stats = useMemo(() => getDashboardStats(), []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Vue d'ensemble de l'activité Aviation Staff
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Professionnels inscrits"
          value={stats.professionals.total}
          description={`${stats.professionals.pending} en attente de validation`}
          trend={stats.professionals.trend}
          icon={Briefcase}
          href="/dashboard/professionals"
        />
        <StatsCard
          title="Demandeurs d'emploi"
          value={stats.jobSeekers.total}
          description={`${stats.jobSeekers.pending} en attente`}
          trend={stats.jobSeekers.trend}
          icon={Users}
          href="/dashboard/job-seekers"
        />
        <StatsCard
          title="Offres d'emploi"
          value={stats.jobOffers.total}
          description={`${stats.jobOffers.active} en ligne`}
          trend={stats.jobOffers.trend}
          icon={FileText}
          href="/dashboard/job-offers"
        />
        <StatsCard
          title="Inspirations"
          value={stats.inspirations.total}
          description={`${stats.inspirations.approved} approuvées`}
          trend={stats.inspirations.trend}
          icon={Lightbulb}
          href="/dashboard/inspirations"
        />
      </div>

      {/* Additional Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="À valider"
          value={stats.pendingValidations}
          description="Total des validations en attente"
          icon={CheckCircle}
          className="bg-status-pending/10 border-status-pending/20"
        />
        <StatsCard
          title="Activité récente (7j)"
          value={stats.recentActivity.last7Days}
          description={`${stats.recentActivity.last30Days} sur 30 jours`}
          icon={AlertCircle}
        />
        <StatsCard
          title="Inspirations en attente"
          value={stats.inspirations.pending}
          description={`${stats.inspirations.rejected} refusées`}
          icon={Lightbulb}
          href="/dashboard/inspirations/pending"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Trends - Full Width on Large Screens */}
        <div className="lg:col-span-2">
          <RegistrationTrendsChart />
        </div>

        {/* Job Offers Timeline */}
        <JobOffersTimelineChart />

        {/* Inspirations Status */}
        <InspirationsStatusChart />

        {/* Category Distribution */}
        <CategoryDistributionChart />

        {/* Activity Overview - Full Width */}
        <div className="lg:col-span-2">
          <ActivityOverviewChart />
        </div>
      </div>
    </div>
  );
}
