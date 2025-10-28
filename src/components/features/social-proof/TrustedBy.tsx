import { Box, Typography } from "@mui/material";
import { motion, useReducedMotion, cubicBezier } from "framer-motion";
import amplitudeLogo from "../../../assets/AMPLITUDE_FULL_BLACK 1_1759922325253.png";
import chargebeeLogo from "../../../assets/CB Primary Logo Blue and Orange 1_1759922325254.png";
import zapierLogo from "../../../assets/Company logo-7_1759922325255.png";
import microsoftLogo from "../../../assets/Company logo-10_1759922325255.png";
import stripeLogo from "../../../assets/Company logo_1759922325256.png";
import googleCloudLogo from "../../../assets/google-cloud-platform-gcp-seeklogo 1_1759922325257.png";

export default function TrustedBy() {
  const prefersReducedMotion = useReducedMotion();
  
  const companies = [
    { 
      name: "Amplitude", 
      logo: amplitudeLogo
    },
    { 
      name: "Chargebee", 
      logo: chargebeeLogo
    },
    { 
      name: "Zapier", 
      logo: zapierLogo
    },
    { 
      name: "Microsoft", 
      logo: microsoftLogo
    },
    { 
      name: "Stripe", 
      logo: stripeLogo
    },
    { 
      name: "Google Cloud", 
      logo: googleCloudLogo
    }
  ];

  // Container animation for staggered logos
  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      }
    }
  };

  // Logo animation variants
  const logoVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: prefersReducedMotion ? { duration: 0 } : {
        duration: 0.5,
        ease: cubicBezier(0.22, 1, 0.36, 1)
      }
    }
  };

  return (
    <Box 
      component="section"
      sx={{ 
        py: { xs: 12, md: 16 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
        position: 'relative',
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 4, md: 8 } }}>
        {/* Heading with fade-in */}
        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) }}
        >
          <Typography 
            variant="overline"
            sx={{ 
              display: 'block',
              textAlign: 'center',
              letterSpacing: '0.1em',
              color: 'text.secondary',
              mb: 8
            }}
            data-testid="text-trusted-by"
          >
            Trusted by teams at
          </Typography>
        </motion.div>

        {/* Logos with staggered entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(6, 1fr)' 
              },
              columnGap: 8,
              rowGap: 8,
              alignItems: 'center',
              justifyItems: 'center'
            }}
          >
            {companies.map((company, i) => (
              <motion.div
                key={i}
                variants={logoVariants}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  data-testid={`logo-${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                  title={company.name}
                >
                  <Box
                    component="img"
                    src={company.logo.src}
                    alt={company.name}
                    sx={{
                      height: 40,
                      width: 'auto',
                      objectFit: 'contain',
                      opacity: 0.5,
                      filter: (theme) => theme.palette.mode === 'dark' 
                        ? 'grayscale(100%) brightness(100) invert(1)'
                        : 'grayscale(100%)',
                      transition: 'opacity 200ms, filter 200ms',
                      '&:hover': {
                        opacity: 0.8,
                        filter: (theme) => theme.palette.mode === 'dark' 
                          ? 'grayscale(0%) brightness(100) invert(1)'
                          : 'grayscale(0%)',
                      }
                    }}
                  />
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
