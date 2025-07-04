export const formatDate = (dateString) => {
  if (!dateString || dateString.startsWith('01-01-1900')) return null;

  const [dd, mm, yyyy] = dateString.split(' ')[0].split('-'); // Splits "DD-MM-YYYY"
  return `${yyyy}-${mm}-${dd}`; // Returns "YYYY-MM-DD"
};
