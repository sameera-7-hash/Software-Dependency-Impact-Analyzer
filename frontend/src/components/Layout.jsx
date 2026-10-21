import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Network,
  LayoutDashboard,
  FileJson,
  ShieldAlert,
  Clock,
  Sparkles,
  Database,
  Activity,
  LogOut,
  AlertTriangle,
  XCircle,
  GitCommit,
  Menu,
  X
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import AnimatedBackground from './AnimatedBackground';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const {
    currentUser,
    logout,
    backendHealth,
    dbStatus,
    errorMessage,
    setErrorMessage,
    analysisResult,
    simulationResult,
    securityResult,
    freshnessResult,
    isSimulatedActive,
    displayStats
  } = useAnalysis();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: displayStats?.total_packages ? `${displayStats.total_packages} pkgs` : null,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      to: '/analyze',
      label: 'Analyze Dependencies',
      icon: FileJson,
      badge: null
    },
    {
      to: '/security',
      label: 'Security Analysis',
      icon: ShieldAlert,
      badge: securityResult?.vulnerable_packages_count > 0
        ? `${securityResult.vulnerable_packages_count} vulns`
        : (securityResult ? 'Clean' : null),
      badgeColor: securityResult?.vulnerable_packages_count > 0
        ? 'bg-rose-500/20 text-rose-300'
        : 'bg-emerald-500/20 text-emerald-300'
    },
    {
      to: '/freshness',
      label: 'Freshness / LibYear',
      icon: Clock,
      badge: freshnessResult?.project_total_libyear
        ? `${Number(freshnessResult.project_total_libyear).toFixed(1)}y`
        : null,
      badgeColor: 'bg-sky-500/20 text-sky-300'
    },
    {
      to: '/simulation',
      label: 'What-If Simulation',
      icon: Sparkles,
      badge: isSimulatedActive ? 'Simulated' : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      to: '/history',
      label: 'Project History',
      icon: Database,
      badge: dbStatus?.total_analyses ? `${dbStatus.total_analyses} runs` : null,
      badgeColor: 'bg-slate-800 text-slate-400'
    },
    {
      to: '/inspector',
      label: 'Package Inspector',
      icon: Activity,
      badge: null
    }
  ];

  // Reset scroll and close the mobile drawer whenever the route changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setIsNavOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts: Alt+1..7 jumps between sections, Escape closes the drawer
  useEffect(() => {
    const routes = navItems.map((item) => item.to);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNavOpen(false);
        return;
      }
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const route = routes[Number(e.key) - 1];
      if (route) {
        e.preventDefault();
        navigate(route);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className="relative isolate h-screen text-slate-100 flex flex-col">
      <AnimatedBackground />
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>

      {/* Top Navigation Header */}
      <header className="glass border-b border-slate-800/70 sticky top-0 z-50 shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsNavOpen((open) => !open)}
              aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isNavOpen}
              aria-controls="app-sidebar"
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg"
            >
              {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <NavLink to="/overview" className="flex items-center space-x-3 min-w-0 group rounded-lg" title="Go to Overview">
              <div className="logo-glow p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
                <Network className="w-6 h-6 text-teal-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-gradient text-sm sm:text-base font-bold tracking-tight truncate">Software Dependency Impact Analyzer</h1>
                <p className="hidden sm:block text-xs text-slate-400 truncate">Graph-Based Change Impact & What-If Simulation Engine</p>
              </div>
            </NavLink>
          </div>

          {/* Right Header Statuses & User Session */}
          <div className="flex items-center space-x-3 text-xs shrink-0">
            {/* Backend Health Badge */}
            {backendHealth?.status === 'healthy' ? (
              <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>API Connected (v{backendHealth.version || '1.0.0'})</span>
              </div>
            ) : (
              <div
                className="flex items-center space-x-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-full font-medium"
                title="Backend Offline"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Backend Offline</span>
              </div>
            )}

            {/* Database Persistence Status Badge */}
            {dbStatus?.connected ? (
              <div className="hidden md:flex items-center space-x-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>PostgreSQL Active ({dbStatus.total_projects || 0} projects)</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-1.5 bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-full font-medium">
                <span>Database Standby</span>
              </div>
            )}

            {/* Current User Session & Logout */}
            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name || currentUser.email}</span>
                  <span className="text-[10px] text-teal-400 font-mono">{currentUser.role || 'Analyst'} (Local Session)</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of analyst workspace"
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800/60 px-2.5 py-1.5 rounded-lg transition text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop for the mobile navigation drawer */}
        {isNavOpen && (
          <div
            className="lg:hidden fixed inset-0 top-16 z-30 bg-slate-950/70 backdrop-blur-sm fade-in"
            onClick={() => setIsNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Persistent Left Sidebar (slide-in drawer on small screens) */}
        <aside
          id="app-sidebar"
          className={`w-64 bg-slate-900/95 backdrop-blur-xl lg:bg-slate-900/40 border-r border-slate-800/70 flex-col justify-between shrink-0 p-4 space-y-6 overflow-y-auto fixed top-16 bottom-0 left-0 z-40 lg:static lg:flex ${
            isNavOpen ? 'flex slide-in-left shadow-2xl' : 'hidden'
          }`}
        >
          <div className="space-y-6">
            {/* Active Project Card in Sidebar */}
            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/40 border border-slate-700/80 rounded-xl p-3 space-y-1.5 shadow-lg shadow-black/20">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1">
                <GitCommit className="w-3 h-3 text-teal-400" />
                <span>Active Project</span>
              </div>
              <div className="font-bold text-white text-xs truncate font-mono" title={analysisResult?.project_name}>
                {analysisResult?.project_name || 'No Project Analyzed'}
              </div>
              {analysisResult ? (
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                  <span>Version: v{analysisResult.project_version}</span>
                  <span className="text-teal-400 font-mono font-medium">{displayStats?.total_packages || 0} pkgs</span>
                </div>
              ) : (
                <NavLink
                  to="/analyze"
                  className="inline-flex items-center text-[11px] text-teal-400 hover:text-teal-300 hover:underline underline-offset-2"
                >
                  Analyze a project &rarr;
                </NavLink>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1" aria-label="Analyzer sections">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 pb-2">
                Analyzer Navigation
              </div>
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={`${item.label} (Alt+${index + 1})`}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 text-xs font-medium ${
                        isActive
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 font-semibold shadow-sm'
                          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:translate-x-0.5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Animated active indicator bar */}
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-teal-400 transition-all duration-300 ${
                            isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'
                          }`}
                        />
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                              isActive ? 'scale-110' : 'group-hover:scale-110'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            key={item.badge}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold fade-in ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <kbd className="hidden lg:inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
                            Alt {index + 1}
                          </kbd>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Metadata */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-500">
            <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">Graph Convention:</span>
              <span className="font-mono text-teal-400">A &rarr; B (A depends on B)</span>
            </div>
            {isSimulatedActive && (
              <div className="fade-in flex items-center space-x-1.5 text-indigo-400 font-semibold bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulation Diff Active</span>
              </div>
            )}
            <div className="hidden lg:block px-1 text-slate-600">
              Tip: press <kbd>Alt</kbd> + <kbd>1</kbd>–<kbd>7</kbd> to switch sections
            </div>
          </div>
        </aside>

        {/* Central Content Area */}
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 min-w-0 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 space-y-6 focus:outline-none"
        >
          {/* Global Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="slide-down bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-start space-x-3"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">System Alert / Request Failed</div>
                <div className="text-xs break-words">{errorMessage}</div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss alert"
                title="Dismiss"
                className="p-1 -m-1 text-rose-300/70 hover:text-rose-200 hover:bg-rose-500/20 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Active Route Content (re-keyed so each page animates in) */}
          <div key={location.pathname} className="page-enter space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Application Footer */}
      <footer className="hidden sm:block shrink-0 border-t border-slate-800/70 bg-slate-950/50 backdrop-blur-md py-3 text-center text-xs text-slate-500">
        Software Dependency Impact Analyzer &bull; B.Tech Computer Science Project &bull; Directed Graph & DSA Architecture
      </footer>
    </div>
  );
}
