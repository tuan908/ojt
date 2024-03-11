const fs = require('fs');
const path = require("path")

// Function to generate random student name
function generateRandomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack', 'Katie', 'Liam', 'Mia', 'Nathan', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zack'];
    return names[Math.floor(Math.random() * names.length)];
}

// Function to generate random school year
function generateRandomSchoolYear() {
    const grades = ['1st grade', '2nd grade', '3rd grade', '4th grade', '5th grade', '6th grade', '7th grade', '8th grade', '9th grade', '10th grade', '11th grade', '12th grade'];
    return grades[Math.floor(Math.random() * grades.length)];
}

// Function to generate random event
function generateRandomEvent() {
    const events = ['Sports Day', 'Science Fair', 'Music Competition', 'Art Exhibition', 'Debate Competition', 'Field Trip', 'Cultural Festival', 'Math Olympiad', 'Literature Contest'];
    const status = Math.floor(Math.random() * 3); // 0, 1, or 2
    const comments = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const _id = Math.floor(Math.random() * events.length)
    const id = 'PT' + _id.toString().padStart(5, '0')
    return {
        _id, // Just for unique identification
        id,
        name: events[_id > events.length - 1 ? events.length - 1 : _id],
        status,
        comments
    };
}

// Function to generate random hashtag
function generateRandomHashtag() {
    const colors = ['#f2b2bf', '#fb5252', '#fca120', '#edb183', '#fcde88', '#bdd333', '#4ad295', '#92cdfa', '#1273eb', '#8080f1', '#bac8d3', '#58595b'];
    const _id = Math.floor(Math.random() * colors.length)
    const id = 'HT' + _id.toString().padStart(5, '0')
    return {
        _id, // Just for unique identification
        id,
        name: '#Hashtag' + id.replace("HT", ""),
        color: colors[_id > colors.length - 1 ? colors.length - 1 : _id]
    };
}

// Generate 100 objects
const data = [];
for (let i = 0; i < 100; i++) {
    const studentId = i.toString().padStart(5, '0');
    data.push({
        _id: i,
        id: 'SE' + studentId,
        studentCode: 'ST' + studentId,
        studentName: generateRandomName(),
        schoolYear: generateRandomSchoolYear(),
        events: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, generateRandomEvent),
        hashtags: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, generateRandomHashtag)
    });
}

// Write data to JSON file
fs.writeFileSync(path.join(__dirname, "migrations", 'student-events.json'), JSON.stringify(data, null, 2));
