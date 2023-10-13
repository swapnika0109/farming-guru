import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Typography, Grid, Paper } from '@mui/material';
import Land from './components/Land'; // Your existing Land component

function App() {
  const [selectedBlock, setSelectedBlock] = useState(null);

  const handleBlockSelection = (block) => {
    setSelectedBlock(block);
  };

  return (
    <div>
      {/* App Bar at the top */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="H6">
            Farmer Guru
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              {/* Display your Land component */}
              <Land onBlockSelect={handleBlockSelection} />
            </Paper>
          </Grid>

          {selectedBlock && (
            <Grid item xs={12}>
              <Paper>
                {/* Display additional properties or details here */}
                <Typography variant="h5">Selected Block: {selectedBlock.name}</Typography>
                <Typography variant="body1">Other properties or details about the selected block.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
