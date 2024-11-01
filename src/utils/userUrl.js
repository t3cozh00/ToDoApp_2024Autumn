export function generateUniqueIdentifier(email) {
  const prefix = email.split("@")[0];
  const randomString1 = Math.random().toString(36).substring(2, 10);
  const randomString2 = Math.random().toString(36).substring(2, 10);

  return `${randomString1}${prefix}${randomString2}`;
}
