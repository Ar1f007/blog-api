
/**
 * @desc Shows error message for non empty fields.
 * @param {object} { fieldName: string, type: 'text' | 'number' | 'date' | string } 
 * @returns object with required_error and invalid_type_error message associated with the given field name
 */

const nonEmptyErrMsg = ({ fieldName, type }) => {
  return {
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a type of ${type}`,
  };
};


module.exports = nonEmptyErrMsg;