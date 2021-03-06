import React from 'react';
import FormatUtils from '../../src/index';

export default function FormatUtilsExamples() {
  return (
    <div className="oc-content">
      <h3>Formatting functions examples</h3>
      <ul>
        <li>
          getCurrencyDecimals(&apos;EUR&apos;) =
          {FormatUtils.getCurrencyDecimals('EUR')}
        </li>
        <li>
          getFXRateDecimals(1.11) =
          {FormatUtils.getFXRateDecimals(1.11)}
        </li>
        <li>
          getLocalDateTime(&apos;2017-01-01T00:00:00&apos;) =
          {' '}
          {String(FormatUtils.getLocalDateTime('2017-01-01T00:00:00'))}
        </li>
        <li>
          formatCurrencyAmount(1, &#123; currency: &apos;EUR&apos; &#125;) =
          {' '}
          {FormatUtils.formatCurrencyAmount(1, { currency: 'EUR' })}
        </li>
        <li>
          formatCurrencyAmount(5000, &#123; currency: &apos;EUR&apos;, thousandSeparator:
          &apos;.&apos;, decimalSeparator: &apos;,&apos; &#125;) =
          {' '}
          {FormatUtils.formatCurrencyAmount(5000, {
            currency: 'EUR',
            thousandSeparator: '.',
            decimalSeparator: ',',
          })}
        </li>
        <li>
          formatDate(&apos;2017-01-01T00:00:00.000Z&apos;, &apos;DD.MM.YYYY&apos;) =
          {' '}
          {FormatUtils.formatDate('2017-01-01T00:00:00.000Z', 'DD.MM.YYYY')}
        </li>
        <li>
          formatDateToISO(&apos;01.01&apos;, &apos;DD.MM.YYYY&apos;) =
          {' '}
          {FormatUtils.formatDateToISO('01.01', 'DD.MM.YYYY')}
        </li>
        <li>
          formatFloatToFixedDecimals(1.11, 3) =
          {' '}
          {FormatUtils.formatFloatToFixedDecimals(1.11, 3)}
        </li>
        <li>
          formatFXRate(1.11) =
          {FormatUtils.formatFXRate(1.11)}
        </li>
      </ul>
    </div>
  );
}
