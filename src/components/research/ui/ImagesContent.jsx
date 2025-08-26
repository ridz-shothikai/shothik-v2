"use client";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
} from "@mui/material";
import { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

const ImageCard = ({ image, onClick }) => (
  <Card
    sx={{
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 3,
      },
    }}
    onClick={() => onClick(image)}
  >
    <CardMedia
      component="img"
      height="200"
      image={image.thumbnail_url || image.url}
      alt={image.alt_text || image.title}
      sx={{
        objectFit: "cover",
        backgroundColor: "#f5f5f5",
      }}
      onError={(e) => {
        e.target.src = "/placeholder-image.png"; // Add a placeholder image
      }}
    />
    <CardContent sx={{ p: 2 }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          mb: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {image.title}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mb: 1,
        }}
      >
        Source: {image.source}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label={`${image.width} × ${image.height}`}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.7rem" }}
        />

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(image.context_url, "_blank");
          }}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const ImageModal = ({ image, open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" component="div">
        {image?.title}
      </Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent>
      {image && (
        <Box>
          <img
            src={image.url}
            alt={image.alt_text || image.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "70vh",
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
            onError={(e) => {
              e.target.src = "/placeholder-image.png";
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Source:</strong> {image.source}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Dimensions:</strong> {image.width} × {image.height}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Context:</strong>{" "}
              <Link href={image.context_url} target="_blank" rel="noopener">
                View original page
              </Link>
            </Typography>

            {image.relevance_score && (
              <Typography variant="body2" color="text.secondary">
                <strong>Relevance:</strong>{" "}
                {Math.round(image.relevance_score * 100)}%
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </DialogContent>
  </Dialog>
);

export default function ImagesContent({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          textAlign: "center",
        }}
      >
        <ImageIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No Images Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No images were found for this research query
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 3, mb: {xs: 17, sm: 7, md: 5} }}>
      {/* <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Research Images ({images.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Images related to your research query
        </Typography>
      </Box> */}

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={image._id || index}>
            <ImageCard image={image} onClick={handleImageClick} />
          </Grid>
        ))}
      </Grid>

      <ImageModal
        image={selectedImage}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
}
