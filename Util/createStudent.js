const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read the database
function readDatabase() {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

// Helper function to write to the database
function writeDatabase(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// POST endpoint to create a new student
router.post('/students', (req, res) => {
    const { studentID, name } = req.body;

    // Validation: Check if studentID and name are provided
    if (!studentID || !name) {
        return res.status(400).json({ error: "studentID and name are required" });
    }

    // Read current data from the database
    const db = readDatabase();

    // Check for unique studentID
    const existingStudent = db.students.find(student => student.studentID === studentID);
    if (existingStudent) {
        return res.status(400).json({ error: "Student ID already exists" });
    }

    // Create new student object
    const newStudent = { studentID, name };

    // Add to the students array
    db.students.push(newStudent);

    // Write updated data to the database
    writeDatabase(db);

    // Send success response
    res.status(201).json({ message: "Student created successfully", student: newStudent });
});

module.exports = router;
