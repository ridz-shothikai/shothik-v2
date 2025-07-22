'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetchSlidesQuery } from '../../../redux/api/presentation/presentationApi';
import { usePresentation } from '../../../components/slide/context/SlideContext';
import SlidePreviewNavbar from '../../../components/slide/SlidePreviewNavbar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PresentationMode from "../../../components/presentation/PresentationMode";
import SlideCard from '../../../components/presentation/SlideCard';

// --- Main Page Component ---
export default function SlidesPreviewPage() {
  const [shouldPollSlides, setShouldPollSlides] = useState(true);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const { isPresentationOpen, closePresentation } = usePresentation();

  const { data: slidesData, isLoading: slidesLoading, error: slidesError } = useFetchSlidesQuery(projectId, {
    skip: !projectId,
    pollingInterval: shouldPollSlides ? 10000 : 0,
  });

  useEffect(() => {
    if (slidesData?.status === 'completed' || slidesData?.status === 'failed') {
      setShouldPollSlides(false);
    }
  }, [slidesData?.status]);

  if (slidesLoading) {
    return (
      <>
        <SlidePreviewNavbar slidesData={null} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
          <CircularProgress />
          <Typography>Loading slides...</Typography>
        </Box>
      </>
    );
  }

  if (slidesError) {
    return (
      <>
        <SlidePreviewNavbar slidesData={null} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
          <Typography color="error">Error loading slides</Typography>
        </Box>
      </>
    );
  }

  if (!slidesData?.data || slidesData.data.length === 0) {
    return (
      <>
        <SlidePreviewNavbar slidesData={null} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
          <Typography>No slides available</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <SlidePreviewNavbar slidesData={slidesData} />
      <PresentationMode
        slides={slidesData?.data || []}
        open={isPresentationOpen && slidesData?.data?.length > 0}
        onClose={closePresentation}
      />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4,
        px: 2
      }}>
        <Box sx={{ width: '100%', maxWidth: {xs: '90vw', sm:'60vw'}, mb: 3}}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Slides Preview
          </Typography>
          {slidesData.data.map((slide, index) => (
            <SlideCard
              key={slide.slide_index || index}
              slide={slide}
              index={index}
              totalSlides={slidesData.data.length}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}