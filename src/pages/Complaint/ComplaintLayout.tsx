import { Fragment } from 'react';
import {  useSearchParams } from 'react-router-dom';

const ComplaintLayout = ({ children }: any) => {

  const [searchParams] = useSearchParams();

  const params: any[] = [];
  searchParams.forEach((value, key) => {
    params.push([key, value]);
  });


  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default ComplaintLayout;
