export const rejectError = (error) => {
  let message = 'Oops smth went wrong';
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

export const applyFilters = (url, filter) => {
  if (filter) {
    let filterEntities = '';
    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }

    Object.keys(filter).forEach((key) => {
      filterEntities += `${key}=${filter[key]}&`;
    });

    if (filterEntities.slice(-1) === '&') {
      filterEntities = filterEntities.slice(0, -1);
    }

    url += filterEntities;
  }

  return url;
};

export const processLocation = (location) =>
  location
    .toLowerCase()
    .replace(/[\s,]+/g, '')
    .trim();
