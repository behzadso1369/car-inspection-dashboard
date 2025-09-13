import { Fragment } from 'react';
import {  useSearchParams } from 'react-router-dom';












const OrderLayout = ({ children }: any) => {





  // const [badge, setBadges] = useState<any>({
  //   allData: 8,
  //   awaitingConfirmationData: 1,
  //   canceledData: 1,
  //   collectingData: 1,
  //   negotiatedData: 1,
  //   underNegotiationData: 1,
  // });
  // const [filter, setFilter] = useState<boolean>(false);
  // const { getValues, setValue,  reset } =
  //   useForm();
  const [searchParams] = useSearchParams();

  const params: any[] = [];
  searchParams.forEach((value, key) => {
    params.push([key, value]);
  });
  // const navigate = useNavigate();

  // const setUrlParams = () => {
  //   navigate({
  //     pathname: '.',
  //     search: `?fromDate=${getValues()?.fromDate}&upToDate=${
  //       getValues()?.upToDate
  //     }&orderType=${getValues()?.orderType}&status=${
  //       getValues()?.status
  //     }&orderReference=${getValues()?.orderReference}`,
  //   });
  // };

  // const onSubmit = () => {
  //   const data = getValues();
  //   reset(data);
  //   setUrlParams();
  // };


  

  // const clickHandler = (key: string, value: string) => {
  //   setValue(key, '0');
  //   setUrlParams();
  // };

  // const submitHandler = () => {
  //   console.log('test');
  // };

  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default OrderLayout;
