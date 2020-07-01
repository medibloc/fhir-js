export function prettifiyObject(sourceObject: Record<string, unknown>) {
  return JSON.stringify(sourceObject, undefined, 2);
}

export function prettifiyJSON(sourceJSON: string) {
  return prettifiyObject(JSON.parse(sourceJSON));
}
