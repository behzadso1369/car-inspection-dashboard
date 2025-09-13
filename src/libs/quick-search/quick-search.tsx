
import { Input } from '../input/input';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  DisabledSecondaryButton,
  SecondaryButton,
} from '../button/button';

import { useForm } from 'react-hook-form';


export interface QuickSearchProps {
  onSubmit: () => void;
  register:any;
  control:any;
  activeSearch:boolean;
}

export function QuickSearch({ onSubmit,register,control }: QuickSearchProps) {
 
 
  

  const { handleSubmit } = useForm();

 

  return (
    <form className="flex items-center gap-3 " onChange={handleSubmit(onSubmit)} >
      <Input
        icon={faMagnifyingGlass}
        placeholder={'عبارت مورد نظر را جست و جو کنید'}
        type="text"
        register={register}
        control={control}
        title="search"
        width="w-60 lg:w-80 xl:w-80 "
      />
      <Button
        title={'جستجو'}
        active={true}
        style={SecondaryButton}
        disableStyle={DisabledSecondaryButton}
        onClick={onSubmit}
      />
    </form>
  );
}

export default QuickSearch;
