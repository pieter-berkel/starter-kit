type CursorValueType = "string" | "number" | "date";

type SerializedCursorPayload = {
  value: string;
  type: CursorValueType;
  id: string;
};

export type CursorPayload = {
  value: string | number | Date;
  id: string;
};

const detectValueType = (value: CursorPayload["value"]): CursorValueType => {
  if (value instanceof Date) {
    return "date";
  }
  if (typeof value === "number") {
    return "number";
  }
  return "string";
};

const serializeValue = (
  value: CursorPayload["value"]
): { value: string; type: CursorValueType } => {
  const type = detectValueType(value);

  switch (type) {
    // Warning! Precision can be lost if the precision in the database is larger than 3
    case "date":
      return { value: (value as Date).toISOString(), type };
    case "number":
      return { value: String(value), type };
    default:
      return { value: String(value), type };
  }
};

const deserializeValue = (value: string, type: CursorValueType): CursorPayload["value"] => {
  switch (type) {
    // Warning! Precision can be lost if the precision in the database is larger than 3
    case "date":
      return new Date(value);
    case "number":
      return Number(value);
    default:
      return value;
  }
};

export const encodeCursor = (payload: CursorPayload): string => {
  const { value, type } = serializeValue(payload.value);

  const serialized: SerializedCursorPayload = {
    value,
    type,
    id: payload.id,
  };

  return Buffer.from(JSON.stringify(serialized), "utf8").toString("base64url");
};

export const decodeCursor = (cursor: string): CursorPayload => {
  const serialized: SerializedCursorPayload = JSON.parse(
    Buffer.from(cursor, "base64url").toString("utf8")
  );

  return {
    value: deserializeValue(serialized.value, serialized.type),
    id: serialized.id,
  };
};
