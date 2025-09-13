import React, { useEffect, useState } from 'react';
import {  Bar } from 'react-chartjs-2';

import { useNavigate } from 'react-router-dom';
import { Chart,defaults, registerables } from 'chart.js';
import { useForm } from 'react-hook-form';
import Dropdown from '../../libs/dropdown/dropdown';
import { dataOptions } from '../Order/data/data';
Chart.register(...registerables);
 interface PieceName extends React.PropsWithChildren {
 
}

const OrderEquipYearChart: React.FunctionComponent<PieceName> = () => {
    defaults.font.family = "IRANYekan";
  const navigate = useNavigate();
  const { register, getValues,  control ,watch } =
  useForm({
    defaultValues: {
      orderMonth: "1"
    }
  });
  const [label,setLabel] = useState<string>("")
  const [chartData,setChartData] = useState<any>([10, 15, 12, 30, 45, 70]);

//   const options = {
//     cutout: '70%',
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           display: false,
//         },
//         grid: {
//           display: false,
//         },
//         border: {
//           display: false,
//         },
//       },
//       x: {
//         ticks: {
//           display: false,
//         },
//         grid: {
//           display: false,
//         },
//         border: {
//           display: false,
//         },
//         maxRotation: 0,
//       },
//     },
//     plugins: {
//       title: {
//         display: true,
//       },
//       legend: {
//         display: false,
//       },
//     },
//   };

  const data = {
    labels: [
      'قطعه شماره یک',
      'قطعه شماره دو',
      'قطعه شماره سه',
      'قطعه شماره چهار',
      'قطعه شماره پنج',
     
    ],
    datasets: [
      {
        label: label,
        data: chartData,
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

//   const textCenter = {
//     id: 'textCenter',
//     beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
//       console.log(args,pluginOptions)
//       const { ctx, data } = chart;
//       console.log(data)
//       ctx.save();
//       ctx.font = '.75rem IRANSans';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText(
//         'سفارش های جدید' + '\n' + '14',
//         chart.getDatasetMeta(0).data[0].x,
//         chart.getDatasetMeta(0).data[0].y
//       );
//     },
//   };
  const getRandomInt =  (min:any, max:any) =>  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  useEffect(() => {
   
   
   
    const subscription = watch(() => {
        setLabel(dataOptions.yearOptions.filter((item:any) => item.id === getValues().orderMonth)[0].title);
      setChartData([getRandomInt(0,80),getRandomInt(0,80),getRandomInt(0,80),getRandomInt(0,80),getRandomInt(0,90)])
      console.log(data)
  
    });
    return () => subscription.unsubscribe();
  }, [getValues, watch]);

  return (
    <div className="card mt-3 ml-7">
      <div
        className="h-full bg-white p-4 rounded-xl"
        style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)' }}
      >
        <div className="flex items-center justify-between">
          <h1
            onClick={() => navigate('/order/sell')}
            className="text-primary text-lg font-bold cursor-pointer"
          >
             <div className='text-xs h-full flex '>تعداد سفارش هر قطعه براساس سال</div>
          
          </h1>
          <Dropdown
                register={register}
                control={control}
                title="orderMonth"
                label={''}
                option={dataOptions.yearOptions}
                fullWidth={false}
              />
        </div>
        <div className="flex items-center justify-around">
          <div className="h-80 flex justify-center items-center w-full">
            <Bar data={data}   />
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderEquipYearChart;

