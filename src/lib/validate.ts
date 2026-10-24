/**
 * Checks for what people type into the registration forms. Both are
 * deliberately forgiving about formatting and strict about the shape, so a
 * real address written oddly still passes and a typo does not.
 */

/** One @, something either side, and a dot in the domain. */
export function isEmail(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed || /\s/.test(trimmed)) return false
  return /^[^@]+@[^@.]+(\.[^@.]+)+$/.test(trimmed)
}

/**
 * A Georgian number is nine digits. Spaces, dashes and brackets are ignored,
 * as is a +995 country code or the 0 some people put in front of a mobile.
 */
export function isGeorgianPhone(value: string): boolean {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('995')) digits = digits.slice(3)
  else if (digits.startsWith('0')) digits = digits.slice(1)
  return digits.length === 9
}

/** Red only once they have typed something — an empty field is not an error. */
export const emailError = (value: string) => value.trim().length > 0 && !isEmail(value)
export const phoneError = (value: string) =>
  value.trim().length > 0 && !isGeorgianPhone(value)
