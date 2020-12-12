export const rejectError = (error) => {
  let message = 'Oops smth went wrong (logged inside helpers)';
  const { response } = error;

  // #note using (A&&B&&C), otherwise chance to get "cannot read prop. message of undefined" opt
  // #task shorten (response.data.errors.message || response.data.message) or let it be so opt
  if (
    response &&
    response.data &&
    (response.data.errors.message || response.data.message)
  ) {
    if (response.data.errors.message) {
      message = error.response.data.errors.message;
    } else {
      message = error.response.data.message;
    }
  }

  return Promise.reject(message);
};
