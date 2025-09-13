const statusDetector = (orderTypeId: number) => {
  let colorClass = '!bg-blue-500';
  switch (orderTypeId) {
    case 1:
      colorClass = '!bg-[#FFCFCF] !text-[#000000]';
      break;
    case 2:
      colorClass = '!bg-[#EBEDEF] !text-[#1B263B]';
      break;
    case 3:
      colorClass = '!bg-[#06bca640] !text-[#006054]';
      break;
    default:
      break;
  }

  return colorClass;
};

export default statusDetector;
