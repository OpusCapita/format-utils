# format-utils

Formatting functions in JS

### API

| Function name            | Description                                     | Input                                          | Output             | 
| ------------------------ | ----------------------------------------------- | ---------------------------------------------- | ------------------ |
| getCurrencyDecimals      | Get a number of decimal digits for a currency   | currency code :: string, formatNumber :: function (optional), locale :: string (optional) | decimals :: number |
| getFXRateDecimals        | Get a number of decimal digits for a FX rate    | FX rate :: [number, string]                    | decimals :: number |
| getLocalDateTime         | Get local date and time from ISO 8601 timestamp | UTC timestamp :: string                        | timestamp :: string |
| formatCurrencyAmount     | Format amount according to its currency         | amount :: [number, string], currency code :: string, formatNumber :: function (optional), locale :: string (optional) | amount :: string |
| formatFXRate             | Format FX rate                                  | FX rate :: [string, number]                    | FX rate :: string  |
| formatFloatToFixedDecimals | Format an input to a float with fixed number of decimals | value to format :: [number, string], decimals :: number  | formatted value :: string |
| formatDate               | Format date to a chosen format                  | date :: string, date format :: string          | date :: string     |
| formatDateToISO          | Format localized date string to ISO timestamp   | date :: string, date format :: string (optional), sign of strict date format :: boolean (optional), default value :: string (optional), default date format :: string (optional) | ISO date :: string |
| parseDate                | Parse date string to ISO string or a new format |  date :: string, date format :: string, new date format :: string (optional) | date :: string |
| parseFloat               | Parse float                                     | value :: [number, string], decimal separator :: string | value :: string |
| parseNumber              | Parse number                                    | value :: [number, string]                      | value :: string    |

### Installation

```
npm install --save @opuscapita/format-utils
```

#### Contributing
* Make a new branch for the changes
* Update `CHANGELOG.md` file
* Commit changes (not `lib`)
* Make a pull request
* Complete your pull request and remove your development branch

#### Creating a new release
* Run `npm version [major|minor|patch]` [Info](https://docs.npmjs.com/cli/version)
* Run `npm publish`