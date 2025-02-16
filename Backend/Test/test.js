const sinon = require("sinon");
const superTest = require("supertest");
const { describe, it } = require("mocha");
const createWorkerModel = require("../models/DynamicWorker");
const config = require("../config.json");

const insertOneStub = sinon.stub().resolves();
const insertManyStub = sinon.stub().resolves();
const deleteManyStub = sinon.stub().resolves();
const aggregateStub = sinon.stub().resolves([
  { _id: "Pending", count: 5 },
  { _id: "Completed", count: 3 },
]);
// Stub the createWorkerModel function to return our own stubs

sinon.stub(createWorkerModel, "createWorkerModel").callsFake(() => ({
  insertOne: insertOneStub,
  insertMany: insertManyStub,
  deleteMany: deleteManyStub,
  aggregate: aggregateStub,
}));

afterEach(() => {
  sinon.restore(); // Restore all stubs, mocks, and spies
});
//Server
const app = require("../server");

// Test endpoint to get all collections
describe("GET/api/w1/get-collections", () => {
  // Test 1
  it("returns all collections", async () => {
    const { expect } = await import("chai");
    let mockCollection = ["User", "Tester", "Student"];

    sinon.stub(config, "Collections").value(mockCollection);
    const res = await superTest(app).get("/api/w1//get-collections");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
  //Test 2
  it("it should return server error", async () => {
    let mockCollection;
    const { expect } = await import("chai");
    sinon.stub(config, "Collections").value(mockCollection);
    const res = await superTest(app).get("/api/w1/get-collections");
    let mockError = "error";
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property(mockError);
  });
});

// Test endpoint to create a task in Doers collection
describe("POST/api/w1/add-worker/:collectionName", () => {
  // Restore all stubs after each test

  // Test 1
  it("returns status 200 and a task object", async () => {
    const { expect } = await import("chai");
    const res = await superTest(app).post("/api/w1/add-worker/User").send({
      TaskName: "Test Task",
      TaskDescription: "Test Description",
      Type: "new",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Worker added successfully");
  });
  //Test2
  it("Returns status 200 and Multiple Task added", async () => {
    const dummyData = [
      { TaskName: "new", TaskDescription: "Test Description", Type: "new" },
      { TaskName: "new", TaskDescription: "Test Description", Type: "new" },
    ];
    const { expect } = await import("chai");
    const res = await superTest(app)
      .post("/api/w1/add-worker/User")
      .send([...dummyData]);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Worker added successfully");
    sinon.assert.calledOnce(insertManyStub);
    sinon.assert.calledWith(insertManyStub, dummyData);
  });
  //Test 3
  it("returns status 500 and error message", async () => {
    // Mocking error
    insertOneStub.rejects(new Error("Database error"));
    const { expect } = await import("chai");
    const res = await superTest(app).post("/api/w1/add-worker/User").send({
      TaskName: "Test Task",
      TaskDescription: "Test Description",
      Type: "new",
    });

    let mockError = "error";
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property(mockError);
  });
});

// Test endpoint to delete single and multiple jobs in collections

describe("DELETE/api/w1/delete-jobs/:collectionName", () => {
  // Test 1
  it("returns status 200 and a success message", async () => {
    const { expect } = await import("chai");
    const res = await superTest(app)
      .delete("/api/w1/delete-jobs/User")
      .send({ ids: [{ _id: "123" }, { _id: "456" }] });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Jobs deleted successfully");
  });
  //Test 2
  it("returns status 500 and error message", async () => {
    // Mocking error
    deleteManyStub.rejects(new Error("Database error"));
    const { expect } = await import("chai");
    const res = await superTest(app)
      .delete("/api/w1/delete-jobs/User")
      .send({ ids: [{ _id: "123" }, { _id: "456" }] });
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("error", "Database error");
  });
});

// Test endpoint to get all status by count

describe("GET/api/w1/get-statusCounts/:collectionName", () => {
  // Test 1
  it("returns status 200 and status count", async () => {
    const { expect } = await import("chai");
    const res = await superTest(app).get("/api/w1/get-statusCounts/User");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("statusCounts").that.is.an("array");
    expect(res.body.statusCounts).to.deep.include({ _id: "Pending", count: 5 });
  });
  //Test 2
  it("returns status 500 and error message", async () => {
    // Mocking error
    aggregateStub.rejects(new Error("Database error"));
    const { expect } = await import("chai");
    const res = await superTest(app).get("/api/w1/get-statusCounts/User");
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("error", "Database error");
  });
});

// Test endpoint to get all tasks by status
describe("GET/api/w1/get-jobs/:collectionName", () => {
  // Test 1
  it("should return jobs with pagination and totalPage", async () => {
    aggregateStub.resolves([
      {
        metaData: [{ total: 20 }],
        data: [
          { jobId: 1, status: "Pending" },
          { jobId: 2, status: "Pending" },
        ],
      },
    ]);

    const { expect } = await import("chai");
    const res = await superTest(app)
      .get("/api/w1/get-jobs/User")
      .query({ statusName: "Pending", pageNo: 1, limit: 10 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("jobs").that.is.an("array");
    expect(res.body).to.have.property("totalPage");
    expect(res.body.jobs).to.deep.include({ jobId: 1, status: "Pending" });
    expect(res.body.totalPage).to.equal(2);
  });
  //Test 2
  it("Should return empty array and page number 0 if no matching status", async () => {
    aggregateStub.resolves([
      {
        metaData: [{ total: 0 }],
        data: [],
      },
    ]);
    const { expect } = await import("chai");
    const res = await superTest(app).get("/api/w1/get-jobs/User").query({
      statusName: "Completed",
      pageNo: 1,
      limit: 10,
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("jobs").that.is.deep.equal([]);
    expect(res.body).to.have.property("totalPage").that.is.equal(0);
  });
  //Test 3
  it("returns status 500 and error message", async () => {
    // Mocking error
    aggregateStub.rejects(new Error("Database error"));
    const { expect } = await import("chai");
    const res = await superTest(app)
      .get("/api/w1/get-jobs/User")
      .query({ statusName: "Pending", pageNo: 1, limit: 10 });
    expect(res.status).to.equal(500);
    expect(res.body).to.have.property("error", "Database error");
  });
  // Test 4
  it("should handle missing or invalid query parameters gracefully", async () => {
    const { expect } = await import("chai");
    const res = await superTest(app)
      .get("/get-jobs/User")
      .query({ statusName: "Pending" }); // Missing pageNo and limit

    expect(res.status).to.equal(404);
  });
});
