import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation not enabled in the BroswerWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
    ping: () => ipcRenderer.invoke('ping'),
    fetchStockData: (...args) => ipcRenderer.invoke('fetchStockData', ...args),
    fetchActiveSymbols: (...args) => ipcRenderer.invoke('fetchActiveSymbols', ...args),
    fetchNews: (...args) => ipcRenderer.invoke("fetchNews", ...args)
  })
} catch (error) {
  console.error(error)
}