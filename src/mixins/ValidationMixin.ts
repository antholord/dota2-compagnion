import Vue from "vue";
export default Vue.extend({
  methods: {
    validate: function(instance : Vue) {
      // trigger validation on everything
      this._touchAllChildren(instance);

      // read the validation state on everything, make sure there are no errors
      return this._validateAllChildren(instance);
    },
    _validateAllChildren: function(instance : Vue) {
      this._touchAllChildren(instance);
      if (this._validateInstance(instance)) {
        return instance.$children.every(child => this._validateAllChildren(child));
      } else {
        return false;
      }
    },
    _validateInstance: function(instance : Vue) {
      return !instance.$v?.$error;
    },
    _touchAllChildren: function(instance : Vue) {
      if (!instance) return;

      if (instance.$v) instance.$v.$touch();

      if (instance.$children) {
        instance.$children.forEach(child => this._touchAllChildren(child));
      }
    }
  }
});
