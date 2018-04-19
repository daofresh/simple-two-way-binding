(function () {
    var Z_MODEL = 'z-model';
    var Z_VALUE = 'z-value';

    var _keys = {};
    var _viewers = {};
    var _doms = document.querySelectorAll('['+Z_MODEL+']');

    _doms.forEach(function(el) {
        el._zModel = el.getAttribute(Z_MODEL);
        el.addEventListener('input', onChange, false);
        el.removeAttribute(Z_MODEL);
        if (!_keys[el._zModel]) _keys[el._zModel] = [];
        _keys[el._zModel].push(el);

        _viewers[el._zModel] = document.querySelectorAll('['+Z_VALUE+'='+el._zModel+']');
    })

    var _obj = {};

    function getDefaultValue(key) {
        var els = _keys[key];
        if (els && els.length) {
            el = els[els.length - 1];
            return el.value;
        }
        return null;
    }

    function updateViewers(key) {
        var viewers = _viewers[key];
        if (viewers && viewers.length) {
            viewers.forEach(function(el) {
                el.textContent = _obj[key];
            })
        }
    }

    function makeReactive (obj, key) {
        var val = obj[key];

        Object.defineProperty(obj, key, {
            get: function () {
                return val // Simply return the cached value
            },
            set: function (newVal) {
                val = newVal; // Save the newVal
                notify(key, newVal) // Ignore for now
            }
        })
    }

    // Iterate through our object keys
    function observeData (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                makeReactive(obj, key);
            }
        }
    }

    function notify (key, newVal) {
        var doms = _keys[key];
        if (doms && doms.length) {
            doms.forEach(function(dom) {
                dom.value = newVal;
            })
        }
        updateViewers(key);
    }

    function onChange(e) {
        var key = this._zModel;
        var value = e.target.value;
        if (_obj.hasOwnProperty(key))
            _obj[key] = value;
    }

    for (var key in _keys) {
        _obj[key] = getDefaultValue(key);
        updateViewers(key);
    }

    observeData(_obj);

    window.zData = _obj;
})()