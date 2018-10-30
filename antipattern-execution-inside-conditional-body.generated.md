
# Antipattern: Execution Inside Conditional Body #

## Table Of Contents ##

- [Section 1: Introduction](#user-content-introduction)
- [Section 2: The Setup](#user-content-the-setup)
- [Section 3: Same Action, Different Values](#user-content-same-action,-different-values)

## Introduction ##

It's common to hear people talking about the dread "pyramid of doom" as they work their way through code they, or someone else, wrote.  It is possible to demonstrate a way to flatten a set of nested conditionals, however, the problem which originally introduced the nested conditionals still exists, leaving a place for someone to come back and introduce nested branches back into the system.

What this really points to is, performing any kind of executed logic within a condition is actually an antipattern. There are people who advocate for "condition free" code, but really this is accomplished, at least in part, through a little bit of trickery.  Really, what they are advocating for is prefering value-choosing behavior over action-execution behavior.

There are four different situations, once conditionals are flattened, which occur that can be refactored to value-choosing behavior: same action, different values; different actions with the same contract, different values; different actions with the same contract, same values; and different actions with different contracts, computed values.

Instead of trying to explain what each of these means, let's just dive in and see what the code looks like.  Once we understand the way the code looks, we can explore how to refactor the code in order to make our programs easier to reason about and maintain.
    

## The Setup ##

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
    

## Same Action, Different Values ##

Conditional logic where the action remains the same but the values differ is likely the easiest case to deal with. Since the action always remains the same, the only work we must do is identify the values which will be acted upon.  What this code is like, when people first write it, is like the following:

```javascript
function modifyStateValues(stateObject, a, b) {
    if(typeof a === 'undefined' || a === null) {
        stateObject
            .setState('a', 'defaultAValue')
            .setState('b', b);
    } else if (typeof b === 'undefined' || b === null) {
        stateObject
            .setState('a', a)
            .setState('b', 'defaultBValue');
    } else if ((typeof a === 'undefined' || a === null)
                && (typeof b === 'undefined' || b === null)){
        stateObject
            .setState('a', 'defaultAValue')
            .setState('b', 'defaultBValue');
    } else {
        stateObject
            .setState('a', a)
            .setState('b', b);
    }
}
```

We can see it's possible for `a` or `b` to either be null or undefined. We can also see there is a lot of duplication in this code. Ultimately, however, we will do a couple of small refactorings and this code will reduce to near nothing.  Let's make our modifications.

First, we will extract the default values for `a` and `b` so we don't have to maintain duplicated magic strings throughout our code.

```javascript
function modifyStateValues(stateObject, a, b) {
    const defaultAValue = 'defaultAValue';
    const defaultBValue = 'defaultBValue';

    if (typeof a === 'undefined' || a === null) {
        stateObject
            .setState('a', defaultAValue)
            .setState('b', b);
    } else if (typeof b === 'undefined' || b === null) {
        stateObject
            .setState('a', a)
            .setState('b', defaultBValue);
    } else if ((typeof a === 'undefined' || a === null)
        && (typeof b === 'undefined' || b === null)) {
        stateObject
            .setState('a', defaultAValue)
            .setState('b', defaultBValue);
    } else {
        stateObject
            .setState('a', a)
            .setState('b', b);
    }
}
```

With our default values extracted, we can make another move; choose the actual value or the default value based on the condition of the original argument.  Let's introduce this work without substituting yet.

```javascript
function modifyStateValues(stateObject, a, b) {
    const defaultAValue = 'defaultAValue';
    const defaultBValue = 'defaultBValue';

    const sanitizedAValue = typeof a === 'undefined' || a === null ? a : defaultAValue;
    const sanitizedBValue = typeof b === 'undefined' || b === null ? b : defaultBValue;

    if (typeof a === 'undefined' || a === null) {
        stateObject
            .setState('a', defaultAValue)
            .setState('b', b);
    } else if (typeof b === 'undefined' || b === null) {
        stateObject
            .setState('a', a)
            .setState('b', defaultBValue);
    } else if ((typeof a === 'undefined' || a === null)
        && (typeof b === 'undefined' || b === null)) {
        stateObject
            .setState('a', defaultAValue)
            .setState('b', defaultBValue);
    } else {
        stateObject
            .setState('a', a)
            .setState('b', b);
    }
}
```

Now that we have a sanitized value, we can replace all references to both `a` and `b` as well as `defaultAValue` and `defaultBValue`.  Let's have a look at what that leaves us with.

```javascript
function modifyStateValues(stateObject, a, b) {
    const defaultAValue = 'defaultAValue';
    const defaultBValue = 'defaultBValue';

    const sanitizedAValue = typeof a === 'undefined' || a === null ? a : defaultAValue;
    const sanitizedBValue = typeof b === 'undefined' || b === null ? b : defaultBValue;

    if (typeof a === 'undefined' || a === null) {
        stateObject
            .setState('a', sanitizedAValue)
            .setState('b', sanitizedBValue);
    } else if (typeof b === 'undefined' || b === null) {
        stateObject
            .setState('a', sanitizedAValue)
            .setState('b', sanitizedBValue);
    } else if ((typeof a === 'undefined' || a === null)
        && (typeof b === 'undefined' || b === null)) {
        stateObject
            .setState('a', sanitizedAValue)
            .setState('b', sanitizedBValue);
    } else {
        stateObject
            .setState('a', sanitizedAValue)
            .setState('b', sanitizedBValue);
    }
}
```

```javascript
function modifyStateValues(stateObject, a, b) {
    const defaultAValue = 'defaultAValue';
    const defaultBValue = 'defaultBValue';

    const sanitizedAValue = typeof a === 'undefined' || a === null ? a : defaultAValue;
    const sanitizedBValue = typeof b === 'undefined' || b === null ? b : defaultBValue;

    stateObject
        .setState('a', sanitizedAValue)
        .setState('b', sanitizedBValue);
}
```

```javascript
function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' || value === null ? value : defaultValue;
}

function modifyStateValues(stateObject, a, b) {
    const defaultAValue = 'defaultAValue';
    const defaultBValue = 'defaultBValue';

    const sanitizedAValue = valueOrDefault(a, defaultAValue);
    const sanitizedBValue = valueOrDefault(b, defaultBValue);

    stateObject
        .setState('a', sanitizedAValue)
        .setState('b', sanitizedBValue);
}
```

```javascript
function valueOrDefault(value, defaultValue) {
    return typeof value === 'undefined' || value === null ? value : defaultValue;
}

function modifyStateValues(stateObject, a, b) {
    const sanitizedAValue = valueOrDefault(a, 'defaultAValue');
    const sanitizedBValue = valueOrDefault(b, 'defaultBValue');

    stateObject
        .setState('a', sanitizedAValue)
        .setState('b', sanitizedBValue);
}
```
    

    