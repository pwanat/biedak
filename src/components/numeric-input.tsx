import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from './ui/input';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn';

interface NumericInputProps extends Omit<NumericFormatProps, 'customInput'> {
  className?: string;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <NumericFormat
        customInput={Input}
        thousandSeparator=" "
        decimalSeparator="."
        decimalScale={2}
        fixedDecimalScale
        suffix=" zł"
        allowNegative={false}
        className={cn(className)}
        {...props}
        getInputRef={ref}
      />
    );
  }
);

NumericInput.displayName = 'NumericInput';