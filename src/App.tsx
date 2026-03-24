import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import StrategiesPage from './pages/strategies/StrategiesPage'
import ActiveStrategiesPage from './pages/strategies/ActiveStrategiesPage'
import BacktestPage from './pages/backtest/BacktestPage'
import BacktestResultsPage from './pages/backtest/BacktestResultsPage'
import BacktestDetailPage from './pages/backtest/BacktestDetailPage'
import LiveTradingPage from './pages/live/LiveTradingPage'
import TradeLogsPage from './pages/live/TradeLogsPage'
import DailySummaryPage from './pages/live/DailySummaryPage'
import DataManagementPage from './pages/data/DataManagementPage'
import SettingsPage from './pages/settings/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="strategies" element={<StrategiesPage />} />
        <Route path="strategies/active" element={<ActiveStrategiesPage />} />
        <Route path="backtest" element={<BacktestPage />} />
        <Route path="backtest/results" element={<BacktestResultsPage />} />
        <Route path="backtest/:id" element={<BacktestDetailPage />} />
        <Route path="live" element={<LiveTradingPage />} />
        <Route path="live/trades" element={<TradeLogsPage />} />
        <Route path="live/daily" element={<DailySummaryPage />} />
        <Route path="data" element={<DataManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
