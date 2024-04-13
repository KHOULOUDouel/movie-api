// Import required modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Define the port to listen on
const port = 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);

    // Determine the file path based on the request URL
    let filePath = path.join(__dirname, parsedUrl.pathname === '/documentation' ? 'documentation.html' : 'index.html');

    // Log the request URL and timestamp to the log.txt file
    const logData = `${parsedUrl.pathname} - ${new Date().toISOString()}\n`;
    fs.appendFile('log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    // Read the file content
    fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });

});

// Start the server and listen for requests
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});