import { APIGatewayProxyResult } from "aws-lambda";


export const sendError = (
  statusCode: number,
  error?: unknown,
): APIGatewayProxyResult => {
  const errorDetail = getErrorDetail(error);

  return {
    statusCode,
    body: JSON.stringify({ error: errorDetail }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

function getErrorDetail(error: unknown): ApiErrorDetail  {
  if (error instanceof Error) {
    const detail: ApiErrorDetail = {
      message: error.message,
      type: error.name,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };

    const code = (error as any).code;
    const requestId = (error as any).requestId;
    const meta = (error as any).meta;

    if (code && requestId) {
      detail.type = "AWSServiceError";
      detail.code = code;
    } else if (code && meta) {
      detail.type = "DatabaseError";
      detail.code = code;
    }

    return detail;
  }

  if (typeof error === "string") {
    return { message: error, type: "StringError" };
  }

  if (typeof error === "object" && error !== null) {
    return {
      message: (error as any).message || "Unexpected object error.",
      type: (error as any).type || "UnknownObjectError",
    };
  }

  return { message: "An unknown error occurred." };
};


