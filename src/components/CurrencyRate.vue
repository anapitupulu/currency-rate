<template>
  <v-container>
    <v-card class="pa-2">
      <v-row no-gutters>
        <v-col cols="10">
          <v-row no-gutters>
            <v-col class="font-weight-black">
              {{ currencyId }}
            </v-col>
            <v-col qa-id="total-amount" class="text-right">
              {{ totalAmount | toLocale }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="font-weight-light">
              {{ currencyId }} - {{ currency.label }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="font-weight-medium">
              1 {{ baseCurrency }} = {{ currencyId }} {{ currency.rateFromBase | toLocale }}
            </v-col>
          </v-row>
        </v-col>
        <v-col align-self="center" class="text-center" cols="2">
          <v-btn icon color="red" x-large @click="removeCurrency">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ICurrency } from '../types/currency';

@Component({
  filters: {
    toLocale: (num: number): string => {
      if (num) {
        return num.toLocaleString();
      }
      return '-';
    },
  },
})

/**
 * Vue component to display the conversion rate from a base currency to other currency
 */
export default class CurrencyRate extends Vue {

  /** the ID of the currency to be displayed */
  @Prop({required: true})
  private currencyId: string;

  /** the data of the currency to be displayed */
  @Prop({required: true})
  private currency: ICurrency;

  /** the amount of the base currency to be converted */
  @Prop({required: true})
  private currencyAmount: number;

  /** the ID of the base currency */
  @Prop({ default: 'USD' })
  private baseCurrency: string;

  /** computed property to calculate the total amount of the currency */
  get totalAmount(): number {
    return this.currencyAmount * (this.currency.rateFromBase || 0);
  }

  /**
   * Removes this currency from the list of the selected currencies
   * It emits `currencyRemoved` event along with the ID of the removed currency.
   */
  private removeCurrency() {
    this.$emit('currencyRemoved', this.currencyId);
  }
}
</script>
