<!--bl
(filemeta
    (title "Introduction"))
/bl-->

It's common to hear people talking about the dread "pyramid of doom" as they work their way through code they, or someone else, wrote.  It is possible to demonstrate a way to flatten a set of nested conditionals, however, the problem which originally introduced the nested conditionals still exists, leaving a place for someone to come back and introduce nested branches back into the system.

What this really points to is, performing any kind of executed logic within a condition is actually an antipattern. There are people who advocate for "condition free" code, but really this is accomplished, at least in part, through a little bit of trickery.  Really, what they are advocating for is prefering value-choosing behavior over action-execution behavior.

There are four different situations, once conditionals are flattened, which occur that can be refactored to value-choosing behavior: same action, different values; different actions with the same contract, different values; different actions with the same contract, same values; and different actions with different contracts, computed values.

Instead of trying to explain what each of these means, let's just dive in and see what the code looks like.  Once we understand the way the code looks, we can explore how to refactor the code in order to make our programs easier to reason about and maintain.