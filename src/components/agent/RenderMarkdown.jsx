"use client";
import { Box, List, ListItem, Typography } from "@mui/material";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Marked from "marked-react";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const RenderMarkdown = ({ content }) => {
  const renderer = {
    paragraph(children) {
      return <Typography key={this.elementId}>{children}</Typography>;
    },

    heading(children) {
      return (
        <Typography key={this.elementId} variant='h4' sx={{ my: 2 }}>
          {children}
        </Typography>
      );
    },
    list(children, ordered) {
      return (
        <List
          key={this.elementId}
          component={ordered ? "ol" : "ul"}
          sx={{
            listStyleType: ordered ? "decimal" : "disc",
            pl: 4,
            color: "text.primary",
            "& li": { display: "list-item" },
          }}
        >
          {children}
        </List>
      );
    },
    listItem(children) {
      return (
        <ListItem
          key={this.elementId}
          sx={{
            color: "text.primary",
            display: "list-item",
            p: 0,
          }}
        >
          {children}
        </ListItem>
      );
    },
    code(children) {
      const data = JSON.parse(children);

      return (
        <Box
          key={this.elementId}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "300px", width: "auto" }}>
            {data?.type === "bar" ? (
              <Bar data={data.data} options={data.options} />
            ) : data?.type === "pie" ? (
              <Pie data={data.data} options={data.options} />
            ) : null}
          </div>
        </Box>
      );
    },
  };

  return <Marked renderer={renderer}>{content}</Marked>;
};

export default RenderMarkdown;
