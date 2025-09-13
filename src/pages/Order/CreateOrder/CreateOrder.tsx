import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '../../../libs/input/input';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../../libs/dropdown/dropdown';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

import imageUrl from '../../../assets/images/pdf-logo.png';

import { Button, PrimaryButton, SecondaryButton } from '../../../libs/button/button';

// import { dataOptions } from './data/data';
import Datepicker from '../../../libs/datepicker/datepicker';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_FN } from '../../../utils/ag-grid-localize/localize';

import instance from '../../../helper/interceptor';
import { ApiHelper } from '../../../helper/api-request';
import moment from 'jalali-moment';
import { useNavigate } from 'react-router-dom';

import TextArea from '../../../libs/text-area/text-area';

const CreateOrder: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const inputPdfRef = useRef<any>(null);
  const inputImageRef = useRef<any>(null);
  // const [addPiece,setAddPiece] = useState<boolean>(false);
  const [rowData,setRowData] = useState<any>([]);
  const [orderType,setOrderType] = useState<any>([]);
  const [customer,setCustomer] = useState<any>([]);
  const [priceUnits,setPriceUnits] = useState<any>([]);
  const [user,setUser] = useState<any>([]);
  const [equip,setEquips] = useState<any>([]);
  const [equipPart,setEquipsPart] = useState<any>([]);

  const [fileId,setFileId] = useState<any>(null);
  const [files,setFiles] = useState<any>([]);
  const [image,setImage] = useState<any>(null);
  const [pdf,setPDF] = useState<any>(null);
  const [progressImageBar,setProgressImageBar] = useState<boolean>(false);
  const [progressPdfBar,setProgressPdfBar] = useState<boolean>(false);
  // const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  

  const allgridRef = useRef<any>();
  
  const { register, control,getValues,setValue,watch} = useForm({
    defaultValues: {
      "refCode": "",
      "orderTypeId": 1,
      "userId": 3,
      "inquestNumber": "",
      "inquestDate": new Date(),
      "inquestDeliveryDate": new Date(),
      "customerProductNo": 1,
      equipPartId: 1,
      eqPartCode:"",
      equipId: equipPart.data ? equipPart.data[0].id: 1,
      qty: 0,
      // price:0,
      // priceUnitId: 1,
    
      equipmentPlaque: "",
      serialNumber: "",
      description: "",
      equipDescription: ""

    }
  });
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      menuTabs: ['filterMenuTab'],
    };
  }, []);
  // const openModal = (params:any) => {
  //   setOneRow(params.data);
  //   setTimeout(() => {
  //     setShowModal(true);
  //   },4)


  // }
 
  const columnDefs:ColDef[] = [
    {
      field: 'rowIndex',
      headerName: '#',
      minWidth: 90,
      maxWidth: 100,
      sortable: true,
      unSortIcon: true,
      cellRenderer:(params:any) => {
        return (
          <div>
          {params.rowIndex + 1}
          </div>
        )
      }
    },
    {
      field: 'equipPartId',
      headerName: 'نام قطعه',
      maxWidth:150,
      cellRenderer:(params:any) => {

        return (
          <>
          {params.data.equipPartTitle}
          </>
        )
      },

      filter: 'agSetColumnFilter'
    },
   
    {
      field: 'equipId',
      maxWidth:120,
      headerName: 'نام تجهیز',
      cellRenderer:(params:any) => {
        console.log(getValues().equipId);
        return (
          <>
          {params.data.equipTitle}
          </>
        )
      }

    },
    {
      field: 'eqPartCode',
      maxWidth:120,
      headerName: 'کد قطعه ',
  
    },
    {
      field: 'qty',
      maxWidth:120,
      headerName: ' تعداد',
   
    },
    // {
    //   field: 'totalPrice',
    //   maxWidth:120,
    //   headerName: 'قیمت کل',
   
    // },
 
    {
      field: 'equipmentPlaque',
      maxWidth:120,
      headerName: ' پلاک تجهیز',

    },
  
    {
      field: 'action',
      headerName: 'عملیات',
      cellRenderer: (params: any) => {
        return (
          <div className="flex justify-start items-start gap-3 w-16">
            
            <button className='bg-red-500 text-white h-8 px-3 rounded-lg flex items-center' onClick={() => removeData(params.rowIndex)}>حذف   قطعه</button>
        
          </div>
        );
      },
  
      filter: false
    },
  ];
  const watchEquip = watch("equipId");
  const watchCustomer = watch("customerProductNo");
  useEffect(() => {
    instance.get(ApiHelper.get("getPriceUnits")).then((res:any) => {
      if(res.data.success) {
        setPriceUnits(res.data.data);
        console.log(priceUnits)
      }
    })
    instance.get(ApiHelper.get('orderTypes')).then((res:any) => {
      setOrderType(res.data);
    })
    // instance.get(ApiHelper.get('getCustomers')).then((res:any) => {
    //   setCustomer(res.data);
    //   const user = res.data?.data[0].users;
    
     
    //   setUser(user);
    // })
    instance.get(ApiHelper.get('orderTypes')).then((res:any) => {
      setOrderType(res.data);
    })
   
    instance.get(ApiHelper.get('getEquips')).then((res:any) => {
      setEquips(res.data);
    })
    // instance.get(ApiHelper.get('getEquipParts'),{params: {
    //   equipId:1
    // }}).then((res:any) => {
    //   setEquipsPart(res.data);
     
  
    // })
    
   
   
     
        instance.get(ApiHelper.get('getCustomers')).then((res:any) => {
          setCustomer(res.data);
          const user = res.data?.data.filter((item:any) => item.id === getValues().customerProductNo)[0].users;
      
    
          setValue("userId",user[0].id);
         
          setUser(user);
        })
        instance.get(ApiHelper.get('getEquipParts'),{params: {
          equipId:getValues().equipId
        }}).then((res:any) => {
          setEquipsPart(res.data);
          setValue("equipPartId",res.data.data[0].id);
       
            // watch("equipPartId",equipPart.data[0].id);
            console.log(getValues())
  
      
      
        
          // setValue("equipPartId",res?.data?.data[0].id);
          // reset({
          //   equipPartId: res?.data?.data[0].id
          // })
        })
  
      // const show = getValues().tollingName === "سایر تجهزات" ? true : false;
      // console.log(customer)
     
      
      
    
     
    
      // setShowPieceText(show);

   
  }, [watchEquip,watchCustomer]);
 
  const removeData = (rowIndex:number) => {
    console.log(rowIndex)
    const selectedRow = allgridRef.current.api.getFocusedCell()
    console.log(selectedRow.rowIndex)

 
    
   rowData.splice(selectedRow.rowIndex, 1);
 

  setRowData([...rowData])
  }

  // const onRowClicked = (params:any) => {
  //   console.log(params);
  //   setOneRow(params.data);

  // }
  const addData = () => {
   
   
    
    
    const newData = {
      equipPartId: getValues().equipPartId,
      equipId: getValues().equipId,
      eqPartCode: getValues().eqPartCode,
      equipPartTitle:  equipPart?.data?.filter((item:any) => item.id === getValues().equipPartId)[0].title,
      equipTitle:  equip?.data?.filter((item:any) => item.id === getValues().equipId)[0].title,
      qty: Number(getValues().qty),
      equipmentPlaque: getValues().equipmentPlaque,
      "customEqPartTitle": "string",
      // totalPrice: Number(getValues().qty) * Number(getValues().price) + " " +  priceUnits.filter((item:any) => item.id === getValues().priceUnitId)[0].title,
      serialNumber:getValues().serialNumber,
      // price: Number(getValues().price),
      // priceUnitId:getValues().priceUnitId,
      description: getValues().equipDescription,
      orderEquipPartFiles: files
 
  


     

    };
    console.log(newData);
    setRowData([...rowData,newData])
    setValue("equipPartId",1);
    setValue("eqPartCode","");
    setValue("equipId",1);
    setValue("qty",0);
    // setValue("price",0);
    // setValue("priceUnitId",1);
    setValue("equipmentPlaque","");
    setValue("serialNumber","");

    setValue("equipDescription","");
    setFiles([]);
    setImage(null);
    setPDF(null);
// reset({
//   equipPartId: 1,
//   eqPartCode:"",
//   equipId: equipPart.data ? equipPart.data[0].id: 1,
//   qty: 0,
//   price:0,
//   priceUnitId: 1,

//   equipmentPlaque: "",
//   serialNumber: "",
//   equipDescription: ""
// });
  }

  const uploadPdfFile = async () => {

    const file = inputPdfRef.current?.files[0];

    const formData = new FormData();
    formData.append('files', file);

    console.log(formData);
    setProgressPdfBar(true);
    instance.post(ApiHelper.get("uploadFiles"),formData).then((res:any) => {
      setPDF(false)
      if(res?.data.success) {
        setPDF(true);
        setProgressPdfBar(false);
      }
      
    
        setFileId(res.data.data[0]);
        files.push({
          "fileId": res.data.data[0],
          "fileTypeId": 2

        })
        setFiles(files);
    })
    // formData.append('SupplierId', id);
    // formData.append('EnactmentId', params.id);

    // axios
    //   .post(`${environment.api.base}Enactment/SignEnactment`, formData, {
    //     headers: {
    //       Authorization: ` Bearer ${localStorage.getItem('token')}`,
    //     },
    //   })
    //   .then((res) => {
    //     navigate('/contract');
    //   });
  };
  const uploadImageFile = async () => {
    const file = inputImageRef.current?.files[0];

    const formData = new FormData();
    formData.append('files', file);

    console.log(formData);
    setProgressImageBar(true);
    instance.post(ApiHelper.get("uploadFiles"),formData).then((res:any) => {
  

      instance.get(ApiHelper.get("getFileBase64") + "/" + res.data.data[0]).then((res:any) => {
        const byteCharacters = atob(res.data.base64Data);
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);

let image = new Blob([byteArray], { type: 'image/jpeg' });
let imageUrl = URL.createObjectURL(image);
setProgressImageBar(false);
setImage({image: imageUrl});
    

      })
    
        setFileId(res.data.data[0]);
        files.push({
          "fileId": res.data.data[0],
          "fileTypeId": 1

        })
        setFiles(files);
    })
    // formData.append('SupplierId', id);
    // formData.append('EnactmentId', params.id);

    // axios
    //   .post(`${environment.api.base}Enactment/SignEnactment`, formData, {
    //     headers: {
    //       Authorization: ` Bearer ${localStorage.getItem('token')}`,
    //     },
    //   })
    //   .then((res) => {
    //     navigate('/contract');
    //   });
  };
  const downloadPdfFile = async () => {
    await instance.get(ApiHelper.get("getFiles") + "/" +  fileId).then((response:any) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;


    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();

    });
 
   
  };
  // const downloadimageFile = async () => {
  //   await instance.get(ApiHelper.get("getFiles") + "/" +  fileId).then((response:any) => {
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
    

  //   link.setAttribute('download', 'file.png');
  //   document.body.appendChild(link);
  //   link.click();

  //   link.remove();
  //   // files.push(fileId)
  //   // setFiles(files);
  //   });
 
   
  // };
  // const updateData = (index:number) => {
  //   // rowData[index] = 
 


  // }

  const onSubmit = () => {
    console.log(getValues());
    const finalRowData = rowData;
    delete finalRowData["equipTitle"]
    delete finalRowData["equipPartTitle"]
    const finalData = {
      "refCode": getValues().refCode,
      "orderTypeId": getValues().orderTypeId,
      "userId": getValues().userId,
      "inquestNumber": getValues().inquestNumber,
      "inquestDate": moment(getValues().inquestDate).format("YYYY-MM-DD"),
      "inquestDeliveryDate": moment(getValues().inquestDeliveryDate).format("YYYY-MM-DD"),
      "customerProductNo": "string",
      "description": getValues().description,
      "orderEquipParts": finalRowData,
      
    }
    instance.post(ApiHelper.get("AddRequest"),finalData).then((res:any) => {
      if(res?.data?.success) {
        navigate('/order/receive-order');

      }
    })

    
    
   
  };

  return (
    <div className="pb-20">
      <div className="bg-white border border-[#2c3c511a] rounded-xl flex justify-between p-4 mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-primary">ایجاد درخواست </h3>
        </div>
      </div>

      {/* <form > */}
      
    <div className="grid grid-cols-3 gap-3 pb-8">
          <Dropdown
                  register={register}
                  control={control}
                  title="orderTypeId"
                  label='نوع سفارش'
                  option={orderType?.data}
                  fullWidth={true}
                />
                  <Dropdown
                  register={register}
                  control={control}
                  title="customerProductNo"
                  label='مشتری'
                  option={customer?.data}
                
                  fullWidth={true}
                />
                 <Dropdown
                  register={register}
                  control={control}
                  title="userId"
                  label='کارشناس مشتری'
                  option={user}
                  fullWidth={true}
                />
                  <Input
              placeholder='شماره استعلام'
              type="text"
              register={register}
              control={control}
              title="inquestNumber"
              label='شماره استعلام'
              width="w-full"
            />
         
              <Datepicker
                  label='تاریخ استعلام'
                  register={register}
                  control={control}
                  title="inquestDate"
                  
                  
                />
             <Datepicker
                  label='تاریخ تحویل مندرج در  استعلام'
                  register={register}
                  control={control}
                  title="inquestDeliveryDate"
                />
           
         
          
               <Input
              placeholder='کد  ارجاع'
              type="text"
              register={register}
              control={control}
              title="refCode"
              label='کد  ارجاع'
              width="w-full"
            />
         
            <div className="col-span-3 p-0">
                <TextArea
        control={control}
        title='description'
        register={register}
        label='توضیحات سفارش'
        
        />
                </div>
                <div className="grid grid-cols-3 gap-3 pb-8 col-span-3 border-2 border-gray-200 rounded-md px-2" >
                <div className='mt-6 col-span-3 border-b-2 border-gray-300 pb-3'>ردیف سفارش جدید</div>

<Dropdown
              register={register}
              control={control}
              title="equipId"
              label='نام تجهیز'
              option={equip?.data}
              fullWidth={true}
            />
              <Dropdown
            register={register}
            control={control}
            title="equipPartId"
            
            label='نام قطعه'
            option={equipPart?.data}
         
            fullWidth={true}
           
          /> 
           <Input
   
   placeholder='کد قطعه'
   type="text"
   register={register}
   control={control}
   title="eqPartCode"
   label='کد قطعه'
   width="w-full"
 />
  <Input
   type="number"
   register={register}
   control={control}
   title="qty"
   label='تعداد (برای وارد کردن تعداد کیبورد باید انگلیسی باشد) '
   width="w-full"
 />
   <Input
   placeholder='پلاک تجهیز'
   type="text"
   register={register}
   control={control}
   title="equipmentPlaque"
   label='پلاک تجهیز'
   width="w-full"
 />
   <Input
          placeholder='شماره سریال'
          type="text"
          register={register}
          control={control}
          title="serialNumber"
          label='شماره سریال'
          width="w-full"
        />
         {/* <Input
         
         type="number"
         register={register}
         control={control}
         title="price"
         label='قیمت (برای وارد کردن قیمت کیبورد باید انگلیسی باشد) '
         width="w-full"
       />
         <Dropdown
             register={register}
             control={control}
             title="priceUnitId"
             label='واحد قیمت'
             option={priceUnits}
             fullWidth={true}
           /> */}
              <div className='mt-8 col-span-2 flex'>
        <div className="flex ">
    
    <div className='w-1/2'>
      <label
        htmlFor="imageFile"
        className=" rounded-md px-3 py-1 text-sm bg-gray-700 text-white hover:bg-blue-700 focus:bg-blue-opacity-90 focus:shadow-primary-focus whitespace-nowrap cursor-pointer"
      >
        آپلود عکس   
      </label>
      <input
        name="imageFile"
        id="imageFile"
        type="file"
        ref={inputImageRef}
        onInput={uploadImageFile}
        style={{ visibility: 'hidden' }}
      />

    </div>
    {progressImageBar ? <span>فایل عکس در حال آپلود است</span> : <div>
    {image &&  <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-col items-center'><img width="50px" height="50px" src={image.image}/></div>}
    </div>}

  
  

    {/* <Button
      title={'ذخیره   '}
      active={true}
      style={PrimaryButton}
      onClick={uploadFile}
    >
      {' '}
      ذخیره
    </Button> */}
    <div className="flex "></div>
        </div>
        <div className="flex ">
          <div className="w-1/3">
          <label
        htmlFor="pdfFile"
        className=" rounded-md px-3 py-1 text-sm bg-red-600 text-white hover:bg-[#161F31] focus:bg-primary-opacity-90 focus:shadow-primary-focus whitespace-nowrap"
      >
        آپلود pdf   
      </label>
      <input
        name="pdfFile"
        id="pdfFile"
        type="file"
        ref={inputPdfRef}
        onInput={uploadPdfFile}
        style={{ visibility: 'hidden' }}
      />
          </div>
        <div>
     
    </div>
    {progressPdfBar ? <span>فایل  pdf در حال آپلود است</span> : <div>
    {pdf && 
        <div className='w-auto relative p-2 border-2 border-slate-400 flex flex-wrap justify-center'><div className='w-full flex justify-center'><img width="50px" height="50px" src={imageUrl}/></div>
        <div className="w-full flex justify-between">
   
        {/* <button className='mt-2 bg-black text-white px-2 rounded-md text-sm'  >پاک کردن pdf</button> */}
      
        <button className='mt-2 bg-black text-white px-2 rounded-md text-sm' onClick={() => downloadPdfFile()}>دانلود pdf</button>
        </div>
        </div>


        
      }</div>}
        
  

    {/* <Button
      title={'ذخیره   '}
      active={true}
      style={PrimaryButton}
      onClick={uploadFile}
    >
      {' '}
      ذخیره
    </Button> */}
    <div className="flex self-end text-center"></div>
        </div>
        </div>
           <div className="col-span-3 p-0">
            <TextArea
    control={control}
    title='equipDescription'
    register={register}
    label='مشخصات قطعه'
    
    />
            </div>
        
  
     
           {/* <div className='col-span-3 mt-6'>
           <Uploader  />
           </div> */}
         
      
        
  <div className="col-start-3 col-end-4 mt-7 flex justify-end">
            <Button
          title='    ردیف سفارش جدید '
          active={true}
        
          style={SecondaryButton}
          
          onClick={addData}
        />
  </div>
  <div style={gridStyle} className="border-b-2  border-[#2c3c511a] ag-theme-alpine col-span-3 default-table pb-32 pt-6">
    <AgGridReact
      ref={allgridRef}
    
      
      animateRows={true}
      rowHeight={60}
      headerHeight={50}
      domLayout="autoHeight"
      rowData={rowData}
      enableRtl={true}
      suppressAggFuncInHeader={true}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      pagination={false}
  
     
      localeText={AG_GRID_LOCALE_FN}
      suppressColumnVirtualisation={true}
      rowDragManaged={true}
      suppressRowVirtualisation={true}
      suppressMoveWhenRowDragging={true}
      paginationPageSize={5}
      icons={{
        checkboxChecked:
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>',
        sortAscending: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
        sortDescending: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
        sortUnSort: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"></path></svg>`,
      }}
    />
  </div>
                </div>
             

              <div className="col-start-3 mt-6 col-end-4 flex justify-end">
                {rowData.length > 0 &&   <Button
              title='ثبت درخواست '
              active={true}
              style={PrimaryButton}
              onClick={onSubmit}
            />}
            
              </div>
            
           
         


             
          
    </div>
    
  
       
      {/* </form> */}
      {/* {showModal && (
        <EditPiece
          showDeleteModal={showModal}
          // row={oneRow}
          setShowDeleteModal={setShowModal}
        />
      )} */}
    </div>
  );
};

export default CreateOrder;
