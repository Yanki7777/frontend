import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Empty({ tickerInfo }) {


    console.log(tickerInfo);
    return (
        <Paper elevation={3} style={{
            minHeight: '100%',
        }}>
            <Typography variant="h4" component="h3" gutterBottom>
                <strong>Hi</strong>
            </Typography>
        </Paper>
    );
}

export default Empty;
