"use client";

import { Container, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography component="h1" variant="h3" gutterBottom>Guten Sites</Typography>
      <Paper component="section" variant="outlined" sx={{ p: 3, mt: 3 }} aria-labelledby="site-address-title">
        <Typography id="site-address-title" component="h2" variant="h5" gutterBottom>Open a publication</Typography>
        <Typography color="text.secondary">
          Visit the website address of the publication you want to read, or use the direct link you were given.
        </Typography>
      </Paper>
    </Container>
  );
}
