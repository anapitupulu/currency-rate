import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, GetterTree } from 'vuex';
import axios, {AxiosResponse} from 'axios';
import { ICurrency } from './types/currency';

Vue.use(Vuex);

export const BASE_CURRENCY = 'USD';

interface IState {
  activeCurrencies: string[];
  availableCurrencies: {[currencyId: string]: ICurrency};
  isFetchingData: boolean;
}

interface ExchangeRatesApiResponse {
  rates: {[currencyId: string]: number};
  base: string;
  date: string;
}

const storeState: IState = {
  activeCurrencies: [],
  availableCurrencies: {
    USD: { label: 'United States Dollar'},
    CAD: { label: 'Canadian Dollar' },
    IDR: { id: 'IDR', label: 'Indonesian Rupiah' },
    GBP: { id: 'GBP', label: 'Pound Sterling' },
    EUR: { id: 'EUR', label: 'Euro' },
    CHF: { id: 'CHF', label: 'Swiss Franc' },
    SGD: { id: 'SGD', label: 'Singapore Dollar' },
    INR: { id: 'INR', label: 'Indian Rupee' },
    MYR: { id: 'MYR', label: 'Malaysian Ringgit' },
    JPY: { id: 'JPY', label: 'Japanese Yen' },
    KRW: { id: 'KRW', label: 'South Korean Won' },
  },
  isFetchingData: false,
};

const mutations: MutationTree<IState> = {
  setCurrencyRate(state: IState, currencyRate: { id: string, rateFromBase: number }) {
    Vue.set(state.availableCurrencies[currencyRate.id], 'rateFromBase', currencyRate.rateFromBase);
  },

  setFetchingData(state: IState, isFetchingData: boolean) {
    state.isFetchingData = isFetchingData;
  },

  addActiveCurrency(state: IState, currencyId: string) {
    state.activeCurrencies.push(currencyId);
  },

  removeActiveCurrency(state: IState, currencyId: string) {
    state.activeCurrencies = state.activeCurrencies.filter((currency) => currency !== currencyId);
  },
};

const actions: ActionTree<IState, IState> = {
  async refreshRates({state, commit}) {
    if (state.activeCurrencies.length === 0) {
      return;
    }

    commit('setFetchingData', true);
    const res: AxiosResponse<ExchangeRatesApiResponse> =
      await axios.get(`https://api.exchangeratesapi.io/latest?base=${BASE_CURRENCY}&symbols=${state.activeCurrencies.join()}`);
    const newRates = res.data;

    state.activeCurrencies.forEach((currency) => {
      commit('setCurrencyRate', {id: currency, rateFromBase: newRates.rates[currency]});
    });
    commit('setFetchingData', false);
  },

  async addCurrency({commit, dispatch}, addedCurrency: string) {
    commit('addActiveCurrency', addedCurrency);
    dispatch('refreshRates');
  },

  async removeCurrency({commit, dispatch}, removedCurrency: string) {
    commit('removeActiveCurrency', removedCurrency);
    dispatch('refreshRates');
  },
};

const getters: GetterTree<IState, IState> = {

  unselectedCurrencies: (state: IState): string[] => {
    const allCurrencies: string[] = Object.keys(state.availableCurrencies);
    return allCurrencies
      .filter((currency) => currency !== BASE_CURRENCY)
      .filter((currency) => !state.activeCurrencies.includes(currency));
  },
};

export default new Vuex.Store({
  mutations,
  actions,
  getters,
  state: storeState,
});
