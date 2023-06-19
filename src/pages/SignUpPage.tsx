import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Copyright from '@/components/Copyright/Copyright';
import useRegister from '@/hooks/apis/useRegister';

import type { FormEvent } from 'react';
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpPage() {
  const { isLoading, register } = useRegister();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogContents, setDialogContents] = useState<{
    title: string;
    body: string;
    buttonText: string;
    handleClick: () => void;
  }>({
    title: '',
    body: '',
    buttonText: '',
    handleClick: () => {},
  });

  const navigator = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registerInfo = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    if (registerInfo.email === '') {
      setDialogContents({
        title: '오류',
        body: '이메일 정보가 올바르지 않습니다.',
        buttonText: '닫기',
        handleClick: () => setOpenDialog(false),
      });
      setOpenDialog(true);
    } else if (registerInfo.password === '') {
      setDialogContents({
        title: '오류',
        body: '비밀번호를 입력해주세요.',
        buttonText: '닫기',
        handleClick: () => setOpenDialog(false),
      });
      setOpenDialog(true);
    } else {
      !isLoading &&
        register(registerInfo, {
          onSuccess: () => {
            setDialogContents({
              title: '회원가입 성공',
              body: '회원가입에 성공했습니다.',
              buttonText: '로그인 화면 이동',
              handleClick: () => {
                setOpenDialog(false);
                navigator('/login');
              },
            });
            setOpenDialog(true);
          },
        });
    }
  };

  return (
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{dialogContents.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{dialogContents.body}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={dialogContents.handleClick} autoFocus>
              {dialogContents.buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
