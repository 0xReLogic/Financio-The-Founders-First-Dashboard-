import StatsCard from '../StatsCard';
import { TrendingUp } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-6 space-y-4">
      <StatsCard
        icon={TrendingUp}
        label="Pendapatan"
        value="Rp 50.000.000"
        trend={25}
        valueColor="text-[#65a30d]"
      />
    </div>
  );
}
