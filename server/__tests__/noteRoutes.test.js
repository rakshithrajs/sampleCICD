// Import dependencies
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

require("dotenv").config();

console.log(process.env.dbURL);

process.env.NODE_ENV = "test";

beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Disconnect after tests
    await mongoose.connection.close();
});

describe("Notes API", () => {
    let noteId;

    // Test for fetching all notes
    it("should fetch all notes", async () => {
        const res = await request(app).get("/allNotes");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("msg");
    });

    // Test for adding a new note
    it("should add a new note", async () => {
        const res = await request(app)
            .post("/addNote")
            .send({ title: "Test Note", details: "This is a test note" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "msg",
            "Your note was saved successfully!"
        );
        noteId = res.body.content._id; // Save note ID for other tests
    });

    // Test for fetching a specific note
    it("should fetch a specific note", async () => {
        const res = await request(app).get(`/noteDetails/${noteId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "msg",
            "The note was fetched successfully!"
        );
        expect(res.body.content).toHaveProperty("title", "Test Note");
    });

    // Test for updating a note
    it("should update a note", async () => {
        const res = await request(app)
            .patch(`/updateNote/${noteId}`)
            .send({ title: "Updated Test Note" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "msg",
            "The note was updated successfully!"
        );
        expect(res.body.content).toHaveProperty("title", "Updated Test Note");
    });

    // Test for deleting a note
    it("should delete a note", async () => {
        const res = await request(app).delete(`/deleteNote/${noteId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "msg",
            "The note was successfully deleted!"
        );
    });
});

describe("Message API", () => {
    // Test for submitting feedback
    it("should submit feedback", async () => {
        const res = await request(app).post("/submitFeedback").send({
            name: "User",
            email: "user@example.com",
            message: "Great app!",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("msg", "Thank you for your feedback!");
    });
});
