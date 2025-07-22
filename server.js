const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 'Assets' folder at /assets URL
app.use('/assets', express.static(path.join(__dirname, 'Assets')));

// Serve the 'Fonts' folder at /fonts URL
app.use('/fonts', express.static(path.join(__dirname, 'Fonts')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
