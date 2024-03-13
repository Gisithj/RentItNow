export  const validateEmail = (value:string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
export const validatePassword = (value:string) => {
    // Regex pattern for password validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&?@"]).{8,}$/;
    return passwordRegex.test(value);
  };

export const passowrdError = (valuePassword:string)=>{
    const missingRequirements = [];
    if (!/[a-zA-Z]/.test(valuePassword)) {
      missingRequirements.push("a letter");
    }
    if (!/\d/.test(valuePassword)) {
      missingRequirements.push("a digit");
    }
    if (!/[!#$%&?@"]/.test(valuePassword)) {
      missingRequirements.push("a special character (!#$%&?@)");
    }
    if (valuePassword.length < 8) {
        missingRequirements.push("at least 8 characters");
      }
    
    return missingRequirements[0];
}