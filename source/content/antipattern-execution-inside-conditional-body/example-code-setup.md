<!--bl
(filemeta
    (title "The Setup"))
/bl-->

Before we dive into looking at conditionals and how to remove blocks of behavior from them, we need a couple little pieces of code. One is a state management object, which has simple set and get methods. The other is some data request logic from a cache.

Our state object will look like the following:

```javascript
function stateManager() {
    this.stateStore = {};
}

stateManager.prototype = {
    get: function(key) {
        return this.stateStore[key];
    },

    set: function(key, value) {
        this.stateStore[key] = value;
        return this;
    }
}
```

To request data, we will use the following chunk of code.  The primary reason we need this API is to give us an API to interact with as we look at different source code examples.

```javascript
const robotCacheApi = {
    getRobotDataFromCache: function (dataId) {
        return {
            id: dataId,
            name: 'Gort',
            commands: ['Klaatu barada nikto']
        };
    },

    getRobotDataAndError: function(dataId) {
        return new Error('Robot does not exist in cache');
    }
}
```