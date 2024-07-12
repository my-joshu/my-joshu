export function createQuestionsInsertChannelName(
  presentationId: string
): string {
  return createChannelName("questions-insert", presentationId);
}

function createChannelName(baseName: string, id: string): string {
  return `${baseName}-${id}`;
}
