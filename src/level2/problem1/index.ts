export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private cache: Map<string, Promise<TOutput>> = new Map();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  
  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    // Check if the result is already cached
    if (this.cache.has(key)) {

      return this.cache.get(key)!; // Return cached result

    } else {

      // Execute the handler function and cache the result
      const resultPromise = this.handler(...args);
      this.cache.set(key, resultPromise);
      return resultPromise;
      
    }
  }
}
