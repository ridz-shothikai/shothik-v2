import AnalysisClientSections from "@/components/(marketing-automation-page)/(project-analysis-page)/AnalysisClientSections";
import TitleAndUrlSection from "@/components/(marketing-automation-page)/(project-analysis-page)/TitleAndUrlSection";
import PageHeader from "@/components/(marketing-automation-page)/PageHeader";

const project = {
  name: "Project 1",
  location: "USA",
  url: "https://www.demo.com/product/123",
};

const ProjectAnalysisPage = async ({ params }) => {
  const { id } = await params;

  return (
    <main className="bg-card relative flex min-h-[calc(100vh-100px)] flex-col space-y-6 p-6">
      <PageHeader />
      <div className="space-y-6 md:space-y-10">
        <TitleAndUrlSection project={{ ...project, id: id }} />
        <AnalysisClientSections project={{ ...project, id: id }} />
      </div>
    </main>
  );
};

export default ProjectAnalysisPage;
