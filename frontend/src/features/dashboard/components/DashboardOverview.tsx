import { memo } from 'react';
import { MetricCard } from '@/components/ui';
import { BriefcaseIcon, ClockIcon, UserIcon } from '@/components/icons';
import { useTranslation } from '@/context/I18nContext';
import type { OverviewResponse } from '../dashboard.types';

const MAX_PROJECTS = 100;
const MAX_HOURS = 1300;
const MAX_RESOURCES = 120;

interface DashboardOverviewProps {
  data: OverviewResponse;
}

export default memo(function DashboardOverview({ data }: DashboardOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        icon={<BriefcaseIcon className="h-5 w-5 text-white" />}
        iconBg="bg-[#d4a373]"
        label={t('dashboard.projects')}
        value={data.totalProjects}
        total={MAX_PROJECTS}
        growth={data.growth.projectsCreated.percent}
      />
      <MetricCard
        icon={<ClockIcon className="h-5 w-5 text-white" />}
        iconBg="bg-[#6b9bd2]"
        label={t('dashboard.timeSpent')}
        value={data.growth.hoursLogged.current}
        total={MAX_HOURS}
        unit="Hrs"
        growth={data.growth.hoursLogged.percent}
      />
      <MetricCard
        icon={<UserIcon className="h-5 w-5 text-white" />}
        iconBg="bg-[#d4b96a]"
        label={t('dashboard.resources')}
        value={data.teamResourcesCount}
        total={MAX_RESOURCES}
        growth={data.growth.teamMembers.percent}
      />
    </div>
  );
});
