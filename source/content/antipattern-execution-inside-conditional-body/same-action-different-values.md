<!--bl
(filemeta
    (title "Same Action, Different Values"))
/bl-->

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