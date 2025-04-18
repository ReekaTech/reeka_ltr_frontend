import { Layout } from '@/components/ui';
import { PortfolioDetail } from '@/components/portfolio';

interface PortfolioDetailPageProps {
  params: {
    id: string;
  };
}

export default function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  return (
    <Layout>
      <PortfolioDetail portfolioId={params?.id} />
    </Layout>
  );
}
