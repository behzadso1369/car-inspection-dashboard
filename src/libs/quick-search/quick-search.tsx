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
  register: any;
  control: any;
  activeSearch: boolean;
}

export function QuickSearch({ onSubmit, register, control }: QuickSearchProps) {
  const { handleSubmit } = useForm();

  return (
    <form
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full"
      onChange={handleSubmit(onSubmit)}
    >
      <div className="flex-1 min-w-0 w-full">
        <Input
          icon={faMagnifyingGlass}
          placeholder={'عبارت مورد نظر را جست و جو کنید'}
          type="text"
          register={register}
          control={control}
          title="search"
          width="w-full"
        />
      </div>
      <Button
        title={'جستجو'}
        active={true}
        style={
          SecondaryButton +
          ' min-h-[44px] w-full sm:w-auto shrink-0 justify-center rounded-xl'
        }
        disableStyle={DisabledSecondaryButton}
        onClick={onSubmit}
      />
    </form>
  );
}

export default QuickSearch;
