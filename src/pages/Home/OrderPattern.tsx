import React from 'react';
import { Line } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
  piceName: string;
  allData: any;
}

const OrderPattern: React.FunctionComponent<PieceName> = ({piceName,allData}) => {
  

    
    
  const navigate = useNavigate();

  const options = {
    cutout: '70%',
  
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false,
      },
    },
  };


const data = {
  labels: allData?.map((item: any) => item.PersianDate),
  datasets: [
    {
      label: 'تعداد',
      data: allData?.map((item: any) => item.Data || 0), // 👈 this fixes the error
      backgroundColor: '#2C3C51',
      borderColor: '#2C3C51',
      borderWidth: 2,
      fill: false,
      tension: 0.3, // smooth curve (optional)
    },
  ],
};



  return (
    <DashboardCard title={piceName} onTitleClick={() => navigate('/order/sell')}>
        <div className="flex flex-wrap items-center justify-around !w-full">
          <div className="h-64 sm:h-80 flex justify-center items-center !w-full">
            {allData && <Line data={data} options={options}  />}
          </div>
        </div>
    </DashboardCard>
  );
};

export default OrderPattern;

