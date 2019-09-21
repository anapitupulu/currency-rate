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
        v-for="currencyId in activeCurrencies"
        :currency-id="currencyId"
        :currency="getCurrency(currencyId)"
        :currency-amount="baseCurrencyAmount"
        :baseCurrency="baseCurrencyId"
        @currencyRemoved="removeCurrency"
      >
      </CurrencyRate>
      <v-container>
        <v-select
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
export default class App extends Vue {
  private baseCurrencyAmount = 10;

  get baseCurrencyId() {
    return BASE_CURRENCY;
  }

  get activeCurrencies() {
    return this.$store.state.activeCurrencies;
  }

  get availableCurrencies() {
    return this.$store.state.availableCurrencies;
  }

  get unselectedCurrencies() {
    return this.$store.getters.unselectedCurrencies;
  }

  get currencyAdded() {
    return '';
  }

  set currencyAdded(currencyId: string) {
    this.$store.dispatch('addCurrency', currencyId);
  }

  get isFetchingData() {
    return this.$store.state.isFetchingData;
  }

  private removeCurrency(currencyId: string) {
    this.$store.dispatch('removeCurrency', currencyId);
  }

  private getCurrency(currencyId: string): ICurrency {
    return this.availableCurrencies[currencyId];
  }

  private setAmount(newAmount: number) {
    this.baseCurrencyAmount = newAmount;
  }
}
</script>
