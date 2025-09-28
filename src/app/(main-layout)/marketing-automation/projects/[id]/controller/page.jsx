import ControllerClientSection from "@/components/(marketing-automation-page)/(project-controller-page)/ControllerClientSection";
import PageHeader from "@/components/(marketing-automation-page)/PageHeader/PageHeader";
import { TextField } from "@mui/material";

const project = {
  id: 1,
  name: "Project 1",
  location: "USA",
  url: "https://example.com/project1",
};

const ProjectControllerPage = async ({ params }) => {
  const { id } = await params;

  return (
    <main className="relative flex min-h-[calc(100vh-100px)] flex-col space-y-6">
      <PageHeader />
      <div className="space-y-6 md:space-y-10">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2>We’ll Handle the Hard Part — You Focus on Growth</h2>
          <div className="bg-card rounded-full border shadow">
            <TextField
              value={`${project.url}`}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                className: "px-4 !py-2",
              }}
              fullWidth
            />
          </div>
        </div>
        <ControllerClientSection project={project} />
      </div>
    </main>
  );
};

export default ProjectControllerPage;
