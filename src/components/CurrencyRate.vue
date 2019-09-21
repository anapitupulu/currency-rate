<template>
  <v-container>
    <v-card class="pa-2">
      <v-row no-gutters>
        <v-col cols="10">
          <v-row no-gutters>
            <v-col class="font-weight-black">
              {{ currencyId }}
            </v-col>
            <v-col class="text-right">
              {{ totalAmount | toLocale }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="font-weight-light">
              {{ currencyId }} - {{ currency.label }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col qa-id="total-amount" class="font-weight-medium">
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
export default class CurrencyRate extends Vue {

  @Prop({required: true})
  private currencyId: string;

  @Prop({required: true})
  private currency: ICurrency;

  @Prop({required: true})
  private currencyAmount: number;

  @Prop({ default: 'USD' })
  private baseCurrency: string;

  get totalAmount(): number {
    return this.currencyAmount * this.currency.rateFromBase;
  }

  private removeCurrency() {
    this.$emit('currencyRemoved', this.currencyId);
  }
}
</script>
