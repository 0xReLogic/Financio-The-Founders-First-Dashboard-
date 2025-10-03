import AIAdvisorCard from '../AIAdvisorCard';

export default function AIAdvisorCardExample() {
  return (
    <div className="p-6">
      <AIAdvisorCard
        usageCount={3}
        usageLimit={10}
        onAnalyze={() => console.log('Analyze clicked')}
      />
    </div>
  );
}
