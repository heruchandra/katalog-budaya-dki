import SanggarForm from "@/components/admin/SanggarForm";

export default async function EditSanggarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SanggarForm id={id} />;
}
