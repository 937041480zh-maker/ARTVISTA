import CategoryPageClient from '@/components/categories/CategoryPageClient';

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <CategoryPageClient slug={params.slug} />;
}
