import { describe, it, expect } from "vitest";
import { createTodoId } from "./todos";

describe("createTodoId", () => {
  it("generates unique non-empty ids", () => {
    const a = createTodoId();
    const b = createTodoId();

    expect(typeof a).toBe("string");
    expect(a.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });
});
