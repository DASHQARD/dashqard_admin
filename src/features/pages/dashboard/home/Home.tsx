import { LoaderGif } from '@/assets/gifs';
import { Icon } from '@/libs';

function KpiCard({
  title,
  value,
  icon,
  backgroundColor,
  actionIcon,
}: {
  title: string;
  value: string;
  icon: string;
  backgroundColor: string;
  actionIcon: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ backgroundColor }}
    >
      <div className="relative z-10 p-5 min-h-[92px]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-white/70">{title}</div>
            <div className="text-2xl font-bold mt-1 text-white">{value}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Icon icon={icon} className="text-white text-base" />
            </div>
            <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center">
              <Icon icon={actionIcon} className="text-white text-base" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const isLoading = false;

  const metrics = {
    totalUsers: 1250,
    totalTransactions: 5432,
    totalRevenue: 1250000,
    pendingApprovals: 23,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <div className="text-center">
          <img
            src={LoaderGif}
            alt="Loading..."
            className="w-20 h-auto mx-auto mb-5"
          />
          <p className="text-[#6c757d] text-base m-0">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] rounded-xl overflow-hidden min-h-[600px]">
      <section className="py-8 flex flex-col gap-8">
        <div className="pb-8 border-b border-[#e9ecef]">
          <div className="flex justify-between items-start flex-wrap gap-5">
            <div>
              <h1 className="text-[32px] font-bold text-[#2c3e50] mb-2 flex items-center">
                <Icon icon="bi:speedometer2" className="text-[#402D87] mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-base text-[#6c757d] m-0 leading-relaxed">
                Welcome back! Here's an overview of the system
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="flex justify-between items-center">
          <h5 className="text-xl font-semibold text-[#495057] m-0">
            Key Performance Metrics
          </h5>
        </div>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            icon="bi:people-fill"
            actionIcon="bi:file-earmark-text"
            backgroundColor="#402D87"
          />
          <KpiCard
            title="Total Transactions"
            value={metrics.totalTransactions.toLocaleString()}
            icon="bi:receipt"
            actionIcon="bi:file-earmark-text"
            backgroundColor="#2d1a72"
          />
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon="bi:currency-dollar"
            actionIcon="bi:file-earmark-text"
            backgroundColor="#402D87"
          />
          <KpiCard
            title="Pending Approvals"
            value={metrics.pendingApprovals.toLocaleString()}
            icon="bi:clock-history"
            actionIcon="bi:file-earmark-text"
            backgroundColor="#2d1a72"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#f1f3f4] overflow-hidden">
            <div className="p-6 pb-0 mb-5">
              <h5 className="text-lg font-semibold text-[#495057] m-0 flex items-center">
                <Icon icon="bi:activity" className="text-[#402D87] mr-2" />
                System Overview
              </h5>
            </div>

            <div className="px-6 pb-6">
              <div className="text-center py-10 text-[#6c757d]">
                <Icon
                  icon="bi:graph-up"
                  className="text-5xl text-[#e9ecef] mb-4"
                />
                <p className="m-0 text-sm">
                  System analytics will be displayed here
                </p>
                <p className="m-0 text-xs mt-2 text-[#adb5bd]">
                  Connect to your analytics API to view detailed metrics
                </p>
              </div>
            </div>
          </div>

          {/* Access Analytics */}
          <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#f1f3f4] overflow-hidden">
            <div className="p-6 pb-0 mb-5">
              <h5 className="text-lg font-semibold text-[#495057] m-0 flex items-center">
                <Icon icon="bi:graph-up" className="text-[#402D87] mr-2" />
                Access Analytics
              </h5>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
