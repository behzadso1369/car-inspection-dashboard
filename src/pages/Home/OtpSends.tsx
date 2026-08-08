import React from 'react';
import {  Doughnut } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
  piceName: string;
  allData: any;
}

const OtpSends: React.FunctionComponent<PieceName> = ({piceName,allData}) => {
    
    
  const navigate = useNavigate();

  const options = {
    cutout: '70%',
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        maxRotation: 0,
      },
    },
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
    labels: [
      'پیام های ارسال شده'
    ],
    datasets: [
      {
        label: 'تعداد',
        data: [allData?.
    OtpSends?.[0].Count
            
            ],
        backgroundColor: [
          '#2C3C51',
          '#EBEDEF',
          '#FFB23E',
          '#FF3E3E',
          '#B2E7FD'
        ],
        borderColor: [
          '#2C3C51',
          '#EBEDEF',
          '#FFB23E',
          '#FF3E3E',
          '#B2E7FD'
        ],
        borderWidth: 2,
      },
    ],
  };

  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      console.log(args,pluginOptions)
      const { ctx, data } = chart;
      console.log(data)
      ctx.save();
      ctx.font = '.75rem IRANSans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
        ctx.fillText(
            'کل پیام های ارسال شده:' + '\n' + allData?.AllOrders?.[0]?.Count,
            chart.getDatasetMeta(0).data[0].x,
            chart.getDatasetMeta(0).data[0].y
          );
      
    
    
    },
  };

  return (
    <DashboardCard title={piceName} onTitleClick={() => navigate('/order/sell')}>
        <div className="flex flex-wrap items-center justify-around gap-4">
          <div className="h-64 sm:h-80 flex justify-center items-center w-full max-w-xs mx-auto">
            {allData?.AllOrders?.length > 0 && <Doughnut data={data} options={options} plugins={[textCenter]} />}
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            {data.labels.map((item,index) => {
                return (
                    <div key={item} className="flex items-center text-xs gap-3">
                    <div style={{ backgroundColor: data.datasets[0].backgroundColor[index] as string }} className="rounded-full w-4 h-4 shrink-0"></div>
                    <span>  {item}  : {data.datasets[0].data[index]}</span>
                  </div>
                )
            })}
          </div>
        </div>
    </DashboardCard>
  );
};

export default OtpSends;

