import PemusikForm from "@/components/admin/PemusikForm";

export default async function EditPemusikPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PemusikForm id={id} />;
}
