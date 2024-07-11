import { expect, test } from "vitest";
import { createQuestionsInsertChannelName } from "./channelName";

test("createQuestionsInsertChannelName", () => {
  const presentationId = "123";
  const result = createQuestionsInsertChannelName(presentationId);
  expect(result).toBe(`questions-insert-${presentationId}`);
});

test("createQuestionsInsertChannelName returns different channel names for different presentation IDs", () => {
  const presentationId1 = "123";
  const presentationId2 = "456";
  const result1 = createQuestionsInsertChannelName(presentationId1);
  const result2 = createQuestionsInsertChannelName(presentationId2);

  expect(result1).toBe(`questions-insert-${presentationId1}`);
  expect(result2).toBe(`questions-insert-${presentationId2}`);
  expect(result1).not.toBe(result2);
});
