export const formatDate = (dateString) => {
  if (!dateString || dateString.startsWith('01-01-1900')) return null;

  const [dd, mm, yyyy] = dateString.split(' ')[0].split('-'); // Splits "DD-MM-YYYY"
  return `${yyyy}-${mm}-${dd}`; // Returns "YYYY-MM-DD"
};

export const formatDateTime = (dateString) => {
  // Input: "16-01-15 11:33:00" → Output: "2015-01-16 11:33:00"
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, shortYear] = datePart.split('-');

  const fullYear = `${shortYear}`;

  return `${fullYear}-${month}-${day} ${timePart}`;
};

export const formatTime = (datetime = '') => {
  if (!datetime.includes(' ')) return 'Invalid time';

  const [, time] = datetime.split(' ');

  if (!time) return 'Invalid time';
  
  const [hour = '00', minute = '00'] = time.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};