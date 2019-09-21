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

const getDefaultState = (): IState => ({
  activeCurrencies: [],
  availableCurrencies: {
    USD: { label: 'United States Dollar'},
    CAD: { label: 'Canadian Dollar' },
    IDR: { label: 'Indonesian Rupiah' },
    GBP: { label: 'Pound Sterling' },
    EUR: { label: 'Euro' },
    CHF: { label: 'Swiss Franc' },
    SGD: { label: 'Singapore Dollar' },
    INR: { label: 'Indian Rupee' },
    MYR: { label: 'Malaysian Ringgit' },
    JPY: { label: 'Japanese Yen' },
    KRW: { label: 'South Korean Won' },
  },
  isFetchingData: false,
});

const storeState: IState = getDefaultState();

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

  reset(state: IState) {
    Object.assign(state, getDefaultState());
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
