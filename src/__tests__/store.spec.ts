import store from '@/store';
import axios from 'axios';

jest.mock('axios');

describe(`store`, () => {
  jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({
    data: {
      rates: {
        CAD: 1.3,
        IDR: 2100,
        GBP: 0.8,
      },
      base: 'USD',
      date: '2019-09-20',
    },
  }));
  beforeEach(() => {
    store.commit('reset');
  });

  it(`should be able to add active currency`, () => {
    store.commit('addActiveCurrency', 'IDR');
    store.commit('addActiveCurrency', 'USD');
    expect(store.state.activeCurrencies.length).toBe(2);
    expect(store.state.activeCurrencies[0]).toBe('IDR');
  });

  it(`should be able to remove active currency`, () => {
    store.commit('addActiveCurrency', 'IDR');
    store.commit('addActiveCurrency', 'USD');
    store.commit('addActiveCurrency', 'SGD');
    store.commit('removeActiveCurrency', 'IDR');
    expect(store.state.activeCurrencies[0]).toBe('USD');
  });

  it(`should populate rates of active currencies when refresh is called`, async () => {
    store.commit('addActiveCurrency', 'CAD');
    store.commit('addActiveCurrency', 'IDR');
    store.commit('addActiveCurrency', 'GBP');
    await store.dispatch('refreshRates');
    expect(store.state.availableCurrencies).toEqual({
      CAD: {
        label: 'Canadian Dollar',
        rateFromBase: 1.3,
      },
      IDR: {
        label: 'Indonesian Rupiah',
        rateFromBase: 2100,
      },
      GBP: {
        label: 'Pound Sterling',
        rateFromBase: 0.8,
      },
      USD: { label: 'United States Dollar'},
      EUR: { label: 'Euro' },
      CHF: { label: 'Swiss Franc' },
      SGD: { label: 'Singapore Dollar' },
      INR: { label: 'Indian Rupee' },
      MYR: { label: 'Malaysian Ringgit' },
      JPY: { label: 'Japanese Yen' },
      KRW: { label: 'South Korean Won' },
    });
  });

  it(`should fetch currency data when a currency is added`, async () => {
    await store.dispatch('addCurrency', 'CAD');
    expect(store.state.availableCurrencies.CAD).toEqual({
      label: 'Canadian Dollar',
      rateFromBase: 1.3,
    });
  });
});
