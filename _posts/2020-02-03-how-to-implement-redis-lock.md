## Implementing Redis Lock

Redis locks can be very useful while implementing use cases that need concurrency but you want to avoid DB level locking. Most recently, I came across a similar case while removing single point of failure from a pubsub setup, by introducing additional producers. 

In this case, multiple producer processes would run but only one need to push the queue. If one process goes down, the other process(es) should be able to pick up and push to the queue. This can be solved by taking a lock while producing for say productionLifeCycleTime + n ms, where n offers some breathing space. 

If implemented in redis, the operation that suits this best is [SetNX](https://redis.io/commands/setnx). SetNX returns 0 if value already exists, or 1 if value doesnt exist against a key and sets it. This is an atomic operation, i.e, a SetNX from another process cannot happen while the command is being run from one process. Only if the value is 1, you should execute the expected codeblock. 