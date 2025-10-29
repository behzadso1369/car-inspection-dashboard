import React from 'react';
import {  Doughnut, Line } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import instance from 'src/helper/interceptor';
import { ApiHelper } from 'src/helper/api-request';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
  piceName: string;
  allData: any;
}

const UserChart: React.FunctionComponent<PieceName> = ({piceName,allData}) => {
  

    
    
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
    <div className="card mt-3 ml-7">
      <div
        className="h-full bg-white p-4 rounded-xl"
        style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)' }}
      >
        <div className="flex">
          <h1
            onClick={() => navigate('/order/sell')}
            className="text-primary text-lg font-bold cursor-pointer"
          >
             <span>{piceName}</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-around !w-full">
          <div className="h-80 flex justify-center items-center !w-full   2xl:w-64 lg:w-64 xl:w-64">
            {allData && <Line data={data} options={options}  />}
            
          </div>

   
        </div>
      </div>
    </div>
  );
};

export default UserChart;

