import { helpers } from 'vuelidate/lib/validators';

export const supportedFileTypes = (value) => {
  // #task #res explain workflow usage opt
  if (!helpers.req(value)) return true;

  const supportedFormats = ['png', 'jpg', 'jpeg', 'svg', 'gif'];
  const extension = value.split('.').pop();
  return supportedFormats.includes(extension);
};
