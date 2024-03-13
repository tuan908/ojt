const fs = require('fs');
const path = require("path")

// Function to generate random hex color
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Generate hashtag list
const hashtagList = [];
for (let i = 0; i < 20; i++) {
    const id = 'HT' + i.toString().padStart(2, '0'); // Using padStart to add leading zeros
    const name = '#Hashtag' + i;
    const color = generateRandomColor();
    hashtagList.push({
        _id: i,
        id,
        name,
        color
    });
}

// Write data to JSON file
fs.writeFileSync(path.join(__dirname, "migrations",'hashtags.json'), JSON.stringify(hashtagList, null, 2));
