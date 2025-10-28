import { Box, Container, Divider, IconButton, Link as MuiLink, Typography } from "@mui/material";
import { ExternalLink, Rocket, TrendingUp } from "lucide-react";
import { SiFacebook, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import PaymentBadges from "../common/PaymentBadges";
import logo from "./../../assets/Logo_(3)_1760613683127.png";

export default function ShothikFooter() {
  const ecosystemProducts = [
    { name: "DocuSort", desc: "Document management" },
    { name: "Verific", desc: "KYC verification" },
    { name: "PublEnabler", desc: "Editorial automation" },
    { name: "SmartCrawl", desc: "Web scraping" },
  ];

  const footerLinks = {
    product: [
      { label: "Writing Tools", href: "#features" },
      { label: "AI Agents", href: "#agents" },
      { label: "Meta Ads", href: "#meta-ads" },
      { label: "Pricing", href: "#pricing" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "API", href: "#" },
      { label: "Support", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
        borderTop: (theme) => theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.06)',
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Shark Tank Story Banner */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mb: { xs: 6, md: 8 },
            borderRadius: 3,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(0, 167, 111, 0.1) 0%, rgba(24, 119, 242, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(0, 167, 111, 0.05) 0%, rgba(24, 119, 242, 0.05) 100%)',
            border: (theme) => theme.palette.mode === 'dark'
              ? '1px solid rgba(0, 167, 111, 0.2)'
              : '1px solid rgba(0, 167, 111, 0.15)',
          }}
          data-testid="shark-tank-story"
        >
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
            <Rocket size={24} color="#00A76F" />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                From Rejection to Recognition
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: 'text.secondary',
                  letterSpacing: '0.01em',
                }}
              >
                When Shark Tank Bangladesh said no, we didn't give up. That rejection fueled our mission to democratize AI. 
                Backed by leading tech giants, we're building AI tools that serve billions, not just the privileged few.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(0, 167, 111, 0.2)'
                  : 'rgba(0, 167, 111, 0.15)',
              }}
              data-testid="badge-aws-startup"
            >
              <TrendingUp size={16} color="#00A76F" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#00A76F',
                  fontSize: '0.75rem',
                }}
              >
                AWS Startup
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(0, 167, 111, 0.2)'
                  : 'rgba(0, 167, 111, 0.15)',
              }}
              data-testid="badge-scaleway"
            >
              <TrendingUp size={16} color="#00A76F" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#00A76F',
                  fontSize: '0.75rem',
                }}
              >
                Scaleway
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(0, 167, 111, 0.2)'
                  : 'rgba(0, 167, 111, 0.15)',
              }}
              data-testid="badge-google-cloud"
            >
              <TrendingUp size={16} color="#00A76F" />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#00A76F',
                  fontSize: '0.75rem',
                }}
              >
                Google Cloud for Startups
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(12, 1fr)' },
            gap: { xs: 4, md: 6 },
          }}
        >
          {/* Column 1: Brand & About */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 4' } }}>
            <Box sx={{ mb: 3 }}>
              <Box
                component="img"
                src={logo.src}
                alt="Shothik AI"
                sx={{
                  height: 24,
                  maxWidth: 120,
                  width: 'auto',
                  objectFit: 'contain',
                  mb: 2,
                }}
                data-testid="logo-footer"
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: 'text.secondary',
                  mb: 3,
                }}
              >
                AI tools built for humanity. From Bangladesh to the world—giving voice to billions through accessible, affordable AI.
              </Typography>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#1877F2' },
                }}
                data-testid="button-facebook"
              >
                <SiFacebook size={18} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#000000' },
                }}
                data-testid="button-twitter"
              >
                <SiX size={18} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#0A66C2' },
                }}
                data-testid="button-linkedin"
              >
                <SiLinkedin size={18} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#FF0000' },
                }}
                data-testid="button-youtube"
              >
                <SiYoutube size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Column 2: Ecosystem Products */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' } }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                mb: 2,
                letterSpacing: '0.01em',
              }}
            >
              Ecosystem
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink
                href="https://ecosystem.shothik.ai"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#00A76F',
                  },
                }}
                data-testid="link-ecosystem"
              >
                All Products
                <ExternalLink size={12} />
              </MuiLink>
              {ecosystemProducts.map((product) => (
                <Box key={product.name}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      lineHeight: 1.4,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.disabled',
                      fontSize: '0.75rem',
                    }}
                  >
                    {product.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Column 3: Product Links */}
          <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                mb: 2,
                letterSpacing: '0.01em',
              }}
            >
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.product.map((link) => (
                <MuiLink
                  key={link.label}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#00A76F',
                    },
                  }}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Box>

          {/* Column 4: Payment Methods */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3' } }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                mb: 2,
                letterSpacing: '0.01em',
              }}
            >
              Payment Methods
            </Typography>
            <PaymentBadges />
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 4, md: 6 } }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'start', md: 'center' },
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.75rem',
            }}
          >
            © {new Date().getFullYear()} Shothik AI. All rights reserved. • Voice of Billions
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <MuiLink
              href="#"
              sx={{
                color: 'text.disabled',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: 'text.disabled',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              href="#"
              sx={{
                color: 'text.disabled',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
