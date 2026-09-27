import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Switch } from '@mui/material';

const switchLabel = { inputProps: { 'aria-label': 'Switch' } };

interface WalletSwitchFieldProps {
  name: string;
  label: string;
  hint?: string;
  control: Control<any>;
}

const WalletSwitchField: React.FunctionComponent<WalletSwitchFieldProps> = ({
  name,
  label,
  hint,
  control,
}) => {
  return (
    <div className="flex flex-col col-span-4 lg:col-span-1">
      <span className="text-[#464F60] text-xs font-normal mb-2">{label}</span>
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch
              {...switchLabel}
              checked={!!field.value}
              onChange={(_, checked) => field.onChange(checked)}
            />
          )}
        />
        {hint ? <span className="text-xs text-black-opacity-50">{hint}</span> : null}
      </div>
    </div>
  );
};

export default WalletSwitchField;
