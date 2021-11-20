import React from 'react';
import { Control, Controller } from 'react-hook-form';
import CurrencyInput from 'react-currency-input-field';
import { FormState } from '.';

type Props = {
  control: Control<FormState>
}

const PriceField = ({ control }: Props) => {

  return  (
    <Controller 
      name="price"    
      control={control}
      rules={{ required: 'Campo obrigatório' }}
      render={({ field }) => (
        <CurrencyInput 
          {...field}
          placeholder="Preço"
          defaultValue=""
          className="form-control input-base"
          value={field.value}
          intlConfig= {{ locale: 'pt-BR', currency: 'BRL'}}
        />
      )}
    />
  );
}


export default PriceField;