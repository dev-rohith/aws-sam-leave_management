  export const response = (
    statusCode: number,
    message: string,
    data?: object,
    headers?: { [key: string]: string }
  ): ApiResponse => {
    return {
      statusCode,
      body: JSON.stringify({ message, data }),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  };


