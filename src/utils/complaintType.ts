const complaintType = (complaintType: string) => {
    let colorClass = '!bg-blue-500';
    switch (complaintType) {
      case 'سفارش ناقص':
        colorClass = '!bg-[#b2e7fd80] !text-[#1B263B]';
        break;
        case "خرابی دستگاه":
            colorClass = '!bg-[#06bca640] !text-[#006054]';
        break;
      default:
        break;
    }
  
    return colorClass;
  };
  
  export default complaintType;
  