import { Box, Typography, Chip } from "@mui/material";
import { CreditCard } from "lucide-react";

interface PaymentBadgesProps {
  variant?: 'compact' | 'full';
}

export default function PaymentBadges({ variant = 'full' }: PaymentBadgesProps) {
  const countries = [
    { code: 'IN', name: 'India', methods: 'UPI, Cards', bgColor: '#FF9933' },
    { code: 'BD', name: 'Bangladesh', methods: 'bKash, Nagad', bgColor: '#006A4E' },
  ];

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {countries.map((country) => (
          <Chip
            key={country.code}
            label={country.name}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 167, 111, 0.15)'
                : 'rgba(0, 167, 111, 0.1)',
              color: 'text.primary',
              border: 1,
              borderColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 167, 111, 0.3)'
                : 'rgba(0, 167, 111, 0.2)',
            }}
            data-testid={`chip-${country.name.toLowerCase()}`}
          />
        ))}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          + 15 more coming soon
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Local Payments */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'text.disabled',
              mb: 1.5,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Hyperlocal Payments
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {countries.map((country) => (
              <Chip
                key={country.code}
                icon={
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: country.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    {country.code}
                  </Box>
                }
                label={
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        mr: 0.5,
                      }}
                    >
                      {country.name}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.75rem',
                        color: 'text.disabled',
                      }}
                    >
                      {country.methods}
                    </Typography>
                  </Box>
                }
                size="medium"
                sx={{
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(0, 167, 111, 0.15)'
                    : 'rgba(0, 167, 111, 0.1)',
                  color: 'text.primary',
                  border: 1,
                  borderColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(0, 167, 111, 0.3)'
                    : 'rgba(0, 167, 111, 0.2)',
                  px: 1,
                  py: 2.5,
                  '& .MuiChip-icon': {
                    ml: 1,
                  },
                }}
                data-testid={`chip-payment-${country.name.toLowerCase()}`}
              />
            ))}
          </Box>
          <Chip
            label="15+ countries coming soon"
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
              color: 'text.disabled',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.06)',
            }}
            data-testid="chip-more-countries"
          />
        </Box>

        {/* International Payments */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'text.disabled',
              mb: 1.5,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            International Payments
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              icon={<CreditCard size={16} />}
              label="Visa / Mastercard"
              size="medium"
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(24, 119, 242, 0.15)'
                  : 'rgba(24, 119, 242, 0.1)',
                color: 'text.primary',
                border: 1,
                borderColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(24, 119, 242, 0.3)'
                  : 'rgba(24, 119, 242, 0.2)',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: '#1877F2',
                },
              }}
              data-testid="chip-payment-cards"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
