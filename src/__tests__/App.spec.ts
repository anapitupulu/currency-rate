import Vuetify from 'vuetify';
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import store from '@/store';

Vue.use(Vuetify);

describe(`App`, () => {

  it(`should display progress bar while fetching rates`, () => {
    const wrapper = shallowMount(App, {
      store,
    });
    store.commit('setFetchingData');
    expect(wrapper.find('[qa-id=progress-bar]').exists());
  });

});

