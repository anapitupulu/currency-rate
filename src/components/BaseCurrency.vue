<template>
  <v-card class="pa-4">
    <v-row>
      <v-col>
        {{currencyId}} - {{currency.label}}
      </v-col>
    </v-row>
    <v-row>
      <v-col
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

@Component({})
export default class BaseCurrency extends Vue {

  @Prop({required: true})
  private amount: number;

  @Prop({required: true})
  private currencyId: string;

  @Prop({required: true})
  private currency: ICurrency;

  get currencyAmount() {
    return this.amount;
  }

  set currencyAmount(newAmount: number) {
    this.$emit('newAmountEntered', newAmount);
  }

  private isValidNumber(amount: number) {
    return !isNaN(amount) || 'Enter a valid number';
  }
}
</script>
