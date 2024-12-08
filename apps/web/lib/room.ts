export function generateRoomId() {

  const minLength = Math.floor(Math.random() * 10) + 5;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Generate random part
  const randomPart = Array.from({ length: minLength }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');

  // Append a timestamp for uniqueness
  const timestamp = Date.now().toString(36); // Base-36 encoded timestamp for compactness

  // Combine and shuffle random part and timestamp
  const combined = randomPart + timestamp;
  const shuffledCode = combined
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return shuffledCode;
}

