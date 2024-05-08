export default function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.random();
  const uniqueId = `${timestamp}_${randomNum}`;
  return uniqueId;
}
