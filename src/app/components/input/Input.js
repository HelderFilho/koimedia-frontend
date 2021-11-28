import "./Input.css";
import IntlCurrencyInput from "react-intl-currency-input"

export default function Input({ label, value, onchange, hidden, money, disabled }) {
  
const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};
  
  return (
    <div style={{width: '100%'}} >
      <div>
        <label className="label">{label}</label>
      </div>
      {money ? (
           <IntlCurrencyInput currency="BRL" config={currencyConfig} disabled = {disabled}
           onChange={onchange} value={value}  hidden = {hidden} className="input"/>

      ):(
        <input disabled = {disabled} hidden = {hidden} className="input" value={value} onChange={onchange} />

      )}
      </div>
  );
}
