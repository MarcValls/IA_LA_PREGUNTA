export interface EvalPlugin {
  js(options: { script: string }): Promise<{ value: string }>;
}
