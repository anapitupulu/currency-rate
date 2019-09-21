import Vuetify from 'vuetify';
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import BaseCurrency from '@/components/BaseCurrency.vue';

Vue.use(Vuetify);

describe(`CurrencyRate`, () => {

  it(`should emit event newAmountEntered when amount is modified`, () => {
    const wrapper = shallowMount(BaseCurrency, {
      propsData: {
        amount: 10,
        currencyId: 'IDR',
        currency: {
          label: 'Indonesian Rupiah',
          rateFromBase: 2000,
        },
      },
    });
    wrapper.setData({currencyAmount: 15});
    expect(wrapper.emitted('newAmountEntered')).toBeTruthy();
  });

});

