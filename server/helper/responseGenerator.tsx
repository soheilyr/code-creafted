export const responseGenerator = (
  data = {},
  message = "success!",
  status = 200,
  isError = false
) => {
  if (!isError) {
    return {
      status,
      message,
      data,
    };
  } else {
    return {
      status,
      message,
    };
  }
};
