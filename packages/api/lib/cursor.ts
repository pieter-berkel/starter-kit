export type CursorValue = string | number | boolean | null;

export type CursorPayload = Record<string, CursorValue>;

export const encodeCursor = <T extends CursorPayload>(payload: T): string => {
  const json = JSON.stringify(payload);
  return Buffer.from(json).toString("base64url");
};

export const decodeCursor = <T extends CursorPayload>(cursor: string): T => {
  try {
    const json = Buffer.from(cursor, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    throw new Error("Invalid cursor");
  }
};
