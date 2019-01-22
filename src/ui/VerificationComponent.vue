<template>
  <form class="verifier pure-form">
    <fieldset>
      <legend>Comment verification</legend>
      <p>Thank you for posting a comment! Click the button below to make it appear on the website, under the original article.</p>
      <button v-bind:disabled="(verifying || !configValid)" v-on:click="this.startVerification" class="pure-button pure-button-primary">Verify!</button>
      <p class="result success" v-if="verified">Verification successful!</p>
      <p class="result error" v-if="error">Verification FAILED: {{ error.message }}!</p>
    </fieldset>
  </form>
</template>

<script>
export default {
  methods: {
    startVerification: function(event) {
      this.$store.dispatch('startVerification');
      event.preventDefault();
    }
  },
  computed: {
    configValid: function() {
      return this.$store.state.configValid;
    },
    verifying: function() {
      return this.$store.state.verifying;
    },
    verified: function() {
      return this.$store.state.verified;
    },
    error: function() {
      return this.$store.state.error;
    }
  }
};
</script>

<style>
.verifier {
  min-width: 320px;
  width: 40%;
  padding: 1em;
  margin: 2em auto;
  background-color: #EEE;
  border: 1px solid #DDD;
  border-radius: 5px;
}
.result {
  display: inline;
  margin-left: 0.5em;
  font-weight: bold;
}
.result.success {
  color: green;
}
.result.error {
  color: red;
}
</style>
