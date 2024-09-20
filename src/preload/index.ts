import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation not enabled in the BroswerWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
    ping: () => ipcRenderer.invoke('ping'),
    fetchStockData: (...args) => ipcRenderer.invoke('fetchStockData', ...args),
  })
} catch (error) {
  console.error(error)
}