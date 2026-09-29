import { registerPlugin } from '@capacitor/core';
import type { EvalPlugin } from './definitions';
export const Eval = registerPlugin<EvalPlugin>('Eval');
export * from './definitions';
