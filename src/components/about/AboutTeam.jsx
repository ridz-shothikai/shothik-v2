"use client";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import * as motion from "motion/react-client";
import { useRef, useState } from "react";
import { _socials } from "../../_mock/socials";
import { team } from "../../_mock/team";
import Image from "next/image"


export default function AboutTeam(props) {
  const { subtitle, title, description, members } = props;
  const carouselRef = useRef(null);
  const [_, setCurrentSlide] = useState(0);

  const carouselSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    arrows: false,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ pb: 10, textAlign: "center" }}>
      <motion.div>
        <Typography
          component='p'
          variant='overline'
          sx={{ color: "text.disabled" }}
        >
          DREAM TEAM
        </Typography>
      </motion.div>

      <motion.div>
        <Typography variant='h2' sx={{ my: 2 }}>
          Great team is the key
        </Typography>
      </motion.div>

      <motion.div>
        <Typography
          sx={{
            mx: "auto",
            maxWidth: 640,
            color: "text.secondary",
          }}
        >
          Shothik will provide you support if you have any problems, our support
          team will reply within a day and we also have detailed documentation.
        </Typography>
      </motion.div>
      {team.map((member) => (
        <Box key={member.id} component={motion.div} sx={{ px: 1, py: 10 }}>
          <MemberCard member={member} isFirst={index === 0} />
        </Box>
      ))}

      <Box sx={{ position: "relative", mt: 0 }}>
        {/* <CarouselArrows
          filled
          shape='rounded'
          onNext={handleNext}
          onPrevious={handlePrev}
          sx={{ zIndex: -1 }}
          leftButtonProps={{
            sx: {
              left: 24,
              zIndex: 1,
            },
          }}
          rightButtonProps={{
            sx: {
              right: 24,
              zIndex: 1,
            },
          }}
        >
          <Carousel ref={carouselRef} {...carouselSettings}>
            {members
              .sort((a, b) => a.order - b.order)
              .map((member, index) => ( */}

        {/* ))} */}
        {/* </Carousel>
         </CarouselArrows> */}
      </Box>
    </Box>
  );
}

function MemberCard({ member, isFirst }) {
  const { name, designation, image } = member;

  return (
    <Card
      sx={{
        width: 280,
        height: 430,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 5,
          transform: "translateY(-5px)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          alt={name}
          src={image}
          sx={{
            borderRadius: 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          height={400}
          width={400}
        />
      </Box>

      <Typography variant='subtitle1' sx={{ mt: 8, mb: 0.5 }}>
        {name}
      </Typography>

      <Typography variant='body2' sx={{ mb: 2, color: "text.secondary" }}>
        {designation}
      </Typography>

      {isFirst && (
        <Box
          sx={{
            "&:hover": {
              backgroundColor: "#00A76F",
            },
          }}
        >
          <a
            href='https://calendar.google.com/calendar/appointments/schedules/AcZssZ1-0YrraZrcWyTUUrowfsWSDMKPOj57Lt8u9X-NcjC2Oz522EPBGzsD4SjjpkUzwHJOMePNPnbw?gv=true'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              width: "200px",
              padding: "8px 16px",
              backgroundColor: "#00A76F",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              textDecoration: "none",
              position: "absolute",
              top: "63%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 600,
            }}
          >
            Book an appointment
          </a>
        </Box>
      )}

      <Stack
        direction='row'
        alignItems='center'
        justifyContent='center'
        sx={{
          position: "absolute",
          bottom: 5,
          left: 0,
          right: 0,
          p: 1,
        }}
      >
        {member.social.map((link, index) => {
          const Icon = _socials[index]?.icon;
          return (
            <IconButton
              key={_socials[index]?.name}
              href={link}
              target='_blank'
              rel='noopener noreferrer'
            >
              {Icon ? <Icon /> : null}
            </IconButton>
          );
        })}
      </Stack>
    </Card>
  );
}
