import "./Input.css";
import IntlCurrencyInput from "react-intl-currency-input"
import NumberFormat from 'react-number-format';

export default function Input({ label, value, onchange, hidden, money, disabled }) {

  const currencyConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  /*
   
  
           <IntlCurrencyInput currency="BRL" config={currencyConfig} disabled={disabled}
            onChange={onchange} value={value} hidden={hidden} className="input" />
  
  */

  return (
    <div style={{ width: '100%' }} >
      <div>
        <label className="label">{label}</label>
      </div>
      {money ? (

        <NumberFormat
          onChange={onchange}
          value={value}
          hidden={hidden}
          className="input"
          disabled={disabled}
          decimalScale={2}
          thousandSeparator={'.'}
          decimalSeparator={','}
          prefix="R$ "
          fixedDecimalScale={false}
        />


      ) : (
        <input disabled={disabled} hidden={hidden} className="input" value={value} onChange={onchange} />

      )}
    </div>
  );
}
