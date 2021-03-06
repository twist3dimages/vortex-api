/// <reference types="bluebird" />
import * as Promise from 'bluebird';
/**
 * management function. Prevents a function from being called too often
 * and, for function returning a promise, it ensures that it's not run
 * again (through this Debouncer) before the promise is resolved.
 *
 * @class Debouncer
 */
declare class Debouncer {
    private mDebounceMS;
    private mFunc;
    private mTimer;
    private mCallbacks;
    private mAddCallbacks;
    private mRunning;
    private mReschedule;
    private mArgs;
    constructor(func: (...args: any[]) => Error | Promise<void>, debounceMS: number);
    /**
     * schedule the function and invoke the callback once that is done
     * @param callback the callback to invoke upon completion
     * @param args the arguments to pass to the function. When the timer expires
     *             and the function actually gets invoked, only the last set of
     *             parameters will be used
     */
    schedule(callback?: (err: Error) => void, ...args: any[]): void;
    /**
     * run the function immediately without waiting for the timer
     * to run out. (It does cancel the timer though and invokes all
     * scheduled timeouts)
     *
     * @param {(err: Error) => void} callback
     * @param {...any[]} args
     *
     * @memberOf Debouncer
     */
    runNow(callback: (err: Error) => void, ...args: any[]): void;
    /**
     * wait for the completion of the current timer without scheduling it.
     * if the function is not scheduled currently the callback will be
     * called (as a success) immediately.
     * This does not reset the timer
     *
     * @param {(err: Error) => void} callback
     * @param {boolean} immediately if set (default is false) the function gets called
     *                              immediately instead of awaiting the timer
     *
     * @memberOf Debouncer
     */
    wait(callback: (err: Error) => void, immediately?: boolean): void;
    clear(): void;
    private run();
    private invokeCallbacks(localCallbacks, err);
    private startTimer();
}
export default Debouncer;
