/**
 * Common fields Joi errors
 * @param {string} fieldName
 * @returns object - with error fields and value
 */
const commonErrMsg = (key, fieldsArr) => {
  const mapErrorMsg = {};

  fieldsArr.map((field) => {
    if (field === 'empty') {
      mapErrorMsg['string.empty'] = `${key} is a required field`;
    }

    if (field === 'required') {
      mapErrorMsg['any.required'] = `${key} is a required field`;
    }

    if (field === 'min') {
      mapErrorMsg['string.min'] = `can not be less than {#limit} characters`;
    }

    if (field === 'max') {
      mapErrorMsg['string.max'] = `can not be greater than {#limit} characters`;
    }
  });

  return mapErrorMsg;
};

module.exports = commonErrMsg;