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
    fetchNews: (...args) => ipcRenderer.invoke("fetchNews", ...args),

    getAccountData: (...args) => ipcRenderer.invoke("getAccountData", ...args),
    createAccount: (...args) => ipcRenderer.invoke("createAccount", ...args),
    deleteAccount: (...args) => ipcRenderer.invoke("deleteAccount", ...args),
    buyStock: (...args) => ipcRenderer.invoke("buyStock", ...args),
    sellStock: (...args) => ipcRenderer.invoke("sellStock", ...args),
  })
} catch (error) {
  console.error(error)
}