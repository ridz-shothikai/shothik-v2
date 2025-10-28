import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { Globe, CreditCard, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyShothik() {
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
  };

  const pillars = [
    {
      icon: <Globe size={32} />,
      title: "Truly Multilingual",
      subtitle: "100+ Languages Supported",
      description: "From Bangla to Swahili, Urdu to Vietnamese—your language shouldn't limit your ambitions. We speak the world's languages, not just the privileged few.",
      accentColor: "#00A76F",
    },
    {
      icon: <CreditCard size={32} />,
      title: "Hyperlocal Payments",
      subtitle: "India 🇮🇳 Bangladesh 🇧🇩 + More Coming",
      description: "Pay with bKash, Nagad, UPI, or international cards. No credit card? No problem. Local currencies, local payment methods, global access.",
      accentColor: "#1877F2",
    },
    {
      icon: <DollarSign size={32} />,
      title: "Built for Everyone",
      subtitle: "Enterprise Features, Not Enterprise Prices",
      description: "From students to SMBs to Fortune 500s—AI tools shouldn't cost a month's salary. Premium capabilities at prices the world can actually afford.",
      accentColor: "#00A76F",
    },
  ];

  return (
    <Box
      component="section"
      data-testid="section-why-shothik"
      sx={{
        py: { xs: 12, md: 20 },
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
        position: 'relative',
      }}
    >
      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(0, 167, 111, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at top, rgba(0, 167, 111, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          component={motion.div}
          {...fadeInUp}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              mb: 2,
              color: 'text.primary',
            }}
            data-testid="heading-why-shothik"
          >
            Why Shothik AI?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              fontWeight: 400,
              lineHeight: 1.75,
              maxWidth: 720,
              mx: 'auto',
              color: 'text.secondary',
              letterSpacing: '0.01em',
            }}
          >
            AI That Speaks Your Language, Accepts Your Currency
          </Typography>
        </Box>

        {/* Three Pillars */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 4, md: 4 },
          }}
        >
          {pillars.map((pillar, index) => (
            <Box
              component={motion.div}
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              sx={{
                height: '100%',
              }}
              data-testid={`card-pillar-${index}`}
            >
              <Card
                sx={{
                  height: '100%',
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(8px) saturate(180%)',
                  border: (theme) => theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: 3,
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? `0 8px 32px rgba(${pillar.accentColor === '#00A76F' ? '0, 167, 111' : '24, 119, 242'}, 0.12)`
                    : `0 8px 32px rgba(0, 0, 0, 0.04)`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? `0 12px 48px rgba(${pillar.accentColor === '#00A76F' ? '0, 167, 111' : '24, 119, 242'}, 0.2)`
                      : `0 12px 48px rgba(0, 0, 0, 0.08)`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? `rgba(${pillar.accentColor === '#00A76F' ? '0, 167, 111' : '24, 119, 242'}, 0.15)`
                        : `rgba(${pillar.accentColor === '#00A76F' ? '0, 167, 111' : '24, 119, 242'}, 0.1)`,
                      color: pillar.accentColor,
                      mb: 3,
                      width: 'fit-content',
                    }}
                  >
                    {pillar.icon}
                  </Box>

                  {/* Title & Subtitle */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      lineHeight: 1.3,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    {pillar.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      mb: 2,
                      color: pillar.accentColor,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {pillar.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 400,
                      lineHeight: 1.75,
                      color: 'text.secondary',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {pillar.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Bottom Message */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              fontWeight: 400,
              lineHeight: 1.75,
              maxWidth: 800,
              mx: 'auto',
              color: 'text.disabled',
              letterSpacing: '0.01em',
            }}
          >
            Most AI tools were built in Silicon Valley for Silicon Valley. Shothik AI was built in Bangladesh{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>for the world</Box>.{' '}
            This is AI built for humanity. All 8 billion of us.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
