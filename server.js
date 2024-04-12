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

    // Read the file content
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 404 response
            res.writeHead(404);
            res.end('File not found');
        } else {
            // Set the response content type based on the file extension
            const contentType = getContentType(filePath);
            res.setHeader('Content-Type', contentType);

            // Send the file content as the response
            res.writeHead(200);
            res.end(data);
        }
    });
});

// Start the server and listen for requests
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to determine content type based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        default:
            return 'text/plain';
    }
}

// Create an HTTP server for logging
const logServer = http.createServer((req, res) => {
    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);

    // Log the request URL and timestamp to the log.txt file
    const logData = `${parsedUrl.pathname} - ${new Date().toISOString()}\n`;
    fs.appendFile('log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    // Send a response
    res.setHeader('Content-Type', 'text/plain');
    res.end('Request logged\n');
});

// Start the logging server and listen for requests
logServer.listen(port + 1, () => {
    console.log(`Logging server is running on http://localhost:${port + 1}`);
});
