import { TextField } from "@mui/material";

const TitleAndUrlSection = ({ project }) => {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
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
      <h2>Creating customized insights for your marketing campaigns</h2>
    </div>
  );
};

export default TitleAndUrlSection;
