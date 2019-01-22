'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import VerificationComponent from './VerificationComponent.vue';

Vue.use(Vuex);
function initApp(config) {
  const store = new Vuex.Store({
    state: {
      endpointURL: config.endpointURL,
      subject: config.subject,
      commentID: config.commentID,
      token: config.token,
      configValid: (config.endpointURL && config.commentID && config.token),
      verifying: false,
      verified: false,
      error: null
    },
    mutations: {
      verificationStart: function(state) {
        state.verifying = true;
        state.error = null;
      },
      verificationEnd: function(state, { success, error }) {
        state.verifying = false;
        state.verified = Boolean(success);
        state.error = error || null;
      }
    },
    actions: {
      startVerification: function(context) {
        context.commit('verificationStart');
        const endpointURL = context.state.endpointURL;
        const encodedSubject = encodeURIComponent(context.state.subject);
        const commentID = context.state.commentID;
        return fetch(`${endpointURL}/subjects/${encodedSubject}/comments/${commentID}/verify`, {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: context.state.token })
        }).then(function(response) {
          if (!response.ok) {
            throw new Error('Call failed - status code ' + response.status);
          }
          context.commit('verificationEnd', { success: true });
        }).catch(function(error) {
          context.commit('verificationEnd', { success: false, error: error });
        });
      }
    }
  });
  const app = new Vue({
    el: '#verify',
    store: store,
    components: { VerificationComponent },
    render: function(createElement) {
      return createElement('VerificationComponent');
    }
  });
}

const params = new URLSearchParams(window.location.search);
initApp({
  endpointURL: window.location.origin,
  commentID: params.get('commentID'),
  subject: params.get('subject'),
  token: params.get('token')
});
