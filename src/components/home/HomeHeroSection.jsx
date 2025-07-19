import { SmartToy, Speed, VolumeUp, Timer, Shield, TrendingUp } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Grid2 } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as motion from "motion/react-client";
import Image from "next/image";
import BgContainer from "./components/hero/BgContainer";
import Details from "./components/hero/Details";
import VideoImage from "./components/VideoImage";
import CompetitiveTicker from "./components/hero/CompetitiveTicker";

export default function HomeHeroSection() {
  return (
    <>
      <BgContainer image='url(/home/bg.png)' enablePattern={true}>
        <Grid2
          sx={{
            pt: { xs: 3, md: 6, lg: 8 },
            pb: { xs: 4, sm: 6, md: 8, lg: 10 },
            px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
            maxWidth: '1400px',
            mx: 'auto',
            minHeight: { xs: 'auto', md: '600px', lg: '700px' },
          }}
          container
          alignItems='center'
          justifyContent='space-between'
          spacing={{ xs: 3, md: 4, lg: 6 }}
        >
          <Details />
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{ 
              display: { xs: "block", md: "block", lg: "block" },
              mt: { xs: 4, md: 0 }
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                width: '100%',
                px: { xs: 2, md: 0 },
              }}
            >
              {/* Background decorative elements */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  position: "absolute",
                  bottom: "-50px",
                  right: "130px",
                  zIndex: 0,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <Image
                  src='/home/hero/box.svg'
                  alt='decorative box'
                  width={140}
                  height={140}
                />
              </Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  right: "130px",
                  zIndex: 0,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <div>
                  <Image
                    src='/home/hero/pattern.svg'
                    alt='decorative pattern'
                    width={140}
                    height={140}
                  />
                </div>
              </motion.div>

              {/* Founder Video */}
              <VideoImage
                lightImage='/home/hero/hero-light.webp'
                darkImage='/home/hero/hero-dark.webp'
                videoUrl='/videos/founder-intro.mp4' // Add your video URL
                videoPoster='/home/hero/founder-thumbnail.jpg' // Add thumbnail
                videoDuration='1:32'
                width={350}
                height={300}
              />

              {/* Updated Feature Cards - Better positioned */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "-100px",
                  zIndex: 2,
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    position: "absolute",
                    bottom: { xs: -100, md: -60 },
                    left: { xs: 10, md: -100, lg: -120 },
                    bgcolor: "rgba(33, 33, 33, 0.95)",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                    height: { xs: "auto", md: "140px", lg: "160px" },
                    width: { xs: "280px", md: "240px", lg: "280px" },
                    zIndex: 1,
                    display: { xs: 'none', sm: 'block' },
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                >
                  <List
                    dense
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: { md: "0.9rem", lg: "1rem" },
                        fontWeight: 500,
                      },
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <Timer sx={{ color: "#00A76F" }} />
                      </ListItemIcon>
                      <ListItemText primary='Write 10x faster' />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Shield sx={{ color: "#00A76F" }} />
                      </ListItemIcon>
                      <ListItemText primary='100% original content' />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp sx={{ color: "#00A76F" }} />
                      </ListItemIcon>
                      <ListItemText primary='Better grades & results' />
                    </ListItem>
                  </List>
                </Paper>
              </motion.div>

              {/* Achievement Badge - Now properly positioned */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "-60px",
                  zIndex: 2,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    top: { xs: -20, md: 130, lg: 180, xl: 180 },
                    left: { xs: 10, md: -120 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    width: { xs: 140, md: 180, lg: 220, xl: 240 },
                    zIndex: 1,
                    display: { xs: 'none', sm: 'block' },
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #00A76F 0%, #2E6259 100%)',
                      color: 'white',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Join Us
                    </Typography>
                    <Typography variant="body2">
                      Start Writing Today
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Grid2>
        </Grid2>
      </BgContainer>
      
      {/* Competitive Advantage Ticker */}
      <CompetitiveTicker />
    </>
  );
}