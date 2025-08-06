export const formatPhone = (phone: string | number): string => {
  const phoneStr = phone.toString().replace(/\D/g, '');
  
  if (phoneStr.length === 11) {
    return `(${ phoneStr.slice(0, 2)}) ${phoneStr.slice(2, 7)}-${phoneStr.slice(7)}`;
  } else if (phoneStr.length === 10) {
    return `(${ phoneStr.slice(0, 2) }) ${phoneStr.slice(2, 6)}-${phoneStr.slice(6)}`;
  } else {
    return phoneStr;
  }
};

