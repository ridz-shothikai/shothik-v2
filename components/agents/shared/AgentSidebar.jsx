import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const AgentSidebar = () => {
  const pathname = usePathname();
  const isActive = pathname === '/agents';

  return (
    <List component="nav" aria-label="Agent navigation">
      <ListItem disablePadding>
        <Link href="/agents" passHref legacyBehavior>
          <ListItemButton selected={isActive} component="a">
            <ListItemIcon>
              <SmartToyIcon color={isActive ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Agents" />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
  );
};

export default AgentSidebar; 