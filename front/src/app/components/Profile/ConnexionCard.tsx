import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type ConnexionCardProps = {
  children: ReactNode;
  title: string;
};

const ConnexionCard = ({ children, title }: ConnexionCardProps) => {
  return (
    <Container>
      <Box
        my={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={4}
        p={2}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4" align="center">
              {title}
            </Typography>
            {children}
          </Card>
        </Stack>
      </Box>
    </Container>
  );
};

export default ConnexionCard;
