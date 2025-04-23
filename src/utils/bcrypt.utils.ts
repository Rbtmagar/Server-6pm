import bcrypt from 'bcryptjs';


/**
 * Hashes a given string using bcrypt.
 * @param value - The plaintext string to hash.
 * @returns A Promise resolving to the hashed string.
 */
export const hash = async (value: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  };
  
  /**
   * Compares a plaintext value with a hashed one.
   * @param value - The plaintext string to compare.
   * @param hashedValue - The hashed string to compare against.
   * @returns A Promise resolving to a boolean indicating if they match.
   */
export const compare = async (value: string, hashedValue: string): Promise<boolean> => {
    return await bcrypt.compare(value, hashedValue);
  };