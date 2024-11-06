import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
import { expect } from "chai";

const base_url = "http://localhost:3001";

describe("GET tasks", () => {
  let token;

  before(async () => {
    await initializeTestDb();
    const userId = await insertTestUser("test44@foo.com", "test4412345");
    token = getToken(userId, email);
    console.log("Database initialized for testing.");
  });

  it("should get all tasks", async () => {
    //const token = getToken("test44@foo.com");
    const response = await fetch(`${base_url}/tasks`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log("Response Status:", response.status, "in index.test.js");
    console.log("Retrieved Data:", data, "in index.test.js");

    expect(response.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.all.keys(
      "id",
      "description",
      "user_id",
      "user_email"
    );
  });
});

describe("POST task", () => {
  const email = "post@foo.com";
  const password = "post123";
  let token;
  before(async () => {
    const userId = await insertTestUser(email, password);
    token = getToken(userId, email);
  });

  it("should post a task", async () => {
    const response = await fetch(`${base_url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "Task from unit test" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not post a task without description", async () => {
    const response = await fetch(`${base_url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });

  it("should not post a task with zero length description", async () => {
    const response = await fetch(`${base_url}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("DELETE task", () => {
  const email = "delete@foo.com";
  const password = "delete123";
  let token;
  before(async () => {
    const userId = await insertTestUser(email, password);
    token = getToken(userId, email);
  });

  it("should delete a task", async () => {
    const response = await fetch(`${base_url}/delete/1`, {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not delete a task with SQL injection", async () => {
    const response = await fetch(`${base_url}/delete/id=0 or id > 0`, {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST register", () => {
  const email = "register@foo.com";
  const password = "register123";

  it("should register with valid email and password", async () => {
    const response = await fetch(`${base_url}/user/register`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email");
  });

  it("should not post a user with less than 8 character password", async () => {
    const email = "register@foo.com";
    const password = "short1";
    const response = await fetch(`${base_url}/user/register`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST login", () => {
  const email = "login@foo.com";
  const password = "login123";
  let token;
  before(async () => {
    await insertTestUser(email, password);
  });

  it("should login with valid credentials", async () => {
    const response = await fetch(`${base_url}/user/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "token");
  });
});
