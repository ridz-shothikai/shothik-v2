import { TextField } from "@mui/material";

const TitleAndUrlSection = ({ project }) => {
  return (
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
  );
};

export default TitleAndUrlSection;
