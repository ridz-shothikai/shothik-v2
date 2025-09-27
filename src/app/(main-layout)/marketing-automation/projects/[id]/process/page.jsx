const ProjectProcessPage = async ({ params }) => {
  const { id } = await params;
  console.log(id);
  return (
    <main>
      <div>Project Process Page</div>
    </main>
  );
};

export default ProjectProcessPage;
