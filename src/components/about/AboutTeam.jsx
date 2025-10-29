"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useRef, useState } from "react";
import Carousel from "react-slick";
import { _socials } from "../../_mock/socials";
import { team } from "../../_mock/team";
import CarouselArrows from "../../resource/carousel/CarouselArrows";

export default function AboutTeam() {
  const [_, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

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
    <div className="pb-10 text-center">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          DREAM TEAM
        </p>
      </motion.div>

      <motion.div
        initial={{ x: -30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold my-2">
          Great team is the key
        </h2>
      </motion.div>

      <motion.div
        initial={{ x: -30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="mx-auto max-w-[640px] text-muted-foreground">
          Shothik will provide you support if you have any problems, our support
          team will reply within a day and we also have detailed documentation.
        </p>
      </motion.div>

      <div className="relative mt-0">
        <CarouselArrows
          filled
          shape="rounded"
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
            {team.map((member, index) => (
              <div key={index} className="px-1 py-10">
                <MemberCard member={member} isFirst={index === 0} />
              </div>
            ))}
          </Carousel>
        </CarouselArrows>
      </div>
    </div>
  );
}

function MemberCard({ member, isFirst }) {
  const { name, designation, image } = member;

  return (
    <Card className="w-[280px] h-[430px] mx-auto flex flex-col items-center p-2 rounded-lg shadow-md relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Image
        alt={name}
        src={image}
        style={{
          borderRadius: "10px",
          width: "100%",
          height: "260px",
          objectFit: "cover",
        }}
        height={400}
        width={250}
      />

      <p className="text-base font-semibold mt-4 mb-1">
        {name}
      </p>

      <p className="text-sm text-muted-foreground">
        {designation}
      </p>

      {isFirst && (
        <div className="hover:bg-primary">
          <a
            href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1-0YrraZrcWyTUUrowfsWSDMKPOj57Lt8u9X-NcjC2Oz522EPBGzsD4SjjpkUzwHJOMePNPnbw?gv=true"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-[63%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] px-4 py-2 bg-primary text-primary-foreground rounded font-semibold no-underline cursor-pointer"
          >
            Book an appointment
          </a>
        </div>
      )}

      <div className="flex flex-row items-center justify-center absolute bottom-1 left-0 right-0 p-1">
        {member.social.map((link, index) => {
          const Icon = _socials[index];
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {Icon ? <Icon.icon style={{ color: Icon.color }} /> : null}
              </a>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
