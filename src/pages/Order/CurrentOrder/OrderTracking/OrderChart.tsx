import React from 'react';
import {  Doughnut } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
  piceName: string;
}

const OrderCard: React.FunctionComponent<PieceName> = ({piceName}) => {
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
      'ارسال پیش فاکتور',
      'دریافت پیش پرداخت',
      'خرید مواد اولیه',
      'ساخت',
      'کنترل کیفیت',
      'ارسال سفارش ',
      'ارسال فاکتور ',
      'پایان سفارش ',
    ],
    datasets: [
      {
        label: 'تعداد',
        data: [200, 165, 25, 78, 120, 80, 120,20],
        backgroundColor: [
          '#2C3C51',
          '#EBEDEF',
          '#FFB23E',
          '#FF3E3E',
          '#B2E7FD',
          '#07A433',
          '#EBEDEF',
          "#5eead4",
          "#ec4899"
        ],
        borderColor: [
          '#2C3C51',
          '#EBEDEF',
          '#FFB23E',
          '#FF3E3E',
          '#B2E7FD',
          '#07A433',
          '#FF3E3E',
          "#5eead4",
          "#ec4899"
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
        'کل قطعات:' + '\n' + '808',
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
        <div className="flex items-center justify-around">
          <div className="h-80 flex justify-center items-center 2xl:w-64 w-64">
            <Doughnut data={data} options={options} plugins={[textCenter]} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#B2E7FD] rounded-full w-5 h-5"></div>
              <span>   ارسال پیش فاکتور: 200</span>
            </div>
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#FFB23E] rounded-full w-5 h-5"></div>
              <span>دریافت پیش پرداخت  : 165</span>
            </div>
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#2C3C51] rounded-full w-5 h-5"></div>
              <span> خرید مواد اولیه : 25</span>
            </div>{' '}
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#FF3E3E] rounded-full w-5 h-5"></div>
              <span>ساخت : 78</span>
            </div>{' '}
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#07A433] rounded-full w-5 h-5"></div>
              <span> کنترل کیفیت  : 120</span>
            </div>
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#EBEDEF] border-4 border-[#FF3E3E] rounded-full w-5 h-5"></div>
              <span> ارسال سفارش : 80</span>
            </div>
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#5eead4] border-4 border-[#FF3E3E] rounded-full w-5 h-5"></div>
              <span> ارسال فاکتور : 120</span>
            </div>
            <div className="flex items-center text-xs gap-4">
              <div className="bg-[#ec4899] border-4 border-[#FF3E3E] rounded-full w-5 h-5"></div>
              <span>  پایان سفارش : 20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

