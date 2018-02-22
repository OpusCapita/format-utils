/* eslint-disable no-unused-expressions, prefer-arrow-callback */
import { expect } from 'chai';

import FormatUtils from '../../src/format-utils/format-utils';

describe('Format utils', function describe() {
  it('should function correctly', function it() {
    expect(FormatUtils.getCurrencyDecimals('EUR')).to.eql(2);
    expect(FormatUtils.getFXRateDecimals(1.11)).to.eql(6);
    expect(FormatUtils.formatCurrencyAmount(1, 'EUR')).to.eql('1.00');
    expect(FormatUtils.formatFXRate(1)).to.eql('1.000000');
    expect(FormatUtils.formatFloatToFixedDecimals(1.11, 3)).to.eql('1.110');
    expect(FormatUtils.formatDate('2017-01-01T00:00:00.000Z', 'DD.MM.YYYY')).to.eql('01.01.2017');
    expect(FormatUtils.formatDateToISO('01.01', 'DD.MM.YYYY')).to.eql('2018-01-01T00:00:00.000Z');
  });
});
