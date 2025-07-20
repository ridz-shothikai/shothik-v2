import { Box, Grid2, Rating, Typography } from "@mui/material";
import * as motion from "motion/react-client";
import React from "react";
import UserActionButton from "./UserActionButton";
import SocialProofBanner from "./SocialProofBanner";

const Details = () => {
  return (
    <Grid2 size={{ xs: 12, md: 6 }}
    sx={{
      px: { xs: 2, md: 0 }, // padding left/right: 16px on mobile, 0 on md+
    }}
    >
      {/* Social Proof Banner */}


      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Typography
          variant='h2'
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
            lineHeight: 1.2,
            letterSpacing: "-2%",
            color: "#00A76F",
            background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          For The Billions Rising.
        </Typography>
        {/* <Typography
          variant='h2'
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
            lineHeight: 1.2,
            letterSpacing: "-2%",
            color: "#00A76F",
            background: "linear-gradient(135deg, #00A76F 40%, #3A7A69 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your AI-Powered Writing Assistant
        </Typography> */}
      </motion.div>

      {/* Subheadline */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Typography 
          variant='h6' 
          color='text.secondary' 
          sx={{ 
            my: 3,
            fontSize: { xs: '1rem', md: '1.25rem' },
            lineHeight: 1.6,
            maxWidth: '600px',
          }}
        >
          Shothik grows with you—from your first essay to your first business. Write better. Work smarter. Launch faster
        </Typography>
      </motion.div>

      <br />

           
      {/* Rating Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        sx={{
          display: "flex",
          alignItems: "start",
          gap: 1,
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
            xl: "row",
          },
          marginBottom: "24px",
        }}
      >
        <Rating value={5} readOnly sx={{ color: '#00A76F' }} />
        <Typography sx={{ color: "text.secondary" }}>
          Rated&nbsp;4.9/5&nbsp;| Join our growing community
        </Typography>
        
      </Box>

       <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SocialProofBanner />
      </motion.div>

      
      {/* CTA Section */}
      <UserActionButton />
    </Grid2>
  );
};

export default Details;
