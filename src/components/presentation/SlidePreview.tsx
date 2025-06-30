// components/SlidePreview.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const PRIMARY_GREEN = '#07B37A';

export default function SlidePreview({ slide, index, activeTab, onTabChange }) {
  return (
    <Card sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
      <CardContent sx={{ p: '0 !important' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5', px: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => onTabChange(index, newValue)}
            aria-label={`Tabs for slide ${index + 1}`}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: PRIMARY_GREEN },
              '& .Mui-selected': { color: `${PRIMARY_GREEN} !important` },
            }}
          >
            <Tab label="Preview" value="preview" />
            <Tab label="Thinking" value="thinking" />
            <Tab label="Code" value="code" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          {activeTab === 'preview' && (
            <Box sx={{ height: '400px', position: 'relative', width: '100%' }}>
              <iframe
                srcDoc={slide.body}
                style={{
                  width: '333.33%', height: '333.33%',
                  transform: 'scale(0.3)', transformOrigin: 'top left',
                  position: 'absolute', top: 0, left: 0,
                  border: 'none', display: 'block', pointerEvents: 'none',
                }}
                title={`Slide ${slide.slide_index + 1}`}
              />
            </Box>
          )}
          {activeTab === 'thinking' && (
            <Box sx={{ p: 2, minHeight: '400px', maxHeight: '400px', bgcolor: '#f8f9fa', borderRadius: 1, overflowY: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                {slide?.thought}
              </Typography>
            </Box>
          )}
          {activeTab === 'code' && (
            <Box sx={{ minHeight: '400px' }}>
              <pre style={{ backgroundColor: '#f8f9fa', color: '#333', padding: 16, borderRadius: 8, overflow: 'auto', border: '1px solid #e0e0e0', maxHeight: '400px' }}>
                <code>
                  {`\n${slide.body}`}
                </code>
              </pre>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}