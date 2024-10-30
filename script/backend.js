const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const dbFilePath = path.join(__dirname, 'database', 'tracker.json');

// Helper function to read JSON data
function readData() {
    return new Promise((resolve, reject) => {
        fs.readFile(dbFilePath, 'utf8', (err, data) => {
            if (err) return reject(err);
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Helper function to write JSON data
function writeData(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Endpoint to update the count of a specific region
app.post('/update-count', async (req, res) => {
    const { state, value } = req.body;

    try {
        // Read current data
        const data = await readData();

        // Update the count for the specified region
        if (data.hasOwnProperty(state)) {
            data[state] += value; // Increment or decrement
            await writeData(data); // Write updated data to the JSON file
            res.json({ newCount: data[state] });
        } else {
            res.status(404).json({ error: 'State not found' });
        }
    } catch (error) {
        console.error("Error updating count:", error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Endpoint to retrieve all counts (for initial load or refresh)
app.get('/get-counts', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Initialize the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
