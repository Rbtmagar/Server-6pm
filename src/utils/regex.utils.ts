const emailRegexPattern = process.env.EMAIL_REGEX!;
const emailRegexFlags = process.env.EMAIL_REGEX_FLAGS || '';

export const emailRegex = new RegExp(emailRegexPattern, emailRegexFlags);
