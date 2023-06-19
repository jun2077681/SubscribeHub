import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import type { ComponentProps } from 'react';

function Copyright(props: ComponentProps<typeof Typography>) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">SubscribeHub</Link> {new Date().getFullYear()}.
    </Typography>
  );
}

export default Copyright;
