export const jsonResponse = (statusCode: number, data: any) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};

export const errorResponse = (statusCode: number, message: string) => {
  return jsonResponse(statusCode, { error: message });
};
