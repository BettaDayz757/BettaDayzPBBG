import { POST, GET } from "./chat";
import { NextRequest } from "next/server";

describe("Chat API", () => {
  it("should insert and fetch chat messages", async () => {
    const postReq = { json: async () => ({ user: "TestUser", message: "Hello!" }) } as NextRequest;
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);

    const getRes = await GET();
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(Array.isArray(getData.messages)).toBe(true);
  });
});
