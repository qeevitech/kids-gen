import DesignPage from "./_components/DesignPage";

interface EditorDesignIdPageProps {
  params: Promise<{ designId: string }>;
}

const EditorDesignIdPage = async ({ params }: EditorDesignIdPageProps) => {
  const { designId } = await params;
  return <DesignPage designId={designId} />;
};

export default EditorDesignIdPage;
