var _ = require('underscore');

_.mixin({
    not: function innerNot (value) {
        if (_.isFunction(value)) {
            return _.compose(innerNot, value);
        } else {
            return !value;
        }
    }
});