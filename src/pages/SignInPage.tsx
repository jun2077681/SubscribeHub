import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

import Copyright from '@/components/Copyright/Copyright';
import { useAuthContext } from '@/context/AuthContext';
import useLogin from '@/hooks/apis/useLogin';
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage';

import type { FormEvent } from 'react';

const defaultTheme = createTheme();

export default function SignInPage() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const { isAuthenticated } = useAuthContext();
  const { isLoading, login } = useLogin({
    onError: (error: unknown) => {
      if (!(error instanceof AxiosError)) {
        return;
      }

      if (error.response?.status === 403) {
        return;
      }
    },
  });

  const checkRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginInfo = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };
    !isLoading &&
      login(loginInfo, {
        onSuccess: () => {
          if (checkRef.current?.checked) setStorageItem('savedEmail', data.get('email') as string);
          else removeStorageItem('savedEmail');
        },
        onError: () => {
          setOpenDialog(true);
        },
      });
  };

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              defaultValue={getStorageItem<string>('savedEmail') ?? ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              inputRef={checkRef}
              control={
                <Checkbox value="remember" color="primary" defaultChecked={!!getStorageItem<string>('savedEmail')} />
              }
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">로그인 실패</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">로그인 정보가 올바르지 않습니다.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
