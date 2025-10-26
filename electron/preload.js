// electron/preload.js
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // APIs exposed to React
});
