import { FieldError } from "./errorTypes.js";

export const generateErrors = (fields: string[], message: string) => {
  let errors: FieldError[] = [];
  fields.forEach((field) => {
    errors.push({
      field,
      message,
    });
  });
  return errors;
};
