<template>
  <v-card class="pa-4">
    <v-row>
      <v-col>
        {{currencyId}} - {{currency.label}}
      </v-col>
    </v-row>
    <v-row>
      <v-col
        qa-id="base-currency"
        xs="6"
        sm="8"
      >
        {{currencyId}}
      </v-col>
      <v-col
        xs="6"
        sm="4"
      >
        <v-text-field
          label="amount"
          prefix="$"
          v-model="currencyAmount"
          :rules="[isValidNumber]"
          clearable
        >
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ICurrency } from '../types/currency';

/**
 * Vue component to display the base currency data and also to set its amount
 */
@Component({})
export default class BaseCurrency extends Vue {

  /** the amount to be converted in each selected currencies */
  @Prop({required: true})
  private amount: number;

  /** the ID of the base currency */
  @Prop({required: true})
  private currencyId: string;

  /** the data of the base currency */
  @Prop({required: true})
  private currency: ICurrency;

  /** computed property of the currency amount. This is just a proxy to the `amount` prop */
  get currencyAmount() {
    return this.amount;
  }

  /**
   * custom setter of the currency amount. It will emit `newAmountEntered` event which
   * will trigger the recalculation of each selected currencies
   */
  set currencyAmount(newAmount: number) {
    this.$emit('newAmountEntered', newAmount);
  }

  /**
   * Returns true if `amount` is a valid number. This is used to validate `amount` entered by the user.
   * @param amount {number} - the amount to be validated
   * @returns true if `amount` is a valid number. Otherwise it'll return an error message
   */
  private isValidNumber(amount: number): boolean | string {
    return !isNaN(amount) || 'Enter a valid number';
  }
}
</script>
