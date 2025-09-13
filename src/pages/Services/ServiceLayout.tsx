import { Fragment } from 'react';
import {  useSearchParams } from 'react-router-dom';

const ServiceLayout = ({ children }: any) => {

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

export default ServiceLayout;
