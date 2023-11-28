import { expect, test } from "bun:test";
import Yundict from "../src";

// Load API token from environment variable
const API_TOKEN = process.env.API_TOKEN || "";

let yundict: Yundict;

test("Initialize", () => {
  yundict = new Yundict({
    apiToken: API_TOKEN
  });
  expect(yundict).toBeInstanceOf(Yundict);
  expect(yundict.config.apiToken).toBe(API_TOKEN);
});

