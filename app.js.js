// app.js - Main React Application
import React, { useState, useEffect, createContext, useContext } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

// Configuration
const CONFIG = {
    APP_NAME: "SmartAirTrade",
    SUPPORT_EMAIL: "SmartAirTradeCustomerService@outlook.com",
    SUPPORT_TELEGRAM: "https://t.me/XdyLn25"
};

// Mock Data
const MOCK_CRYPTO_DATA = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 45230.75, change24h: 2.15, sparkline: [44000, 44500, 44800, 45000, 45230] },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2410.90, change24h: 3.52, sparkline: [2350, 2380, 2400, 2410, 2410] },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price: 98.25, change24h: -1.10, sparkline: [99, 98.5, 98, 98.2, 98.25] },
    { id: 'bnb', symbol: 'BNB', name: 'Binance Coin', price: 315.42, change24h: 0.85, sparkline: [312, 314, 315, 315.5, 315.42] },
    { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0.58, change24h: -0.45, sparkline: [0.57, 0.575, 0.58, 0.579, 0.58] }
];

const MOCK_PORTFOLIO = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', amount: 0.15, value: 6784.61, price: 45230.75, change24h: 2.15 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', amount: 3.2, value: 7714.88, price: 2410.90, change24h: 3.52 },
    { id: 'usdt', symbol: 'USDT', name: 'Tether', amount: 15000, value: 15000, price: 1, change24h: 0 }
];

// Context
const AppContext = createContext();

// Main App Component
function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [cryptoData, setCryptoData] = useState(MOCK_CRYPTO_DATA);
    const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO);
    const [totalBalance, setTotalBalance] = useState(29499.49);
    const [theme, setTheme] = useState('dark');

    // Simulate live price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCryptoData(prev => prev.map(coin => ({
                ...coin,
                price: coin.price * (1 + (Math.random() - 0.5) * 0.002),
                change24h: coin.change24h + (Math.random() - 0.5) * 0.1
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const contextValue = {
        cryptoData,
        portfolio,
        totalBalance,
        theme,
        setTheme
    };

    return React.createElement(AppContext.Provider, { value: contextValue },
        React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white' },
            React.createElement(Navigation, { currentView, setCurrentView }),
            React.createElement(MainContent, { currentView, setCurrentView })
        )
    );
}

// Navigation Component
function Navigation({ currentView, setCurrentView }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'market', label: 'Market', icon: '📈' },
        { id: 'trade', label: 'Trade', icon: '💹' },
        { id: 'mining', label: 'Mining', icon: '⛏️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return React.createElement('nav', { className: 'glass border-b border-slate-700' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4' },
            React.createElement('div', { className: 'flex items-center justify-between h-16' },
                // Logo
                React.createElement('div', { className: 'flex items-center space-x-3' },
                    React.createElement('div', { className: 'w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center' },
                        React.createElement('span', { className: 'font-bold text-white' }, 'SA')
                    ),
                    React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'SmartAirTrade')
                ),
                
                // Desktop Navigation
                React.createElement('div', { className: 'hidden md:flex space-x-1' },
                    ...navItems.map(item => 
                        React.createElement('button', {
                            key: item.id,
                            onClick: () => setCurrentView(item.id),
                            className: `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentView === item.id 
                                    ? 'bg-sky-500 text-white' 
                                    : 'text-slate-300 hover:bg-slate-700'
                            }`
                        },
                            React.createElement('span', {}, item.icon),
                            React.createElement('span', {}, item.label)
                        )
                    )
                ),

                // Mobile menu button
                React.createElement('button', {
                    className: 'md:hidden p-2 rounded-lg hover:bg-slate-700'
                }, '☰')
            )
        )
    );
}

// Main Content Component
function MainContent({ currentView, setCurrentView }) {
    const views = {
        dashboard: Dashboard,
        market: Market,
        trade: Trade,
        mining: Mining,
        settings: Settings
    };

    const CurrentView = views[currentView] || Dashboard;
    
    return React.createElement('main', { className: 'max-w-7xl mx-auto py-8 px-4' },
        React.createElement(CurrentView, { setCurrentView })
    );
}

// Dashboard Component
function Dashboard({ setCurrentView }) {
    const { portfolio, totalBalance, cryptoData } = useContext(AppContext);
    const [showBalance, setShowBalance] = useState(true);

    return React.createElement('div', { className: 'space-y-8 animate-fade-in' },
        // Balance Card
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                React.createElement('h2', { className: 'text-2xl font-bold text-slate-300' }, 'Total Balance'),
                React.createElement('button', {
                    onClick: () => setShowBalance(!showBalance),
                    className: 'p-2 hover:bg-slate-700 rounded-lg transition-colors'
                }, showBalance ? '👁️' : '👁️‍🗨️')
            ),
            React.createElement('div', { className: 'text-5xl font-bold text-white mb-8' },
                showBalance ? `$${totalBalance.toLocaleString()}` : '••••••'
            ),
            React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
                ...[
                    { icon: '⬇️', label: 'Deposit', action: () => setCurrentView('market') },
                    { icon: '⬆️', label: 'Withdraw', action: () => setCurrentView('market') },
                    { icon: '💹', label: 'Trade', action: () => setCurrentView('trade') },
                    { icon: '⛏️', label: 'Mining', action: () => setCurrentView('mining') }
                ].map((item, index) =>
                    React.createElement('button', {
                        key: index,
                        onClick: item.action,
                        className: 'flex flex-col items-center p-4 bg-slate-700/50 rounded-xl hover:scale-105 transition-transform duration-200'
                    },
                        React.createElement('span', { className: 'text-2xl mb-2' }, item.icon),
                        React.createElement('span', { className: 'font-semibold text-slate-300' }, item.label)
                    )
                )
            )
        ),

        // Portfolio Section
        React.createElement('div', { className: 'card' },
            React.createElement('h2', { className: 'text-2xl font-bold text-white mb-6' }, 'My Portfolio'),
            React.createElement('div', { className: 'space-y-4' },
                ...portfolio.map(asset =>
                    React.createElement('div', {
                        key: asset.id,
                        className: 'flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors'
                    },
                        React.createElement('div', { className: 'flex items-center space-x-4' },
                            React.createElement('div', { 
                                className: 'w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'
                            }, asset.symbol),
                            React.createElement('div', {},
                                React.createElement('h3', { className: 'font-bold text-white' }, asset.symbol),
                                React.createElement('p', { className: 'text-slate-400' }, asset.name)
                            )
                        ),
                        React.createElement('div', { className: 'text-right' },
                            React.createElement('p', { className: 'font-bold text-white' }, 
                                `$${asset.value.toLocaleString()}`
                            ),
                            React.createElement('p', { 
                                className: `font-semibold ${asset.change24h >= 0 ? 'text-profit' : 'text-loss'}`
                            }, `${asset.change24h >= 0 ? '+' : ''}${asset.change24h?.toFixed(2)}%`)
                        )
                    )
                )
            )
        ),

        // Market Overview
        React.createElement('div', { className: 'card' },
            React.createElement('h2', { className: 'text-2xl font-bold text-white mb-6' }, 'Market Overview'),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
                ...cryptoData.slice(0, 3).map(coin =>
                    React.createElement('div', {
                        key: coin.id,
                        className: 'p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors'
                    },
                        React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                            React.createElement('div', {},
                                React.createElement('h3', { className: 'font-bold text-white' }, coin.name),
                                React.createElement('p', { className: 'text-slate-400' }, coin.symbol)
                            ),
                            React.createElement('span', { 
                                className: `px-2 py-1 rounded text-xs font-bold ${
                                    coin.change24h >= 0 ? 'bg-profit text-green-900' : 'bg-loss text-red-900'
                                }`
                            }, `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(2)}%`)
                        ),
                        React.createElement('p', { className: 'text-2xl font-bold text-white' },
                            `$${coin.price.toLocaleString()}`
                        )
                    )
                )
            )
        )
    );
}

// Market Component
function Market({ setCurrentView }) {
    const { cryptoData } = useContext(AppContext);

    return React.createElement('div', { className: 'card animate-fade-in' },
        React.createElement('h1', { className: 'text-3xl font-bold text-white mb-8' }, 'Market'),
        React.createElement('div', { className: 'overflow-x-auto' },
            React.createElement('table', { className: 'w-full' },
                React.createElement('thead', {},
                    React.createElement('tr', { className: 'border-b border-slate-700' },
                        React.createElement('th', { className: 'text-left py-4 font-semibold text-slate-400' }, 'Asset'),
                        React.createElement('th', { className: 'text-right py-4 font-semibold text-slate-400' }, 'Price'),
                        React.createElement('th', { className: 'text-right py-4 font-semibold text-slate-400' }, '24h Change'),
                        React.createElement('th', { className: 'text-right py-4 font-semibold text-slate-400' }, 'Action')
                    )
                ),
                React.createElement('tbody', {},
                    ...cryptoData.map(coin =>
                        React.createElement('tr', {
                            key: coin.id,
                            className: 'border-b border-slate-700 hover:bg-slate-700/30 transition-colors'
                        },
                            React.createElement('td', { className: 'py-4' },
                                React.createElement('div', { className: 'flex items-center space-x-3' },
                                    React.createElement('div', { 
                                        className: 'w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'
                                    }, coin.symbol),
                                    React.createElement('div', {},
                                        React.createElement('p', { className: 'font-bold text-white' }, coin.name),
                                        React.createElement('p', { className: 'text-slate-400' }, coin.symbol)
                                    )
                                )
                            ),
                            React.createElement('td', { className: 'text-right py-4 font-bold text-white' },
                                `$${coin.price.toLocaleString()}`
                            ),
                            React.createElement('td', { className: 'text-right py-4' },
                                React.createElement('span', { 
                                    className: `font-bold ${coin.change24h >= 0 ? 'text-profit' : 'text-loss'}`
                                }, `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(2)}%`)
                            ),
                            React.createElement('td', { className: 'text-right py-4' },
                                React.createElement('button', {
                                    onClick: () => setCurrentView('trade'),
                                    className: 'btn-primary'
                                }, 'Trade')
                            )
                        )
                    )
                )
            )
        )
    );
}

// Trade Component
function Trade() {
    return React.createElement('div', { className: 'card text-center animate-fade-in' },
        React.createElement('div', { className: 'w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6' },
            React.createElement('span', { className: 'text-4xl' }, '🚀')
        ),
        React.createElement('h1', { className: 'text-3xl font-bold text-white mb-4' }, 'Trading Platform'),
        React.createElement('p', { className: 'text-slate-400 mb-8 text-lg' },
            'Advanced trading features coming soon with real-time order books and professional charting tools.'
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto' },
            React.createElement('div', { className: 'p-6 bg-slate-700/30 rounded-xl' },
                React.createElement('h3', { className: 'font-bold text-white mb-2' }, 'Spot Trading'),
                React.createElement('p', { className: 'text-slate-400 mb-4' }, 'Trade cryptocurrencies instantly'),
                React.createElement('button', { className: 'btn-primary w-full' }, 'Coming Soon')
            ),
            React.createElement('div', { className: 'p-6 bg-slate-700/30 rounded-xl' },
                React.createElement('h3', { className: 'font-bold text-white mb-2' }, 'Options Trading'),
                React.createElement('p', { className: 'text-slate-400 mb-4' }, 'Advanced derivatives trading'),
                React.createElement('button', { className: 'btn-primary w-full' }, 'Coming Soon')
            )
        )
    );
}

// Mining Component
function Mining() {
    return React.createElement('div', { className: 'card text-center animate-fade-in' },
        React.createElement('div', { className: 'w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6' },
            React.createElement('span', { className: 'text-4xl' }, '⛏️')
        ),
        React.createElement('h1', { className: 'text-3xl font-bold text-white mb-4' }, 'Cloud Mining'),
        React.createElement('p', { className: 'text-slate-400 mb-8 text-lg' },
            'Earn passive income with our cloud mining services. Competitive returns with flexible plans.'
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto' },
            ...[
                { period: '3 Days', yield: '5%', min: '$100', color: 'from-green-500 to-emerald-600' },
                { period: '15 Days', yield: '12%', min: '$500', color: 'from-blue-500 to-cyan-600' },
                { period: '30 Days', yield: '25%', min: '$1000', color: 'from-purple-500 to-pink-600' }
            ].map((plan, index) =>
                React.createElement('div', {
                    key: index,
                    className: 'p-6 bg-slate-700/30 rounded-xl hover:scale-105 transition-transform duration-200'
                },
                    React.createElement('div', { 
                        className: `w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`
                    },
                        React.createElement('span', { className: 'text-2xl text-white' }, '💰')
                    ),
                    React.createElement('h3', { className: 'font-bold text-white text-xl mb-2' }, plan.period),
                    React.createElement('p', { className: 'text-3xl font-bold text-profit mb-2' }, plan.yield),
                    React.createElement('p', { className: 'text-slate-400 mb-4' }, `Min: ${plan.min}`),
                    React.createElement('button', { className: 'btn-primary w-full' }, 'Invest Now')
                )
            )
        )
    );
}

// Settings Component
function Settings({ setCurrentView }) {
    const { theme, setTheme } = useContext(AppContext);

    return React.createElement('div', { className: 'max-w-2xl mx-auto animate-fade-in' },
        React.createElement('div', { className: 'card' },
            React.createElement('h1', { className: 'text-3xl font-bold text-white mb-8' }, 'Settings'),
            React.createElement('div', { className: 'space-y-6' },
                // Theme Setting
                React.createElement('div', { className: 'flex items-center justify-between p-4 bg-slate-700/30 rounded-lg' },
                    React.createElement('div', {},
                        React.createElement('h3', { className: 'font-bold text-white' }, 'Theme'),
                        React.createElement('p', { className: 'text-slate-400' }, 'Switch between dark and light mode')
                    ),
                    React.createElement('select', {
                        value: theme,
                        onChange: (e) => setTheme(e.target.value),
                        className: 'px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white'
                    },
                        React.createElement('option', { value: 'dark' }, 'Dark'),
                        React.createElement('option', { value: 'light' }, 'Light')
                    )
                ),

                // Support Section
                React.createElement('div', { className: 'p-4 bg-slate-700/30 rounded-lg' },
                    React.createElement('h3', { className: 'font-bold text-white mb-4' }, 'Support'),
                    React.createElement('div', { className: 'space-y-3' },
                        React.createElement('p', { className: 'text-slate-400' },
                            React.createElement('strong', {}, 'Email: '),
                            CONFIG.SUPPORT_EMAIL
                        ),
                        React.createElement('p', { className: 'text-slate-400' },
                            React.createElement('strong', {}, 'Telegram: '),
                            React.createElement('a', {
                                href: CONFIG.SUPPORT_TELEGRAM,
                                className: 'text-sky-400 hover:underline',
                                target: '_blank'
                            }, 'Join our community')
                        )
                    )
                ),

                // Back Button
                React.createElement('button', {
                    onClick: () => setCurrentView('dashboard'),
                    className: 'w-full btn-primary'
                }, 'Back to Dashboard')
            )
        )
    );
}

// Initialize React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));