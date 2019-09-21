import Vuetify from 'vuetify';
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import CurrencyRate from '@/components/CurrencyRate.vue';

Vue.use(Vuetify);

describe(`CurrencyRate`, () => {

  it(`should display the total amount as amount * rate`, () => {
    const wrapper = shallowMount(CurrencyRate, {
      propsData: {
        currencyId: 'IDR',
        currency: {
          label: 'Indonesian Rupiah',
          rateFromBase: 14000.55,
        },
        currencyAmount: 15,
        baseCurrency: 'USD',
      },
    });
    expect(wrapper.find('[qa-id=total-amount]').text()).toBe('210,008.25');
  });

});
