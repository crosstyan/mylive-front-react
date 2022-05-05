import { useState } from 'react'
import Dashboard from './components/Dashboard'
import { store } from './store'
import { Provider } from 'react-redux'

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Dashboard />
      </div>
    </Provider>
  )
}

export default App
