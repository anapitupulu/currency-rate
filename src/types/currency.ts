/**
 * Interface to model a currency data
 */
export interface ICurrency {

  /** The label for the currency. E,g.: "Indonesian Rupiah" */
  readonly label: string;

  /**
   * The conversion rate from the base currency to this currency.
   * It'll be populated by the data from exchangerateapi.io
   */
  readonly rateFromBase?: number;
}
