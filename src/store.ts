import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, GetterTree } from 'vuex';
import axios, {AxiosResponse} from 'axios';
import { ICurrency } from './types/currency';

Vue.use(Vuex);

/** The ID of the base currency. It's hardcoded to "USD" */
export const BASE_CURRENCY = 'USD';

/** Interface for the state of Vuex store */
interface IState {
  selectedCurrencies: string[];
  availableCurrencies: {[currencyId: string]: ICurrency};
  isFetchingData: boolean;
}

/**
 *  Interface for the data returned by the backend: https://api.exchangeratesapi.io
 */
interface ExchangeRatesApiResponse {
  rates: {[currencyId: string]: number};
  base: string;
  date: string;
}

/**
 * The initial values of the Vuex' state
 */
const getDefaultState = (): IState => ({
  selectedCurrencies: [],
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

  /**
   * Sets the rate of a currency
   * @param state {IState} - the state of Vuex store
   * @param currencyRate.id {string} - the ID of the currency to be set
   * @param currencyRate.rateFromBase {number} - the rate from the base to the currency
   */
  setCurrencyRate(state: IState, currencyRate: { id: string, rateFromBase: number }) {
    Vue.set(state.availableCurrencies[currencyRate.id], 'rateFromBase', currencyRate.rateFromBase);
  },

  /**
   * Sets the status of fetching data from the backend
   * When it's fetching the data, the application will display a progress bar to inform the user that
   * the data is being refreshed.
   * @param state {IState} - the state of Vuex store
   * @param isFetchingData {Boolean} - the state of data fetching
   */
  setFetchingData(state: IState, isFetchingData: boolean) {
    state.isFetchingData = isFetchingData;
  },

  /**
   * Adds a currency to the list of selected currencies
   * @param state {IState} - the state of Vuex store
   * @param currencyId {string} - the ID of the currency to be added
   */
  addSelectedCurrency(state: IState, currencyId: string) {
    state.selectedCurrencies.push(currencyId);
  },

  /**
   * Removes a currency to the list of selected currencies
   * @param state {IState} - the state of Vuex store
   * @param currencyId {string} - the ID of the currency to be removed
   */
  removeSelectedCurrency(state: IState, currencyId: string) {
    state.selectedCurrencies = state.selectedCurrencies.filter((currency) => currency !== currencyId);
  },

  /**
   * Resets the store to the initial / default state
   * @param state {IState} - the state of Vuex store
   */
  reset(state: IState) {
    Object.assign(state, getDefaultState());
  },
};

const actions: ActionTree<IState, IState> = {

  /**
   * Refreshes the rates of the selected currencies.
   * This will populate state.availableCurrencies[<currency ID>].rateFromBase field for each of the selected currencies.
   */
  async refreshRates({state, commit}) {
    if (state.selectedCurrencies.length === 0) {
      return;
    }

    commit('setFetchingData', true);
    const res: AxiosResponse<ExchangeRatesApiResponse> =
      await axios.get(`https://api.exchangeratesapi.io/latest?base=${BASE_CURRENCY}&symbols=${state.selectedCurrencies.join()}`);
    const newRates = res.data;

    state.selectedCurrencies.forEach((currency) => {
      commit('setCurrencyRate', {id: currency, rateFromBase: newRates.rates[currency]});
    });
    commit('setFetchingData', false);
  },

  /**
   * Adds a currency to the list of the selected currencies and fetches its rate from the backend.
   */
  async addCurrency({commit, dispatch}, addedCurrency: string) {
    commit('addSelectedCurrency', addedCurrency);
    dispatch('refreshRates');
  },

  /**
   * Removes a currency from the list of the selected currencies and refreshes the rates of the remaining
   * selected currencies from the backend.
   */
  async removeCurrency({commit, dispatch}, removedCurrency: string) {
    commit('removeSelectedCurrency', removedCurrency);
    dispatch('refreshRates');
  },
};

const getters: GetterTree<IState, IState> = {

  /**
   * Returns a list of the unselected currencies to be displayed in the dropdown of 'Add Currency'.
   */
  unselectedCurrencies: (state: IState): string[] => {
    const allCurrencies: string[] = Object.keys(state.availableCurrencies);
    return allCurrencies
      .filter((currency) => currency !== BASE_CURRENCY)
      .filter((currency) => !state.selectedCurrencies.includes(currency));
  },
};

export default new Vuex.Store({
  mutations,
  actions,
  getters,
  state: storeState,
});
