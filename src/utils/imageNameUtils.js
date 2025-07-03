const imageNameUtils = (empid) => {
  const now = new Date(); 
  const formattedDate = 
    now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + '_' + // underscore instead of space
    String(now.getHours()).padStart(2, '0') + '-' +
    String(now.getMinutes()).padStart(2, '0') + '-' +
    String(now.getSeconds()).padStart(2, '0');

  return `${empid}_${formattedDate}.jpg`;
};

export default imageNameUtils;