import React from 'react';
import { FormatUtils } from '../../src/index';

export default function FormatUtilsExamples() {
  return (
    <div className="oc-content">
      <h3>Formatting functions examples</h3>
      <ul>
        <li>
          getCurrencyDecimals(&apos;EUR&apos;) = {FormatUtils.getCurrencyDecimals('EUR')}
        </li>
        <li>
          getFXRateDecimals(1.11) = {FormatUtils.getFXRateDecimals(1.11)}
        </li>
        <li>
          getLocalDateTime(&apos;2017-01-01T00:00:00&apos;) = {String(FormatUtils.getLocalDateTime('2017-01-01T00:00:00'))}
        </li>
        <li>
          formatCurrencyAmount(1, &apos;EUR&apos;) = {FormatUtils.formatCurrencyAmount(1, 'EUR')}
        </li>
        <li>
          formatFXRate(1.11) = {FormatUtils.formatFXRate(1.11)}
        </li>
        <li>
          formatFloatToFixedDecimals(1.11, 3) = {FormatUtils.formatFloatToFixedDecimals(1.11, 3)}
        </li>
        <li>
          formatDate(&apos;2017-01-01T00:00:00.000Z&apos;, &apos;DD.MM.YYYY&apos;) = {FormatUtils.formatDate('2017-01-01T00:00:00.000Z', 'DD.MM.YYYY')}
        </li>
        <li>
          formatDateToISO(&apos;01.01&apos;, &apos;DD.MM.YYYY&apos;) = {FormatUtils.formatDateToISO('01.01', 'DD.MM.YYYY')}
        </li>
        <li>
          parseDate(&apos;01.01.2017&apos;, &apos;DD.MM.YYYY&apos;, &apos;YYYY-MM-DD&apos;) = {FormatUtils.parseDate('01.01.2017', 'DD.MM.YYYY', 'YYYY-MM-DD')}
        </li>
        <li>
          parseFloat(&apos;1,1&apos;, &apos;,&apos;) = {FormatUtils.parseFloat('1,1', ',')}
        </li>
        <li>
          parseNumber(&apos;1ab&apos;) = {FormatUtils.parseNumber('1ab')}
        </li>
      </ul>
    </div>
  );
}
