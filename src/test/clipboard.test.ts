import { describe, expect, it } from "vitest";
import { copyText } from "@/lib/clipboard";

describe("copyText", () => {
  it("returns true only when the clipboard resolves", async () => {
    const target = { writeText: async () => {} };
    await expect(copyText("npx qronos-cli", target)).resolves.toBe(true);
  });

  it("returns false when the clipboard rejects", async () => {
    const target = {
      writeText: async () => {
        throw new Error("denied");
      },
    };
    await expect(copyText("npx qronos-cli", target)).resolves.toBe(false);
  });

  it("returns false when there is no clipboard at all", async () => {
    await expect(copyText("npx qronos-cli", {})).resolves.toBe(false);
  });

  it("passes the text through unchanged", async () => {
    let seen = "";
    const target = {
      writeText: async (value: string) => {
        seen = value;
      },
    };
    await copyText("qronos --provider openai", target);
    expect(seen).toBe("qronos --provider openai");
  });
});
