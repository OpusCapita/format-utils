# format-utils

### Description
Formatting functions in JS

### Installation
```
npm install --save @opuscapita/format-utils
```

### Demo
View the [DEMO](https://opuscapita.github.io/format-utils)

### Builds
#### UMD
The default build with compiled styles in the .js file. Also minified version available in the lib/umd directory.
#### CommonJS/ES Module
You need to configure your module loader to use `cjs` or `es` fields of the package.json to use these module types.
Also you need to configure sass loader, since all the styles are in sass format.
* With webpack use [resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolve-mainfields) to configure the module type.
* Add [SASS loader](https://github.com/webpack-contrib/sass-loader) to support importing of SASS styles.

### API
| Function name            | Description                                     | Input                                   | Output             | 
| ------------------------ | ----------------------------------------------- | ----------------------------------------| ------------------ |
| getCurrencyDecimals      | Get a number of decimal digits for a currency   | currency code :: string                 | decimals :: number |
| getFXRateDecimals        | Get a number of decimal digits for a FX rate    | FX rate :: [number, string]             | decimals :: number |
| getLocalDateTime         | Get local date and time from ISO 8601 timestamp | UTC timestamp :: string                 | timestamp :: date  |
| formatCurrencyAmount     | Format amount according to its currency         | amount :: [number, string], options :: object (optional) | amount :: string |
| formatDate               | Format date to a chosen format                  | date :: string, date format :: string   | date :: string     |
| formatDateToISO          | Format localized date string to ISO timestamp   | date :: string, date format :: string (optional), sign of strict date format :: boolean (optional), default value :: string (optional), default date format :: string (optional) | ISO date :: string |
| formatFloatToFixedDecimals | Format an input to a float with fixed number of decimals | value to format :: [number, string], decimals :: number | formatted value :: string |
| formatFXRate             | Format FX rate                                  | FX rate :: [string, number]             | FX rate :: string  |

#### formatCurrencyAmount option object
| Option key          | Value             | Default | Description                                     |
| ------------------- | ----------------- | ------- | ----------------------------------------------- |
| currency            | string (optional) |         | Currency code to get number of decimals from    |
| decimals            | string (optional) |       2 | Number of decimals, overrides currency decimals |
| thousandSeparator   | string (optional) |         | Thousand separator                              |
| decimalSeparator    | string (optional) |     '.' | Decimal separator                               |

### Code example
#### Import only the parts you need
```jsx
import React from 'react';
import { getCurrencyDecimals } from '@opuscapita/format-utils';

export default function FormatUtilsExamples() {
  return (
    <p>
      getCurrencyDecimals('EUR') = {getCurrencyDecimals('EUR')}
    </p>
  );
}
```

### Import whole utils library
```jsx
import React from 'react';
import FormatUtils from '@opuscapita/format-utils';

export default function FormatUtilsExamples() {
  return (
    <p>
      FormatUtils.formatCurrencyAmount(432432.23423, &#123; currency: 'EUR' &#125;) = {FormatUtils.formatCurrencyAmount(432432.23423, { currency: 'EUR' })}
    </p>
    <p>
      FormatUtils.formatFloatToFixedDecimals(1234.12345, 2) = {FormatUtils.formatFloatToFixedDecimals(1234.12345, 2)}
    </p>
  );
}
```