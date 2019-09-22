<template>
  <v-app>
    <v-content>
      <BaseCurrency
        :amount="baseCurrencyAmount"
        :currency-id="baseCurrencyId"
        :currency="getCurrency(baseCurrencyId)"
        @newAmountEntered="setAmount"
      >
      </BaseCurrency>
      <v-progress-linear
        qa-id="progress-bar"
        absolute
        v-show="isFetchingData"
        indeterminate
      ></v-progress-linear>
      <CurrencyRate
        v-for="currencyId in selectedCurrencies"
        :currency-id="currencyId"
        :currency="getCurrency(currencyId)"
        :currency-amount="baseCurrencyAmount"
        :baseCurrency="baseCurrencyId"
        @currencyRemoved="removeCurrency"
      >
      </CurrencyRate>
      <v-container>
        <v-select
          qa-id="add-currency"
          v-model="currencyAdded"
          label="Add a currency"
          :items="unselectedCurrencies"
        ></v-select>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BASE_CURRENCY } from './store';
import { ICurrency } from './types/currency';
import BaseCurrency from './components/BaseCurrency.vue';
import CurrencyRate from './components/CurrencyRate.vue';

@Component({
  components: {
    BaseCurrency,
    CurrencyRate,
  },
})

/**
 * This is the root Vue component of the application.
 * It puts together sub-components `CurrencyRate` and `BaseCurrency`.
 */
export default class App extends Vue {

  /** the default amount of the currency */
  private baseCurrencyAmount = 10;

  /** the ID of base currency */
  get baseCurrencyId() {
    return BASE_CURRENCY;
  }

  /** the list of selected currencies */
  get selectedCurrencies() {
    return this.$store.state.selectedCurrencies;
  }

  /** the list of all available currencies */
  get availableCurrencies() {
    return this.$store.state.availableCurrencies;
  }

  /** the list unselected currencies */
  get unselectedCurrencies() {
    return this.$store.getters.unselectedCurrencies;
  }

  /** custom getter for currencyAdded. It returns empty string since we don't want to keep the value in the dropdown */
  get currencyAdded() {
    return '';
  }

  /** custom setter for currencyAdded. It calls the store operation */
  set currencyAdded(currencyId: string) {
    this.$store.dispatch('addCurrency', currencyId);
  }

  /** the flag to indicate if the rate is being fetched. Progress bar is displayed when this flag is true */
  get isFetchingData() {
    return this.$store.state.isFetchingData;
  }

  /**
   * Removes a currency from the list of selected currencies
   * @param currencyId {string} - the currency ID to be removed
   */
  private removeCurrency(currencyId: string) {
    this.$store.dispatch('removeCurrency', currencyId);
  }

  /**
   * Gets the data (e.g. label and rate) of a currency
   * @param currencyId {string} - the currency ID whose data to be retrieved
   * @returns the data of the currency
   */
  private getCurrency(currencyId: string): ICurrency {
    return this.availableCurrencies[currencyId];
  }

  /**
   * Sets the amount of the currency to be converted
   * This will trigger the recalculatation of the total amount of each selected currency
   * @param newAmount {number} - the new amount to be converted
   */
  private setAmount(newAmount: number) {
    this.baseCurrencyAmount = newAmount;
  }
}
</script>
