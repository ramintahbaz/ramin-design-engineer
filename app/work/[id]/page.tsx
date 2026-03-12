import { WorkPageClient } from './WorkPageClient';

type WorkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params;
  const resolvedId = typeof id === 'string' ? id : id?.[0];
  return <WorkPageClient id={resolvedId} />;
}
