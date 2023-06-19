import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AuthToken } from '@/hooks/apis/useLogin';
import useLogout from '@/hooks/apis/useLogout';
import { jwtDecode } from '@/utils/jwt';
import { getStorageItem } from '@/utils/storage';

const Header = () => {
  const token = getStorageItem<AuthToken>('user')?.access_token ?? '';
  const user = jwtDecode<{ sub: string }>(token)?.sub;

  const navigate = useNavigate();

  const { logout } = useLogout();

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: () => navigate('/login'),
    });
  }, []);

  const goMain = useCallback(() => {
    navigate('/');
  }, []);

  const goSetting = useCallback(() => {
    navigate('/setting');
  }, []);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography onClick={goMain} variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, cursor: 'pointer' }}>
          SubscribeHub
        </Typography>
        <Typography variant="h6" noWrap align="center" sx={{ px: 2, cursor: 'default' }}>
          {user}
        </Typography>

        <Button onClick={goSetting} variant="contained" sx={{ my: 1, mx: 1 }}>
          Setting
        </Button>
        <Button onClick={handleLogout} variant="outlined" sx={{ my: 1, mx: 1 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
