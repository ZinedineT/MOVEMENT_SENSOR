// index.js
if (typeof global === 'undefined') global = globalThis;

import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';

if (!global.Buffer) global.Buffer = Buffer;
if (!global.process) global.process = process;

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
