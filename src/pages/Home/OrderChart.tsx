import React from 'react';
import {  Doughnut } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
  piceName: string;
  allData: any;
}

const OrderChart: React.FunctionComponent<PieceName> = ({piceName,allData}) => {
    
    
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
      'کل سفارشات',

      'شفارشات تکمیل شده',
      'سفارشات تکمیل نشده',
    ],
    datasets: [
      {
        label: 'تعداد',
        data: [allData?.
    AllOrders?.[0].Count
            , allData?.
    AllOrders?.[0].Count, allData?.
    AllOrders?.[0].Count
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
            'کل سفارشات:' + '\n' + allData?.AllOrders?.[0]?.Count,
            chart.getDatasetMeta(0).data[0].x,
            chart.getDatasetMeta(0).data[0].y
          );
      
    
    
    },
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
        <div className="flex flex-wrap items-center justify-around">
          <div className="h-80 flex justify-center items-center w-full   2xl:w-64 lg:w-64 xl:w-64">
            {allData?.AllOrders?.length > 0 && <Doughnut data={data} options={options} plugins={[textCenter]} />}
            
          </div>

          <div className="flex flex-col gap-4">
      
            {data.labels.map((item,index) => {
                return (
                    <div className="flex items-center text-xs gap-4">
                    <div className={`bg-[${data.datasets[0].backgroundColor[index]}] rounded-full w-5 h-5`}></div>
                    <span>  {item}  : {data.datasets[0].data[index]}</span>
                  </div>
                )
            })}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderChart;

