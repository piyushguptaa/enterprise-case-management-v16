// Professional CRM Case Management System
// Apollo.io inspired clean business interface

const http = require('http');
const url = require('url');

// Mock data
const mockUser = {
  id: '1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

const mockStats = {
  overview: {
    totalCases: 25,
    openCases: 8,
    resolvedCases: 17,
    avgResolutionTime: 24,
    resolutionRate: 68,
    slaCompliance: 85,
    customerSatisfaction: 4.2,
    avgResponseTime: 2.5
  },
  trends: {
    caseVolume: [
      { date: '2025-01-01', cases: 15, resolved: 12 },
      { date: '2025-01-02', cases: 18, resolved: 14 },
      { date: '2025-01-03', cases: 22, resolved: 19 },
      { date: '2025-01-04', cases: 25, resolved: 17 },
      { date: '2025-01-05', cases: 28, resolved: 22 },
      { date: '2025-01-06', cases: 31, resolved: 25 },
      { date: '2025-01-07', cases: 25, resolved: 20 }
    ],
    responseTime: [
      { hour: '9AM', avgTime: 1.2 },
      { hour: '10AM', avgTime: 2.1 },
      { hour: '11AM', avgTime: 1.8 },
      { hour: '12PM', avgTime: 3.2 },
      { hour: '1PM', avgTime: 2.9 },
      { hour: '2PM', avgTime: 2.1 },
      { hour: '3PM', avgTime: 1.5 },
      { hour: '4PM', avgTime: 2.4 },
      { hour: '5PM', avgTime: 3.1 }
    ]
  },
  breakdown: {
    byPriority: {
      critical: 3,
      high: 7,
      medium: 12,
      low: 8
    },
    byCategory: {
      technical: 12,
      billing: 8,
      account: 5,
      feature: 4,
      other: 1
    },
    byChannel: {
      email: 15,
      phone: 6,
      chat: 3,
      portal: 1
    },
    byStatus: {
      new: 5,
      inProgress: 8,
      resolved: 17,
      closed: 0
    }
  },
  agents: [
    { name: 'Sarah Johnson', cases: 12, resolved: 10, avgRating: 4.8, responseTime: 1.2 },
    { name: 'Mike Chen', cases: 8, resolved: 7, avgRating: 4.5, responseTime: 2.1 },
    { name: 'Emma Davis', cases: 5, resolved: 4, avgRating: 4.9, responseTime: 0.8 }
  ],
  sla: {
    compliance: 85,
    breaches: 4,
    critical: { target: 1, avg: 0.8, compliance: 95 },
    high: { target: 4, avg: 3.2, compliance: 88 },
    medium: { target: 8, avg: 6.5, compliance: 82 },
    low: { target: 24, avg: 18.2, compliance: 90 }
  }
};

// Clean professional HTML template inspired by Apollo.io
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case Management - CRM Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.30.0/index.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: #1e293b;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        
        /* Login Page */
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            position: relative;
        }
        
        .login-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }
        
        .login-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 48px;
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
            width: 100%;
            max-width: 420px;
            position: relative;
            z-index: 1;
        }
        
        .login-header {
            text-center;
            margin-bottom: 32px;
        }
        
        .login-title {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .login-subtitle {
            color: #64748b;
            font-size: 16px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
            font-size: 14px;
        }
        
        .form-input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: rgba(248, 250, 252, 0.8);
            backdrop-filter: blur(10px);
        }
        
        .form-input:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 
                0 0 0 4px rgba(102, 126, 234, 0.1),
                0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 100%;
            box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            box-shadow: 0 8px 15px -3px rgba(102, 126, 234, 0.4);
            transform: translateY(-2px);
        }
        
        .btn-primary:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
        
        .demo-info {
            margin-top: 24px;
            padding: 16px;
            background-color: #f1f5f9;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }
        
        /* Main App Layout */
        .app-container {
            display: flex;
            height: 100vh;
        }
        
        /* Sidebar */
        .sidebar {
            width: 320px;
            background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
            overflow-y: auto;
            position: relative;
        }
        
        .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
        }
        
        .sidebar-header {
            padding: 32px 28px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 1;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .logo-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 4px;
        }
        
        .sidebar-nav {
            padding: 24px 0;
            position: relative;
            z-index: 1;
        }
        
        .nav-section {
            margin-bottom: 40px;
        }
        
        .nav-section-title {
            padding: 0 28px 12px;
            font-size: 11px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            padding: 14px 28px;
            margin: 0 16px 8px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            background: none;
            width: calc(100% - 32px);
            text-align: left;
            cursor: pointer;
            border-radius: 12px;
            position: relative;
        }
        
        .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border-radius: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .nav-item:hover::before {
            opacity: 1;
        }
        
        .nav-item:hover {
            color: white;
            transform: translateX(4px);
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .nav-item.active::before {
            opacity: 1;
        }
        
        .nav-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Customer Management Tabs */
        .customer-tab {
            padding: 12px 20px;
            background: none;
            border: none;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            font-size: 14px;
        }
        
        .customer-tab:hover {
            color: #334155;
            background: rgba(102, 126, 234, 0.1);
        }
        
        .customer-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }
        
        /* Customer Cards */
        .customer-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .customer-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
        }
        
        .customer-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .customer-status.active { background: #dcfce7; color: #166534; }
        .customer-status.inactive { background: #fef2f2; color: #991b1b; }
        .customer-status.prospect { background: #fef3c7; color: #92400e; }
        .customer-status.churned { background: #f3f4f6; color: #374151; }
        
        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        /* Top Header */
        .top-header {
            background-color: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .page-title {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }
        
        .btn-secondary {
            background-color: #f8fafc;
            color: #374151;
            border: 1px solid #d1d5db;
        }
        
        .btn-secondary:hover {
            background-color: #f1f5f9;
        }
        
        /* Content Area */
        .content-area {
            flex: 1;
            padding: 40px;
            overflow-y: auto;
            background: 
                radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
        }
        
        /* Dashboard Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
            background: rgba(255, 255, 255, 0.95);
        }
        
        .stat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        
        .stat-title {
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-value {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 12px;
            line-height: 1;
        }
        
        .stat-change {
            font-size: 14px;
            font-weight: 500;
        }
        
        .stat-change.positive {
            color: #059669;
        }
        
        .stat-change.negative {
            color: #dc2626;
        }
        
        .stat-change.neutral {
            color: #64748b;
        }
        
        /* Quick Actions */
        .actions-section {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .section-header {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b, #475569);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        
        .action-card {
            padding: 32px 24px;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(102, 126, 234, 0.1);
            border-radius: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.4s ease;
            text-decoration: none;
            color: inherit;
            position: relative;
            overflow: hidden;
        }
        
        .action-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        
        .action-card:hover::before {
            opacity: 1;
        }
        
        .action-card:hover {
            transform: translateY(-8px);
            border-color: rgba(102, 126, 234, 0.3);
            box-shadow: 
                0 20px 25px -5px rgba(102, 126, 234, 0.25),
                0 10px 10px -5px rgba(102, 126, 234, 0.04);
            background: rgba(255, 255, 255, 0.9);
        }
        
        .action-icon {
            font-size: 32px;
            margin-bottom: 12px;
            display: block;
        }
        
        .action-title {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
        }
        
        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }
        
        .modal-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
        }
        
        .close-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: none;
            cursor: pointer;
            color: #64748b;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
        }
        
        .close-btn:hover {
            background-color: #f1f5f9;
            color: #374151;
        }
        
        .modal-body {
            color: #64748b;
            line-height: 1.6;
        }
        
        /* Form Elements in Modal */
        .modal .form-group {
            margin-bottom: 20px;
        }
        
        .modal textarea.form-input {
            resize: vertical;
            min-height: 100px;
        }
        
        .modal select.form-input {
            cursor: pointer;
        }
        
        /* Notification */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            min-width: 300px;
        }
        
        .notification.success {
            border-left: 4px solid #059669;
        }
        
        .notification.error {
            border-left: 4px solid #dc2626;
        }
        
        .notification.info {
            border-left: 4px solid #2563eb;
        }
        
        .notification-title {
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .notification-message {
            font-size: 14px;
            color: #64748b;
        }
        
        /* Utility Classes */
        .hidden {
            display: none !important;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .app-container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: auto;
                border-right: none;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .content-area {
                padding: 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .actions-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Analytics Modal Styles */
        .analytics-tab-btn {
            padding: 12px 20px;
            border: none;
            background: none;
            color: #6b7280;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .analytics-tab-btn.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .analytics-tab-btn:hover {
            color: #764ba2;
        }
        
        .chart-container {
            transition: all 0.3s ease;
        }
        
        .chart-container:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }
        
        .chart-bar:hover {
            transform: scaleY(1.05);
            transition: transform 0.2s ease;
        }
        
        .kpi-item {
            transition: all 0.3s ease;
        }
        
        .kpi-item:hover {
            background: #e0e7ff !important;
            transform: translateY(-2px);
        }
        
        .analytics-card {
            position: relative;
        }
        
        .analytics-card::before {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            height: 6px !important;
        }
        
        .analytics-card:hover {
            transform: translateY(-8px);
            box-shadow: 
                0 20px 25px -5px rgba(102, 126, 234, 0.15),
                0 10px 10px -5px rgba(102, 126, 234, 0.1);
            background: rgba(255, 255, 255, 0.98);
        }
        
        .analytics-card .stat-icon {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            color: white !important;
        }
        
        /* Team Management and Workflow Tabs */
        .team-tab-btn, .workflow-tab-btn {
            padding: 12px 24px;
            border: none;
            background: none;
            color: #6b7280;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .team-tab-btn.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
        }
        
        .team-tab-btn:hover {
            color: #2563eb;
            background: rgba(59, 130, 246, 0.05);
        }
        
        .workflow-tab-btn.active {
            color: #8b5cf6;
            border-bottom-color: #8b5cf6;
        }
        
        .workflow-tab-btn:hover {
            color: #7c3aed;
            background: rgba(139, 92, 246, 0.05);
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Login Page -->
        <div id="loginPage" class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <h1 class="login-title">Case Management</h1>
                    <p class="login-subtitle">Sign in to your CRM dashboard</p>
                </div>
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="email" value="admin@example.com" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="password" value="admin123" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" id="loginBtn">
                        Sign In
                    </button>
                </form>
                <div class="demo-info">
                    <strong>Demo Account</strong><br>
                    Email: admin@example.com<br>
                    Password: admin123
                </div>
            </div>
        </div>

        <!-- Main Application -->
        <div id="mainApp" class="app-container hidden">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="logo">CaseFlow</div>
                    <div class="logo-subtitle">Case Management CRM</div>
                </div>
                
                <nav class="sidebar-nav">
                    <div class="nav-section">
                        <div class="nav-section-title">Dashboard</div>
                        <button class="nav-item active" onclick="showDashboard()">
                            <span class="nav-icon">📊</span>
                            Overview
                        </button>
                        <button class="nav-item" onclick="showAnalyticsModal()">
                            <span class="nav-icon">📈</span>
                            Analytics
                        </button>
                        <button class="nav-item" onclick="showReportsModal()">
                            <span class="nav-icon">📋</span>
                            Reports
                        </button>
                        <button class="nav-item" onclick="showPerformanceModal()">
                            <span class="nav-icon">🎯</span>
                            Performance
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Case Management</div>
                        <button class="nav-item" onclick="showCreateCaseModal()">
                            <span class="nav-icon">➕</span>
                            Create Case
                        </button>
                        <button class="nav-item" onclick="showAllCasesModal()">
                            <span class="nav-icon">📋</span>
                            All Cases
                        </button>
                        <button class="nav-item" onclick="showEscalationsModal()">
                            <span class="nav-icon">⚡</span>
                            Escalations
                        </button>
                        <button class="nav-item" onclick="showCaseStatusModal()">
                            <span class="nav-icon">📊</span>
                            Case Status
                        </button>
                        <button class="nav-item" onclick="showAssignmentModal()">
                            <span class="nav-icon">👤</span>
                            Assignments
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Customer Support</div>
                        <button class="nav-item" onclick="showCustomersModal()">
                            <span class="nav-icon">👥</span>
                            Customers
                        </button>
                        <button class="nav-item" onclick="showContactHistoryModal()">
                            <span class="nav-icon">📞</span>
                            Contact History
                        </button>
                        <button class="nav-item" onclick="showFeedbackModal()">
                            <span class="nav-icon">⭐</span>
                            Feedback
                        </button>
                        <button class="nav-item" onclick="showSatisfactionModal()">
                            <span class="nav-icon">😊</span>
                            Satisfaction
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Knowledge & Resources</div>
                        <button class="nav-item" onclick="showKnowledgeBaseModal()">
                            <span class="nav-icon">📚</span>
                            Knowledge Base
                        </button>
                        <button class="nav-item" onclick="showFAQModal()">
                            <span class="nav-icon">❓</span>
                            FAQ Management
                        </button>
                        <button class="nav-item" onclick="showDocumentsModal()">
                            <span class="nav-icon">📄</span>
                            Documents
                        </button>
                        <button class="nav-item" onclick="showTemplatesModal()">
                            <span class="nav-icon">📝</span>
                            Templates
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Team & Workflow</div>
                        <button class="nav-item" onclick="showTeamModal()">
                            <span class="nav-icon">👥</span>
                            Team Management
                        </button>
                        <button class="nav-item" onclick="showSkillsModal()">
                            <span class="nav-icon">🎓</span>
                            Skills & Training
                        </button>
                        <button class="nav-item" onclick="showWorkflowModal()">
                            <span class="nav-icon">⚙️</span>
                            Workflow Rules
                        </button>
                        <button class="nav-item" onclick="showAutomationModal()">
                            <span class="nav-icon">🤖</span>
                            Automation
                        </button>
                        <button class="nav-item" onclick="showSchedulingModal()">
                            <span class="nav-icon">📅</span>
                            Scheduling
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Quality & Compliance</div>
                        <button class="nav-item" onclick="showSLAModal()">
                            <span class="nav-icon">⏱️</span>
                            SLA Tracking
                        </button>
                        <button class="nav-item" onclick="showQualityModal()">
                            <span class="nav-icon">✅</span>
                            Quality Assurance
                        </button>
                        <button class="nav-item" onclick="showComplianceModal()">
                            <span class="nav-icon">🔒</span>
                            Compliance
                        </button>
                        <button class="nav-item" onclick="showAuditModal()">
                            <span class="nav-icon">📊</span>
                            Audit Trails
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Communication</div>
                        <button class="nav-item" onclick="showEmailModal()">
                            <span class="nav-icon">📧</span>
                            Email Integration
                        </button>
                        <button class="nav-item" onclick="showChatModal()">
                            <span class="nav-icon">💬</span>
                            Live Chat
                        </button>
                        <button class="nav-item" onclick="showSocialModal()">
                            <span class="nav-icon">📱</span>
                            Social Media
                        </button>
                        <button class="nav-item" onclick="showNotificationsModal()">
                            <span class="nav-icon">🔔</span>
                            Notifications
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Administration</div>
                        <button class="nav-item" onclick="showUserManagementModal()">
                            <span class="nav-icon">👤</span>
                            User Management
                        </button>
                        <button class="nav-item" onclick="showPermissionsModal()">
                            <span class="nav-icon">🔐</span>
                            Permissions
                        </button>
                        <button class="nav-item" onclick="showSystemConfigModal()">
                            <span class="nav-icon">⚙️</span>
                            System Config
                        </button>
                        <button class="nav-item" onclick="showIntegrationsModal()">
                            <span class="nav-icon">🔗</span>
                            Integrations
                        </button>
                        <button class="nav-item" onclick="showBackupModal()">
                            <span class="nav-icon">💾</span>
                            Backup & Security
                        </button>
                    </div>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Top Header -->
                <header class="top-header">
                    <h1 class="page-title" id="pageTitle">Dashboard Overview</h1>
                    <div class="header-actions">
                        <div class="user-info">
                            <span class="user-name" id="welcomeText">Admin User</span>
                            <button class="btn btn-secondary" id="logoutBtn">Sign Out</button>
                        </div>
                    </div>
                </header>

                <!-- Content Area -->
                <div class="content-area">
                    <!-- Dashboard Content -->
                    <div id="dashboardContent">
                        <!-- Stats Cards -->
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Total Cases</div>
                                    <div class="stat-icon" style="background-color: #eff6ff; color: #2563eb;">📊</div>
                                </div>
                                <div class="stat-value" id="totalCases">25</div>
                                <div class="stat-change positive">↗ 12% increase</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Open Cases</div>
                                    <div class="stat-icon" style="background-color: #fef3c7; color: #d97706;">⏳</div>
                                </div>
                                <div class="stat-value" id="openCases">8</div>
                                <div class="stat-change neutral">3 new today</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Resolved</div>
                                    <div class="stat-icon" style="background-color: #dcfce7; color: #16a34a;">✅</div>
                                </div>
                                <div class="stat-value" id="resolvedCases">17</div>
                                <div class="stat-change positive">↗ 5 this week</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Success Rate</div>
                                    <div class="stat-icon" style="background-color: #f0f9ff; color: #0284c7;">🎯</div>
                                </div>
                                <div class="stat-value" id="resolutionRate">68%</div>
                                <div class="stat-change positive">↗ +2% this month</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">SLA Compliance</div>
                                    <div class="stat-icon" style="background-color: #f0fdf4; color: #16a34a;">⚡</div>
                                </div>
                                <div class="stat-value" id="slaCompliance">85%</div>
                                <div class="stat-change positive">↗ +3% this week</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Avg Response Time</div>
                                    <div class="stat-icon" style="background-color: #fdf2f8; color: #ec4899;">⏱️</div>
                                </div>
                                <div class="stat-value" id="avgResponseTime">2.5h</div>
                                <div class="stat-change positive">↗ -0.3h improved</div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-header">
                                    <div class="stat-title">Customer Satisfaction</div>
                                    <div class="stat-icon" style="background-color: #fffbeb; color: #d97706;">⭐</div>
                                </div>
                                <div class="stat-value" id="customerSatisfaction">4.2/5</div>
                                <div class="stat-change positive">↗ +0.1 this month</div>
                            </div>
                            
                            <div class="stat-card analytics-card" onclick="showAdvancedAnalyticsModal()" style="cursor: pointer;">
                                <div class="stat-header">
                                    <div class="stat-title">Advanced Analytics</div>
                                    <div class="stat-icon" style="background-color: #f0f4ff; color: #667eea;">📊</div>
                                </div>
                                <div class="stat-value">View Charts</div>
                                <div class="stat-change">📈 Interactive reports & trends</div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="actions-section">
                            <div class="section-header">
                                <h2 class="section-title">Quick Actions</h2>
                            </div>
                            <div class="actions-grid">
                                <button class="action-card" onclick="showCreateCaseModal()">
                                    <span class="action-icon">➕</span>
                                    <div class="action-title">Create New Case</div>
                                </button>
                                
                                <button class="action-card" onclick="showNotification('Case search coming soon', 'info')">
                                    <span class="action-icon">🔍</span>
                                    <div class="action-title">Search Cases</div>
                                </button>
                                
                                <button class="action-card" onclick="showEscalationsModal()">
                                    <span class="action-icon">⚡</span>
                                    <div class="action-title">View Escalations</div>
                                </button>
                                
                                <button class="action-card" onclick="showSLAModal()">
                                    <span class="action-icon">⏱️</span>
                                    <div class="action-title">SLA Dashboard</div>
                                </button>
                                
                                <button class="action-card" onclick="showNotification('Reports coming soon', 'info')">
                                    <span class="action-icon">📊</span>
                                    <div class="action-title">Generate Report</div>
                                </button>
                                
                                <button class="action-card" onclick="showNotification('Settings coming soon', 'info')">
                                    <span class="action-icon">⚙️</span>
                                    <div class="action-title">Settings</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        let currentUser = null;

        // Initialize app when DOM loads
        document.addEventListener('DOMContentLoaded', function() {
            // Check for existing demo session
            const token = localStorage.getItem('token');
            if (token && token.startsWith('demo-token-')) {
                currentUser = {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin'
                };
                showMainApp();
                loadStats();
            }

            // Login form handler
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const loginBtn = document.getElementById('loginBtn');
                    
                    if (loginBtn) {
                        loginBtn.textContent = 'Signing in...';
                        loginBtn.disabled = true;
                    }

                    setTimeout(() => {
                        if (email === 'admin@example.com' && password === 'admin123') {
                            currentUser = {
                                id: 1,
                                name: 'Admin User',
                                email: 'admin@example.com',
                                role: 'admin'
                            };
                            localStorage.setItem('token', 'demo-token-' + Date.now());
                            showMainApp();
                            loadStats();
                            showNotification('Welcome back!', 'success');
                        } else {
                            showNotification('Invalid credentials. Use admin@example.com / admin123', 'error');
                            if (loginBtn) {
                                loginBtn.textContent = 'Sign In';
                                loginBtn.disabled = false;
                            }
                        }
                    }, 1000);
                });
            }

            // Logout handler
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('token');
                    currentUser = null;
                    showLogin();
                });
            }
        });


        // Show/hide pages
        function showLogin() {
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
        }

        function showMainApp() {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            if (currentUser) {
                document.getElementById('welcomeText').textContent = currentUser.name;
            }
        }

        function showDashboard() {
            document.getElementById('pageTitle').textContent = 'Dashboard Overview';
            document.getElementById('dashboardContent').classList.remove('hidden');
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');
        }

        // Load dashboard stats
        async function loadStats() {
            try {
                const response = await fetch('/api/analytics/dashboard');
                const data = await response.json();
                const stats = data.overview;
                
                document.getElementById('totalCases').textContent = stats.totalCases;
                document.getElementById('openCases').textContent = stats.openCases;
                document.getElementById('resolvedCases').textContent = stats.resolvedCases;
                document.getElementById('resolutionRate').textContent = stats.resolutionRate + '%';
                
                // Update new KPI cards
                document.getElementById('slaCompliance').textContent = stats.slaCompliance + '%';
                document.getElementById('avgResponseTime').textContent = stats.avgResponseTime + 'h';
                document.getElementById('customerSatisfaction').textContent = stats.customerSatisfaction + '/5';
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        }

        // Modal functions
        function showCreateCaseModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedCreateCaseHTML();
            document.body.appendChild(modal);
            initializeAdvancedCreateCase();
        }

        function generateAdvancedCreateCaseHTML() {
            return '<div class="modal-content" style="max-width: 1000px; width: 90vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">🎯 Advanced Case Creation</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; font-size: 24px;">&times;</button>' +
                '</div>' +
                '<div class="create-case-tabs" style="background: #f8fafc; border-bottom: 1px solid #e5e7eb;">' +
                '<div class="tab-nav" style="display: flex; gap: 0; padding: 0 20px;">' +
                '<button class="case-tab-btn active" onclick="showCaseTab(&quot;quick&quot;)" data-tab="quick">⚡ Quick Create</button>' +
                '<button class="case-tab-btn" onclick="showCaseTab(&quot;detailed&quot;)" data-tab="detailed">📋 Detailed Form</button>' +
                '<button class="case-tab-btn" onclick="showCaseTab(&quot;templates&quot;)" data-tab="templates">📄 Templates</button>' +
                '<button class="case-tab-btn" onclick="showCaseTab(&quot;bulk&quot;)" data-tab="bulk">📦 Bulk Import</button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-body" style="padding: 24px;" id="createCaseContent">' +
                generateQuickCreateHTML() +
                '</div>' +
                '</div>';
        }

        function initializeAdvancedCreateCase() {
            addCreateCaseCSS();
        }

        function addCreateCaseCSS() {
            const style = document.createElement('style');
            style.textContent = 
                '.case-tab-btn { padding: 12px 20px; border: none; background: none; color: #6b7280; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }' +
                '.case-tab-btn.active { color: #10b981; border-bottom-color: #10b981; }' +
                '.case-tab-btn:hover { color: #059669; }' +
                '.priority-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }' +
                '.priority-option { padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; cursor: pointer; transition: all 0.2s; }' +
                '.priority-option:hover { border-color: #10b981; }' +
                '.priority-option.selected { border-color: #10b981; background: #f0fdf4; }' +
                '.smart-suggestions { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-top: 16px; }' +
                '.template-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; }' +
                '.template-card:hover { border-color: #10b981; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1); }';
            document.head.appendChild(style);
        }

        function generateQuickCreateHTML() {
            return '<div class="case-tab-content active" id="quickTab">' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">' +
                '<div class="main-form">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚡ Quick Case Creation</h3>' +
                '<div class="form-group" style="margin-bottom: 20px;">' +
                '<label class="form-label">Customer Email *</label>' +
                '<div style="position: relative;">' +
                '<input type="email" class="form-input" id="customerEmailQuick" placeholder="customer@example.com" onkeyup="suggestCustomers(this.value)" required>' +
                '<div id="customerSuggestions" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e7eb; border-top: none; max-height: 150px; overflow-y: auto; z-index: 1000;"></div>' +
                '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom: 20px;">' +
                '<label class="form-label">Case Subject *</label>' +
                '<input type="text" class="form-input" id="caseSubjectQuick" placeholder="Brief description of the issue" onkeyup="generateSmartSuggestions(this.value)" required>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom: 20px;">' +
                '<label class="form-label">Priority Level</label>' +
                '<div class="priority-selector">' +
                '<div class="priority-option" onclick="selectQuickPriority(&quot;low&quot;)" data-priority="low">' +
                '<div style="font-size: 20px; margin-bottom: 4px;">🟢</div>' +
                '<div style="font-size: 12px; font-weight: 600;">Low</div>' +
                '<div style="font-size: 10px; color: #6b7280;">24h response</div>' +
                '</div>' +
                '<div class="priority-option" onclick="selectQuickPriority(&quot;medium&quot;)" data-priority="medium">' +
                '<div style="font-size: 20px; margin-bottom: 4px;">🟡</div>' +
                '<div style="font-size: 12px; font-weight: 600;">Medium</div>' +
                '<div style="font-size: 10px; color: #6b7280;">8h response</div>' +
                '</div>' +
                '<div class="priority-option selected" onclick="selectQuickPriority(&quot;high&quot;)" data-priority="high">' +
                '<div style="font-size: 20px; margin-bottom: 4px;">🟠</div>' +
                '<div style="font-size: 12px; font-weight: 600;">High</div>' +
                '<div style="font-size: 10px; color: #6b7280;">2h response</div>' +
                '</div>' +
                '<div class="priority-option" onclick="selectQuickPriority(&quot;critical&quot;)" data-priority="critical">' +
                '<div style="font-size: 20px; margin-bottom: 4px;">🔴</div>' +
                '<div style="font-size: 12px; font-weight: 600;">Critical</div>' +
                '<div style="font-size: 10px; color: #6b7280;">1h response</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-bottom: 20px;">' +
                '<label class="form-label">Issue Description *</label>' +
                '<textarea class="form-input" id="caseDescriptionQuick" rows="6" placeholder="Describe the issue in detail..." required></textarea>' +
                '</div>' +
                '<div id="smartSuggestions"></div>' +
                '<div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">' +
                '<button type="button" class="btn btn-secondary" onclick="this.closest(&quot;.modal&quot;).remove()">Cancel</button>' +
                '<button type="button" class="btn btn-success" onclick="createQuickCase(this)">🚀 Create Case</button>' +
                '</div>' +
                '</div>' +
                '<div class="sidebar-info">' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 20px;">' +
                '<h4 style="color: #10b981; margin-bottom: 16px; display: flex; align-items: center;"><span style="margin-right: 8px;">🤖</span>AI Assistant</h4>' +
                '<div style="color: #6b7280; font-size: 14px; line-height: 1.5;">Start typing your issue description and I&apos;ll suggest similar cases, solutions, and automatic categorization.</div>' +
                '</div>' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px;">' +
                '<h4 style="color: #374151; margin-bottom: 16px;">📊 Quick Stats</h4>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Cases Today</span>' +
                '<span style="font-weight: 600;">23</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Avg Response</span>' +
                '<span style="font-weight: 600;">1.2h</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between;">' +
                '<span style="color: #6b7280; font-size: 14px;">Resolution Rate</span>' +
                '<span style="font-weight: 600; color: #10b981;">94%</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Advanced Create Case Functions
        function showCaseTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.case-tab-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
            
            // Generate content based on tab
            const content = document.getElementById('createCaseContent');
            switch(tabName) {
                case 'quick':
                    content.innerHTML = generateQuickCreateHTML();
                    break;
                case 'detailed':
                    content.innerHTML = generateDetailedCreateHTML();
                    break;
                case 'templates':
                    content.innerHTML = generateTemplatesHTML();
                    break;
                case 'bulk':
                    content.innerHTML = generateBulkImportHTML();
                    break;
            }
        }

        function generateDetailedCreateHTML() {
            return '<div class="case-tab-content" id="detailedTab">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📋 Detailed Case Form</h3>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">' +
                '<div class="form-group">' +
                '<label class="form-label">Customer Information *</label>' +
                '<input type="email" class="form-input" placeholder="customer@example.com" required>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Customer Name</label>' +
                '<input type="text" class="form-input" placeholder="John Smith">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Company</label>' +
                '<input type="text" class="form-input" placeholder="Acme Corp">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Phone Number</label>' +
                '<input type="tel" class="form-input" placeholder="+1 (555) 123-4567">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Case Subject *</label>' +
                '<input type="text" class="form-input" placeholder="Brief description" required>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Category</label>' +
                '<select class="form-input">' +
                '<option>Technical Support</option>' +
                '<option>Billing</option>' +
                '<option>Account Management</option>' +
                '<option>Feature Request</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Product/Service</label>' +
                '<select class="form-input">' +
                '<option>Software Platform</option>' +
                '<option>Mobile App</option>' +
                '<option>API Service</option>' +
                '<option>Premium Support</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label">Source Channel</label>' +
                '<select class="form-input">' +
                '<option>Email</option>' +
                '<option>Phone</option>' +
                '<option>Chat</option>' +
                '<option>Web Portal</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group" style="margin-top: 20px;">' +
                '<label class="form-label">Detailed Description *</label>' +
                '<textarea class="form-input" rows="6" placeholder="Provide comprehensive details..." required></textarea>' +
                '</div>' +
                '<div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">' +
                '<button type="button" class="btn btn-secondary" onclick="this.closest(&quot;.modal&quot;).remove()">Cancel</button>' +
                '<button type="button" class="btn btn-primary" onclick="createDetailedCase(this)">Create Detailed Case</button>' +
                '</div>' +
                '</div>';
        }

        function generateTemplatesHTML() {
            return '<div class="case-tab-content" id="templatesTab">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📄 Case Templates</h3>' +
                '<div class="templates-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">' +
                '<div class="template-card" onclick="useTemplate(&quot;system-outage&quot;)">' +
                '<h4 style="color: #dc2626; margin-bottom: 8px;">🔴 System Outage</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Complete service unavailability affecting multiple users</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '<div class="template-card" onclick="useTemplate(&quot;login-issue&quot;)">' +
                '<h4 style="color: #d97706; margin-bottom: 8px;">🔑 Login Problems</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">User authentication and access issues</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '<div class="template-card" onclick="useTemplate(&quot;billing-error&quot;)">' +
                '<h4 style="color: #2563eb; margin-bottom: 8px;">💰 Billing Error</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Payment processing and invoice issues</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '<div class="template-card" onclick="useTemplate(&quot;feature-request&quot;)">' +
                '<h4 style="color: #7c3aed; margin-bottom: 8px;">💡 Feature Request</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">New functionality suggestions and enhancements</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '<div class="template-card" onclick="useTemplate(&quot;performance&quot;)">' +
                '<h4 style="color: #ea580c; margin-bottom: 8px;">⚡ Performance Issue</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Slow response times and system performance</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '<div class="template-card" onclick="useTemplate(&quot;data-issue&quot;)">' +
                '<h4 style="color: #059669; margin-bottom: 8px;">📊 Data Problem</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Missing, incorrect, or corrupted data</p>' +
                '<div style="font-size: 12px; color: #059669;">Click to use template</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateBulkImportHTML() {
            return '<div class="case-tab-content" id="bulkTab">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📦 Bulk Case Import</h3>' +
                '<div class="bulk-import-area" style="border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center; margin-bottom: 24px;">' +
                '<div style="font-size: 48px; margin-bottom: 16px;">📄</div>' +
                '<h4 style="color: #374151; margin-bottom: 12px;">Drag & Drop CSV File</h4>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Upload a CSV file with multiple cases to import in bulk</p>' +
                '<button class="btn btn-outline" onclick="selectBulkFile()">Select File</button>' +
                '</div>' +
                '<div class="csv-format" style="background: #f9fafb; border-radius: 8px; padding: 20px;">' +
                '<h4 style="color: #374151; margin-bottom: 12px;">CSV Format Requirements</h4>' +
                '<div style="font-family: monospace; font-size: 14px; color: #6b7280; margin-bottom: 12px;">customer_email,subject,description,priority,category</div>' +
                '<ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">' +
                '<li>customer_email: Valid email address</li>' +
                '<li>subject: Brief case description</li>' +
                '<li>description: Detailed issue information</li>' +
                '<li>priority: low, medium, high, or critical</li>' +
                '<li>category: technical, billing, general, etc.</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
        }

        function selectQuickPriority(priority) {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('[data-priority="' + priority + '"]').classList.add('selected');
            showNotification('Priority set to: ' + priority, 'success');
        }

        function suggestCustomers(email) {
            const suggestions = document.getElementById('customerSuggestions');
            if (email.length > 2 && suggestions) {
                suggestions.innerHTML = 
                    '<div style="padding: 8px; cursor: pointer; border-bottom: 1px solid #f3f4f6;" onclick="selectCustomer(&quot;john@example.com&quot;, &quot;John Smith&quot;)">' +
                    '<strong>John Smith</strong><br>' +
                    '<small style="color: #6b7280;">john@example.com • Premium</small>' +
                    '</div>' +
                    '<div style="padding: 8px; cursor: pointer;" onclick="selectCustomer(&quot;mary@company.com&quot;, &quot;Mary Johnson&quot;)">' +
                    '<strong>Mary Johnson</strong><br>' +
                    '<small style="color: #6b7280;">mary@company.com • Enterprise</small>' +
                    '</div>';
            } else if (suggestions) {
                suggestions.innerHTML = '';
            }
        }

        function selectCustomer(email, name) {
            document.getElementById('customerEmailQuick').value = email;
            document.getElementById('customerSuggestions').innerHTML = '';
            showNotification('Customer selected: ' + name, 'success');
        }

        function generateSmartSuggestions(subject) {
            const suggestions = document.getElementById('smartSuggestions');
            if (subject.length > 10 && suggestions) {
                suggestions.innerHTML = 
                    '<div class="smart-suggestions">' +
                    '<h4 style="color: #0369a1; margin-bottom: 12px;">🤖 AI Suggestions</h4>' +
                    '<div style="margin-bottom: 8px;"><strong>Suggested Category:</strong> Technical Support</div>' +
                    '<div style="margin-bottom: 8px;"><strong>Similar Cases:</strong> 3 found with 85% resolution rate</div>' +
                    '<div><strong>Recommended Agent:</strong> Sarah Johnson (Technical Team)</div>' +
                    '</div>';
            } else if (suggestions) {
                suggestions.innerHTML = '';
            }
        }

        function createQuickCase(button) {
            button.textContent = 'Creating...';
            button.disabled = true;
            
            setTimeout(() => {
                button.closest('.modal').remove();
                showNotification('🎉 Case created successfully with ID: CASE-' + Date.now().toString().slice(-6), 'success');
                loadStats();
            }, 1500);
        }

        function createDetailedCase(button) {
            button.textContent = 'Creating Detailed Case...';
            button.disabled = true;
            
            setTimeout(() => {
                button.closest('.modal').remove();
                showNotification('🎉 Detailed case created with full customer profile!', 'success');
                loadStats();
            }, 2000);
        }

        function useTemplate(templateType) {
            showNotification('📄 Template "' + templateType + '" loaded into Quick Create', 'success');
            showCaseTab('quick');
        }

        function selectBulkFile() {
            showNotification('📦 File selection would open here - bulk import functionality', 'info');
        }

        function createCase(button) {
            button.textContent = 'Creating...';
            button.disabled = true;
            
            setTimeout(() => {
                button.closest('.modal').remove();
                showNotification('Case created successfully!', 'success');
                loadStats();
            }, 1000);
        }

        function showAdvancedAnalyticsModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedAnalyticsHTML();
            document.body.appendChild(modal);
            loadAnalyticsData();
        }

        function generateAdvancedAnalyticsHTML() {
            return '<div class="modal-content" style="max-width: 1200px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">📊 Advanced Analytics & Reports</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; font-size: 24px;">&times;</button>' +
                '</div>' +
                '<div class="analytics-tabs" style="background: #f8fafc; border-bottom: 1px solid #e5e7eb;">' +
                '<div class="tab-nav" style="display: flex; gap: 0; padding: 0 20px;">' +
                '<button class="analytics-tab-btn active" onclick="showAnalyticsTab(&quot;overview&quot;)" data-tab="overview">📈 Overview</button>' +
                '<button class="analytics-tab-btn" onclick="showAnalyticsTab(&quot;trends&quot;)" data-tab="trends">📊 Trends</button>' +
                '<button class="analytics-tab-btn" onclick="showAnalyticsTab(&quot;performance&quot;)" data-tab="performance">⚡ Performance</button>' +
                '<button class="analytics-tab-btn" onclick="showAnalyticsTab(&quot;reports&quot;)" data-tab="reports">📋 Reports</button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-body" style="padding: 24px;" id="analyticsContent">' +
                generateAnalyticsOverviewHTML() +
                '</div>' +
                '</div>';
        }

        function generateAnalyticsOverviewHTML() {
            return '<div class="analytics-tab-content active" id="overviewTab">' +
                '<div class="analytics-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">' +
                '<div class="chart-container" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">' +
                '<h3 style="margin-bottom: 20px; color: #1f2937;">📊 Case Volume Trends</h3>' +
                '<div id="caseVolumeChart" style="height: 300px; display: flex; align-items: end; justify-content: space-around; border-left: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; position: relative;">' +
                '<div class="chart-bar" style="width: 30px; height: 80%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Mon</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 60%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Tue</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 90%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Wed</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 70%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Thu</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 100%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Fri</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 50%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Sat</span></div>' +
                '<div class="chart-bar" style="width: 30px; height: 30%; background: linear-gradient(to top, #3b82f6, #60a5fa); margin: 0 8px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative;"><span style="position: absolute; bottom: -25px; font-size: 12px; color: #6b7280;">Sun</span></div>' +
                '</div>' +
                '</div>' +
                '<div class="chart-container" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">' +
                '<h3 style="margin-bottom: 20px; color: #1f2937;">🎯 Priority Distribution</h3>' +
                '<div id="priorityChart" style="height: 300px; display: flex; align-items: center; justify-content: center; position: relative;">' +
                '<div style="width: 200px; height: 200px; border-radius: 50%; position: relative; background: conic-gradient(#ef4444 0deg 43.2deg, #f59e0b 43.2deg 93.6deg, #22c55e 93.6deg 187.2deg, #6366f1 187.2deg 360deg);">' +
                '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1f2937;">25 Total</div>' +
                '</div>' +
                '<div style="margin-left: 30px;">' +
                '<div style="margin-bottom: 10px; display: flex; align-items: center;"><div style="width: 16px; height: 16px; background: #ef4444; border-radius: 2px; margin-right: 8px;"></div><span style="color: #374151;">Critical (3)</span></div>' +
                '<div style="margin-bottom: 10px; display: flex; align-items: center;"><div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 2px; margin-right: 8px;"></div><span style="color: #374151;">High (7)</span></div>' +
                '<div style="margin-bottom: 10px; display: flex; align-items: center;"><div style="width: 16px; height: 16px; background: #22c55e; border-radius: 2px; margin-right: 8px;"></div><span style="color: #374151;">Medium (12)</span></div>' +
                '<div style="margin-bottom: 10px; display: flex; align-items: center;"><div style="width: 16px; height: 16px; background: #6366f1; border-radius: 2px; margin-right: 8px;"></div><span style="color: #374151;">Low (8)</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="analytics-summary" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">' +
                '<h3 style="margin-bottom: 20px; color: #1f2937;">📋 Key Performance Indicators</h3>' +
                '<div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">' +
                '<div class="kpi-item" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="font-size: 32px; font-weight: 700; color: #059669;">2.5h</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Avg Response Time</div>' +
                '</div>' +
                '<div class="kpi-item" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="font-size: 32px; font-weight: 700; color: #dc2626;">4</div>' +
                '<div style="color: #6b7280; font-size: 14px;">SLA Breaches</div>' +
                '</div>' +
                '<div class="kpi-item" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="font-size: 32px; font-weight: 700; color: #2563eb;">4.2/5</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Customer Rating</div>' +
                '</div>' +
                '<div class="kpi-item" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="font-size: 32px; font-weight: 700; color: #7c3aed;">85%</div>' +
                '<div style="color: #6b7280; font-size: 14px;">SLA Compliance</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showAnalyticsTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.analytics-tab-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.analytics-tab-content').forEach(content => content.classList.remove('active'));
            
            const content = document.getElementById('analyticsContent');
            switch(tabName) {
                case 'overview':
                    content.innerHTML = generateAnalyticsOverviewHTML();
                    break;
                case 'trends':
                    content.innerHTML = '<div class="analytics-tab-content active"><h3>📊 Trends Analysis</h3><p>Detailed trends analysis coming soon...</p></div>';
                    break;
                case 'performance':
                    content.innerHTML = '<div class="analytics-tab-content active"><h3>⚡ Performance Metrics</h3><p>Agent and team performance metrics coming soon...</p></div>';
                    break;
                case 'reports':
                    content.innerHTML = '<div class="analytics-tab-content active"><h3>📋 Custom Reports</h3><p>Report generation tools coming soon...</p></div>';
                    break;
            }
        }

        function loadAnalyticsData() {
            // Update the additional KPI values on the dashboard
            document.getElementById('slaCompliance').textContent = mockStats.overview.slaCompliance + '%';
            document.getElementById('avgResponseTime').textContent = mockStats.overview.avgResponseTime + 'h';
            document.getElementById('customerSatisfaction').textContent = mockStats.overview.customerSatisfaction + '/5';
        }

        function showEscalationsModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Case Escalations</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="margin-bottom: 24px;">' +
                '<h3 style="color: #dc2626; margin-bottom: 16px;">High Priority Escalations</h3>' +
                '<div style="border: 1px solid #fecaca; background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="color: #dc2626; margin: 0;">System Outage - Case #2024-001</h4>' +
                '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">CRITICAL</span>' +
                '</div>' +
                '<p style="margin-bottom: 8px;">Multiple customers reporting complete service unavailability</p>' +
                '<p style="font-size: 14px; color: #64748b;">Escalated 2 hours ago • Assigned to: Technical Team</p>' +
                '</div>' +
                '<div style="border: 1px solid #fed7aa; background: #fff7ed; padding: 20px; border-radius: 8px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="color: #ea580c; margin: 0;">Payment Processing - Case #2024-002</h4>' +
                '<span style="background: #ea580c; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">HIGH</span>' +
                '</div>' +
                '<p style="margin-bottom: 8px;">Customer unable to process payment for premium subscription</p>' +
                '<p style="font-size: 14px; color: #64748b;">Escalated 45 minutes ago • Assigned to: Billing Team</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showSLAModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="max-width: 1200px; width: 95vw;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">🎯 Advanced SLA Management System</h2>' +
                '<div style="display: flex; gap: 10px;">' +
                '<button class="btn btn-primary" onclick="showSLAConfiguration()">⚙️ Configure SLA</button>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-body">' +
                
                '<!-- SLA Overview Dashboard -->' +
                '<div class="sla-overview" style="margin-bottom: 30px;">' +
                '<h3 style="display: flex; align-items: center; margin-bottom: 20px;"><span style="margin-right: 8px;">📊</span>Real-time SLA Health Dashboard</h3>' +
                '<div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">' +
                
                '<div class="stat-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">' +
                '<div class="stat-header">' +
                '<div class="stat-title">On Track</div>' +
                '<div class="stat-icon" style="background: rgba(255,255,255,0.2);">✅</div>' +
                '</div>' +
                '<div class="stat-value">18</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">↗ +15% this week</div>' +
                '</div>' +
                
                '<div class="stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">' +
                '<div class="stat-header">' +
                '<div class="stat-title">At Risk (75%+)</div>' +
                '<div class="stat-icon" style="background: rgba(255,255,255,0.2);">⚠️</div>' +
                '</div>' +
                '<div class="stat-value">5</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">2 escalating soon</div>' +
                '</div>' +
                
                '<div class="stat-card" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white;">' +
                '<div class="stat-header">' +
                '<div class="stat-title">Breached</div>' +
                '<div class="stat-icon" style="background: rgba(255,255,255,0.2);">❌</div>' +
                '</div>' +
                '<div class="stat-value">2</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">↓ -50% improvement</div>' +
                '</div>' +
                
                '<div class="stat-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">' +
                '<div class="stat-header">' +
                '<div class="stat-title">Avg Response</div>' +
                '<div class="stat-icon" style="background: rgba(255,255,255,0.2);">⏱️</div>' +
                '</div>' +
                '<div class="stat-value">2.3h</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">Target: 4h</div>' +
                '</div>' +
                
                '<div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white;">' +
                '<div class="stat-header">' +
                '<div class="stat-title">SLA Compliance</div>' +
                '<div class="stat-icon" style="background: rgba(255,255,255,0.2);">📈</div>' +
                '</div>' +
                '<div class="stat-value">92%</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">Target: 95%</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Performance Chart -->' +
                '<div class="sla-chart-section" style="margin-bottom: 30px;">' +
                '<h3 style="display: flex; align-items: center; margin-bottom: 15px;"><span style="margin-right: 8px;">📈</span>SLA Performance Trends (Last 30 Days)</h3>' +
                '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; min-height: 200px; display: flex; align-items: center; justify-content: center;">' +
                '<div>' +
                '<div style="font-size: 48px; margin-bottom: 10px;">📊</div>' +
                '<p style="color: #64748b; margin-bottom: 15px;">Interactive SLA Performance Chart</p>' +
                '<div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">' +
                '<div style="padding: 10px; background: white; border-radius: 6px; border: 2px solid #10b981;"><strong>Mon:</strong> 95%</div>' +
                '<div style="padding: 10px; background: white; border-radius: 6px; border: 2px solid #f59e0b;"><strong>Tue:</strong> 88%</div>' +
                '<div style="padding: 10px; background: white; border-radius: 6px; border: 2px solid #10b981;"><strong>Wed:</strong> 96%</div>' +
                '<div style="padding: 10px; background: white; border-radius: 6px; border: 2px solid #10b981;"><strong>Thu:</strong> 94%</div>' +
                '<div style="padding: 10px; background: white; border-radius: 6px; border: 2px solid #ef4444;"><strong>Fri:</strong> 82%</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Priority-based SLA Targets -->' +
                '<div class="sla-targets-section" style="margin-bottom: 30px;">' +
                '<h3 style="display: flex; align-items: center; margin-bottom: 15px;"><span style="margin-right: 8px;">🎯</span>SLA Targets by Priority</h3>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">' +
                
                '<div style="border: 2px solid #dc2626; border-radius: 8px; padding: 16px; background: #fef2f2;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="width: 12px; height: 12px; background: #dc2626; border-radius: 50%; margin-right: 8px;"></span><strong>Critical Priority</strong></div>' +
                '<div style="font-size: 14px; color: #7f1d1d;">Response: 1 hour | Resolution: 4 hours</div>' +
                '<div style="margin-top: 8px; background: #dc2626; height: 4px; border-radius: 2px; width: 95%;"></div>' +
                '<div style="font-size: 12px; color: #991b1b; margin-top: 4px;">Compliance: 95%</div>' +
                '</div>' +
                
                '<div style="border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; background: #fffbeb;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></span><strong>High Priority</strong></div>' +
                '<div style="font-size: 14px; color: #92400e;">Response: 4 hours | Resolution: 24 hours</div>' +
                '<div style="margin-top: 8px; background: #f59e0b; height: 4px; border-radius: 2px; width: 88%;"></div>' +
                '<div style="font-size: 12px; color: #b45309; margin-top: 4px;">Compliance: 88%</div>' +
                '</div>' +
                
                '<div style="border: 2px solid #3b82f6; border-radius: 8px; padding: 16px; background: #eff6ff;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; margin-right: 8px;"></span><strong>Medium Priority</strong></div>' +
                '<div style="font-size: 14px; color: #1e40af;">Response: 24 hours | Resolution: 72 hours</div>' +
                '<div style="margin-top: 8px; background: #3b82f6; height: 4px; border-radius: 2px; width: 92%;"></div>' +
                '<div style="font-size: 12px; color: #1d4ed8; margin-top: 4px;">Compliance: 92%</div>' +
                '</div>' +
                
                '<div style="border: 2px solid #10b981; border-radius: 8px; padding: 16px; background: #ecfdf5;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span><strong>Low Priority</strong></div>' +
                '<div style="font-size: 14px; color: #047857;">Response: 72 hours | Resolution: 168 hours</div>' +
                '<div style="margin-top: 8px; background: #10b981; height: 4px; border-radius: 2px; width: 98%;"></div>' +
                '<div style="font-size: 12px; color: #065f46; margin-top: 4px;">Compliance: 98%</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Real-time SLA Alerts -->' +
                '<div class="sla-alerts-section" style="margin-bottom: 30px;">' +
                '<h3 style="display: flex; align-items: center; margin-bottom: 15px;"><span style="margin-right: 8px;">🔔</span>Real-time SLA Alerts & Escalations</h3>' +
                '<div style="display: flex; flex-direction: column; gap: 12px;">' +
                
                '<div style="display: flex; align-items: center; padding: 12px; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px;">' +
                '<span style="font-size: 20px; margin-right: 12px;">🚨</span>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 500; color: #991b1b;">URGENT: Case #2024-005 SLA Breach Imminent</div>' +
                '<div style="font-size: 14px; color: #7f1d1d;">Critical ticket will breach SLA in 23 minutes • Auto-escalated to Manager</div>' +
                '</div>' +
                '<button style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px;">View Case</button>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 12px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px;">' +
                '<span style="font-size: 20px; margin-right: 12px;">⚠️</span>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 500; color: #92400e;">WARNING: 3 Cases Approaching 75% SLA Threshold</div>' +
                '<div style="font-size: 14px; color: #b45309;">Cases #2024-007, #2024-009, #2024-011 need attention within 2 hours</div>' +
                '</div>' +
                '<button style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px;">Review Cases</button>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 12px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 6px;">' +
                '<span style="font-size: 20px; margin-right: 12px;">ℹ️</span>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 500; color: #1e40af;">INFO: SLA Auto-escalation Rule Triggered</div>' +
                '<div style="font-size: 14px; color: #1d4ed8;">Case #2024-004 automatically reassigned from Agent Smith to Senior Agent Johnson</div>' +
                '</div>' +
                '<button style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px;">View Details</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Timeline View -->' +
                '<div class="sla-timeline-section" style="margin-bottom: 30px;">' +
                '<h3 style="display: flex; align-items: center; margin-bottom: 15px;"><span style="margin-right: 8px;">📅</span>Active Cases SLA Timeline</h3>' +
                '<div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">' +
                
                '<div style="display: flex; align-items: center; padding: 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 500;">' +
                '<div style="flex: 2;">Case Details</div>' +
                '<div style="flex: 1;">Priority</div>' +
                '<div style="flex: 2;">SLA Progress</div>' +
                '<div style="flex: 1;">Time Remaining</div>' +
                '<div style="flex: 1;">Status</div>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #f1f5f9;">' +
                '<div style="flex: 2;"><strong>#2024-005</strong><br><span style="font-size: 12px; color: #64748b;">Login System Error</span></div>' +
                '<div style="flex: 1;"><span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">CRITICAL</span></div>' +
                '<div style="flex: 2;"><div style="background: #fecaca; height: 6px; border-radius: 3px; margin-bottom: 4px;"><div style="background: #dc2626; height: 6px; border-radius: 3px; width: 97%;"></div></div><span style="font-size: 12px; color: #dc2626;">97% complete (DANGER)</span></div>' +
                '<div style="flex: 1; color: #dc2626; font-weight: 500;">23m</div>' +
                '<div style="flex: 1;"><span style="background: #fecaca; color: #7f1d1d; padding: 2px 6px; border-radius: 10px; font-size: 11px;">ESCALATED</span></div>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #f1f5f9;">' +
                '<div style="flex: 2;"><strong>#2024-007</strong><br><span style="font-size: 12px; color: #64748b;">Billing Inquiry</span></div>' +
                '<div style="flex: 1;"><span style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">HIGH</span></div>' +
                '<div style="flex: 2;"><div style="background: #fef3c7; height: 6px; border-radius: 3px; margin-bottom: 4px;"><div style="background: #f59e0b; height: 6px; border-radius: 3px; width: 78%;"></div></div><span style="font-size: 12px; color: #92400e;">78% complete</span></div>' +
                '<div style="flex: 1; color: #92400e; font-weight: 500;">1h 15m</div>' +
                '<div style="flex: 1;"><span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 10px; font-size: 11px;">AT RISK</span></div>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 12px;">' +
                '<div style="flex: 2;"><strong>#2024-008</strong><br><span style="font-size: 12px; color: #64748b;">Feature Request</span></div>' +
                '<div style="flex: 1;"><span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">MEDIUM</span></div>' +
                '<div style="flex: 2;"><div style="background: #dbeafe; height: 6px; border-radius: 3px; margin-bottom: 4px;"><div style="background: #3b82f6; height: 6px; border-radius: 3px; width: 42%;"></div></div><span style="font-size: 12px; color: #1e40af;">42% complete</span></div>' +
                '<div style="flex: 1; color: #1e40af; font-weight: 500;">14h 22m</div>' +
                '<div style="flex: 1;"><span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 10px; font-size: 11px;">ON TRACK</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Actions -->' +
                '<div class="sla-actions" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">' +
                '<button class="btn btn-primary" onclick="showSLAReports()">📊 Generate SLA Report</button>' +
                '<button class="btn btn-primary" onclick="showSLAConfiguration()">⚙️ Configure SLA Rules</button>' +
                '<button class="btn btn-primary" onclick="showSLAEscalations()">🚨 Manage Escalations</button>' +
                '<button class="btn btn-primary" onclick="exportSLAData()">📁 Export SLA Data</button>' +
                '</div>' +
                
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        // Additional modal functions for expanded sidebar
        function showAnalyticsModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Analytics Dashboard</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="stats-grid" style="margin-bottom: 24px;">' +
                '<div class="stat-card">' +
                '<div class="stat-header">' +
                '<div class="stat-title">Average Resolution Time</div>' +
                '<div class="stat-icon" style="background-color: #eff6ff; color: #2563eb;">⏱️</div>' +
                '</div>' +
                '<div class="stat-value">18.5h</div>' +
                '<div class="stat-change positive">↗ Improved by 12%</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-header">' +
                '<div class="stat-title">Customer Satisfaction</div>' +
                '<div class="stat-icon" style="background-color: #dcfce7; color: #16a34a;">⭐</div>' +
                '</div>' +
                '<div class="stat-value">4.8/5</div>' +
                '<div class="stat-change positive">↗ +0.3 this month</div>' +
                '</div>' +
                '</div>' +
                '<h3>Trending Insights</h3>' +
                '<p>Email support tickets have increased by 25% this week. Consider expanding the FAQ section.</p>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showReportsModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedReportsHTML();
            document.body.appendChild(modal);
            
            setTimeout(() => {
                showReportsTab('dashboard');
            }, 100);
        }

        function generateAdvancedReportsHTML() {
            return '<div class="modal-content" style="max-width: 1600px; width: 95vw; max-height: 95vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">📊 Advanced Reports & Analytics Dashboard v1.7</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; background: rgba(255,255,255,0.2); border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">&times;</button>' +
                '</div>' +
                '<div class="modal-body" style="padding: 0;">' +
                
                '<!-- Report Navigation Tabs -->' +
                '<div class="reports-nav" style="display: flex; background: #f8fafc; border-bottom: 2px solid #e2e8f0; overflow-x: auto;">' +
                '<button class="reports-tab-btn active" onclick="showReportsTab(&quot;dashboard&quot;)" data-tab="dashboard" style="flex: 1; padding: 16px; border: none; background: transparent; color: #059669; cursor: pointer; font-weight: 600; transition: all 0.3s; border-bottom: 3px solid #059669; min-width: 120px;">📈 Dashboard</button>' +
                '<button class="reports-tab-btn" onclick="showReportsTab(&quot;performance&quot;)" data-tab="performance" style="flex: 1; padding: 16px; border: none; background: transparent; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s; border-bottom: 3px solid transparent; min-width: 120px;">🎯 Performance</button>' +
                '<button class="reports-tab-btn" onclick="showReportsTab(&quot;trends&quot;)" data-tab="trends" style="flex: 1; padding: 16px; border: none; background: transparent; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s; border-bottom: 3px solid transparent; min-width: 120px;">📊 Trends</button>' +
                '<button class="reports-tab-btn" onclick="showReportsTab(&quot;custom&quot;)" data-tab="custom" style="flex: 1; padding: 16px; border: none; background: transparent; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s; border-bottom: 3px solid transparent; min-width: 120px;">🔧 Builder</button>' +
                '<button class="reports-tab-btn" onclick="showReportsTab(&quot;exports&quot;)" data-tab="exports" style="flex: 1; padding: 16px; border: none; background: transparent; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s; border-bottom: 3px solid transparent; min-width: 120px;">📤 Exports</button>' +
                '</div>' +
                
                '<!-- Report Content Area -->' +
                '<div id="reportsTabContent" style="padding: 24px; min-height: 600px;">' +
                '</div>' +
                
                '</div>' +
                '</div>';
        }

        function showReportsTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.reports-tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.cssText = btn.style.cssText.replace('color: #059669', 'color: #64748b').replace('border-bottom: 3px solid #059669', 'border-bottom: 3px solid transparent');
            });
            
            const activeTab = document.querySelector('[data-tab="' + tabName + '"]');
            if (activeTab) {
                activeTab.classList.add('active');
                activeTab.style.cssText = activeTab.style.cssText.replace('color: #64748b', 'color: #059669').replace('border-bottom: 3px solid transparent', 'border-bottom: 3px solid #059669');
            }
            
            const content = document.getElementById('reportsTabContent');
            switch(tabName) {
                case 'dashboard':
                    content.innerHTML = generateDashboardContent();
                    setTimeout(() => initializeDashboardCharts(), 100);
                    break;
                case 'performance':
                    content.innerHTML = generatePerformanceContent();
                    setTimeout(() => initializePerformanceCharts(), 100);
                    break;
                case 'trends':
                    content.innerHTML = generateTrendsContent();
                    setTimeout(() => initializeTrendsCharts(), 100);
                    break;
                case 'custom':
                    content.innerHTML = generateCustomBuilderContent();
                    break;
                case 'exports':
                    content.innerHTML = generateExportsContent();
                    break;
            }
        }

        function generateDashboardContent() {
            return '<div class="dashboard-content">' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                
                '<!-- Key Metrics Cards -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 16px; font-size: 18px;">📈 Executive Summary</h3>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 12px;">' +
                '<div style="font-size: 14px; opacity: 0.9;">Total Cases</div>' +
                '<div style="font-size: 28px; font-weight: bold; margin: 8px 0;">847</div>' +
                '<div style="font-size: 12px; opacity: 0.8;">↗ +12% from last month</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; border-radius: 12px;">' +
                '<div style="font-size: 14px; opacity: 0.9;">Resolution Rate</div>' +
                '<div style="font-size: 28px; font-weight: bold; margin: 8px 0;">94.2%</div>' +
                '<div style="font-size: 12px; opacity: 0.8;">↗ +2.3% improvement</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 20px; border-radius: 12px;">' +
                '<div style="font-size: 14px; opacity: 0.9;">Avg Response</div>' +
                '<div style="font-size: 28px; font-weight: bold; margin: 8px 0;">2.1h</div>' +
                '<div style="font-size: 12px; opacity: 0.8;">↘ -15min faster</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px;">' +
                '<div style="font-size: 14px; opacity: 0.9;">Satisfaction</div>' +
                '<div style="font-size: 28px; font-weight: bold; margin: 8px 0;">4.7★</div>' +
                '<div style="font-size: 12px; opacity: 0.8;">↗ +0.2 rating increase</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Case Volume Chart -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📊 Case Volume Trends (Last 30 Days)</h4>' +
                '<canvas id="caseVolumeChart" style="max-height: 300px;"></canvas>' +
                '</div>' +
                '</div>' +
                
                '<!-- Quick Actions Panel -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 16px; font-size: 18px;">⚡ Quick Actions</h3>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">' +
                '<button onclick="generateInstantReport()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 12px; cursor: pointer;">📊 Generate Instant Report</button>' +
                '<button onclick="exportToPDF()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 12px; cursor: pointer;">📄 Export to PDF</button>' +
                '<button onclick="scheduleReport()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 12px; cursor: pointer;">⏰ Schedule Report</button>' +
                '<button onclick="shareReport()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">📧 Share Report</button>' +
                '</div>' +
                
                '<!-- Top Insights -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">💡 Key Insights</h4>' +
                '<div style="font-size: 14px; color: #4b5563; line-height: 1.6;">' +
                '• <span style="color: #059669; font-weight: 600;">Peak hours:</span> 2-4 PM with 23% more cases<br>' +
                '• <span style="color: #f59e0b; font-weight: 600;">Top category:</span> Technical support (34%)<br>' +
                '• <span style="color: #3b82f6; font-weight: 600;">Best performer:</span> Sarah Johnson (98% resolution)<br>' +
                '• <span style="color: #7c3aed; font-weight: 600;">Trend alert:</span> 15% increase in mobile issues<br>' +
                '• <span style="color: #dc2626; font-weight: 600;">Action needed:</span> 3 SLA breaches require attention' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Bottom Charts Row -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🎯 Priority Distribution</h4>' +
                '<canvas id="priorityChart" style="max-height: 250px;"></canvas>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📈 Response Time Trends</h4>' +
                '<canvas id="responseTimeChart" style="max-height: 250px;"></canvas>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function initializeDashboardCharts() {
            // Case Volume Chart
            const ctx1 = document.getElementById('caseVolumeChart');
            if (ctx1) {
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            label: 'New Cases',
                            data: [45, 52, 48, 61],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }, {
                            label: 'Resolved Cases',
                            data: [42, 49, 46, 58],
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            // Priority Distribution Chart
            const ctx2 = document.getElementById('priorityChart');
            if (ctx2) {
                new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Critical', 'High', 'Medium', 'Low'],
                        datasets: [{
                            data: [8, 23, 45, 24],
                            backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6', '#059669'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            }

            // Response Time Chart
            const ctx3 = document.getElementById('responseTimeChart');
            if (ctx3) {
                new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: ['9AM', '11AM', '1PM', '3PM', '5PM'],
                        datasets: [{
                            label: 'Avg Response Time (hours)',
                            data: [1.2, 1.8, 2.9, 1.5, 2.4],
                            backgroundColor: 'rgba(124, 58, 237, 0.8)',
                            borderColor: '#7c3aed',
                            borderWidth: 2,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, title: { display: true, text: 'Hours' } } }
                    }
                });
            }
        }

        function generatePerformanceContent() {
            return '<div class="performance-content">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                
                '<!-- Agent Performance -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">👥 Agent Performance Ranking</h4>' +
                '<div style="space-y: 12px;">' +
                '<div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; margin-bottom: 8px;">' +
                '<div><span style="font-weight: 600; color: #059669;">🥇 Sarah Johnson</span><div style="font-size: 12px; color: #6b7280;">Resolution Rate: 98.2%</div></div>' +
                '<div style="text-align: right;"><div style="font-weight: 600;">47 cases</div><div style="font-size: 12px; color: #059669;">4.9★</div></div>' +
                '</div>' +
                '<div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #fef3f2; border-radius: 8px; margin-bottom: 8px;">' +
                '<div><span style="font-weight: 600; color: #dc2626;">🥈 Mike Chen</span><div style="font-size: 12px; color: #6b7280;">Resolution Rate: 94.7%</div></div>' +
                '<div style="text-align: right;"><div style="font-weight: 600;">39 cases</div><div style="font-size: 12px; color: #f59e0b;">4.6★</div></div>' +
                '</div>' +
                '<div style="display: flex; justify-content: between; align-items: center; padding: 12px; background: #fef7f0; border-radius: 8px; margin-bottom: 8px;">' +
                '<div><span style="font-weight: 600; color: #f59e0b;">🥉 Emma Davis</span><div style="font-size: 12px; color: #6b7280;">Resolution Rate: 91.3%</div></div>' +
                '<div style="text-align: right;"><div style="font-weight: 600;">34 cases</div><div style="font-size: 12px; color: #3b82f6;">4.4★</div></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Performance Metrics Chart -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📊 Team Performance Overview</h4>' +
                '<canvas id="performanceChart" style="max-height: 300px;"></canvas>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Compliance Section -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">⏱️ SLA Compliance Dashboard</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">' +
                '<div style="text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #059669;">96.2%</div>' +
                '<div style="font-size: 14px; color: #4b5563;">Critical SLA</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Target: 95%</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #fef3f2; border-radius: 8px; border-left: 4px solid #dc2626;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #dc2626;">87.4%</div>' +
                '<div style="font-size: 14px; color: #4b5563;">High Priority SLA</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Target: 90%</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #3b82f6;">92.1%</div>' +
                '<div style="font-size: 14px; color: #4b5563;">Medium Priority SLA</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Target: 85%</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #f7fee7; border-radius: 8px; border-left: 4px solid #65a30d;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #65a30d;">98.7%</div>' +
                '<div style="font-size: 14px; color: #4b5563;">Low Priority SLA</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Target: 80%</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateTrendsContent() {
            return '<div class="trends-content">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                
                '<!-- Monthly Trends -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📈 Monthly Case Trends</h4>' +
                '<canvas id="monthlyTrendsChart" style="max-height: 300px;"></canvas>' +
                '</div>' +
                
                '<!-- Category Breakdown -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🏷️ Category Distribution</h4>' +
                '<canvas id="categoryChart" style="max-height: 300px;"></canvas>' +
                '</div>' +
                '</div>' +
                
                '<!-- Trend Insights -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🔍 Trend Analysis & Predictions</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">' +
                '<div style="padding: 16px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px;">' +
                '<div style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">📊 Volume Prediction</div>' +
                '<div style="font-size: 14px; color: #1f2937;">Next month: Expected 15% increase in technical cases based on product launch patterns.</div>' +
                '</div>' +
                '<div style="padding: 16px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 8px;">' +
                '<div style="font-weight: 600; color: #166534; margin-bottom: 8px;">⏱️ Response Time Trend</div>' +
                '<div style="font-size: 14px; color: #1f2937;">Improving: Average response time decreased by 23% over last quarter.</div>' +
                '</div>' +
                '<div style="padding: 16px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px;">' +
                '<div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">📱 Channel Analysis</div>' +
                '<div style="font-size: 14px; color: #1f2937;">Mobile cases increased 34% - recommend mobile app improvements.</div>' +
                '</div>' +
                '<div style="padding: 16px; background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 8px;">' +
                '<div style="font-weight: 600; color: #be185d; margin-bottom: 8px;">🎯 Seasonal Pattern</div>' +
                '<div style="font-size: 14px; color: #1f2937;">Holiday season approaching - historically 45% volume increase expected.</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateCustomBuilderContent() {
            return '<div class="custom-builder-content">' +
                '<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">' +
                
                '<!-- Report Builder Panel -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🔧 Custom Report Builder</h4>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Report Type</label>' +
                '<select id="reportType" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">' +
                '<option value="summary">Executive Summary</option>' +
                '<option value="detailed">Detailed Analysis</option>' +
                '<option value="comparison">Comparison Report</option>' +
                '<option value="trend">Trend Analysis</option>' +
                '</select>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Date Range</label>' +
                '<select id="dateRange" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">' +
                '<option value="7d">Last 7 Days</option>' +
                '<option value="30d">Last 30 Days</option>' +
                '<option value="90d">Last 90 Days</option>' +
                '<option value="custom">Custom Range</option>' +
                '</select>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Metrics to Include</label>' +
                '<div style="space-y: 8px;">' +
                '<label style="display: flex; align-items: center; margin-bottom: 6px;"><input type="checkbox" checked style="margin-right: 8px;"> Case Volume</label>' +
                '<label style="display: flex; align-items: center; margin-bottom: 6px;"><input type="checkbox" checked style="margin-right: 8px;"> Response Times</label>' +
                '<label style="display: flex; align-items: center; margin-bottom: 6px;"><input type="checkbox" style="margin-right: 8px;"> Agent Performance</label>' +
                '<label style="display: flex; align-items: center; margin-bottom: 6px;"><input type="checkbox" style="margin-right: 8px;"> Customer Satisfaction</label>' +
                '<label style="display: flex; align-items: center; margin-bottom: 6px;"><input type="checkbox" checked style="margin-right: 8px;"> SLA Compliance</label>' +
                '</div>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Chart Types</label>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">' +
                '<label style="display: flex; align-items: center;"><input type="checkbox" checked style="margin-right: 8px;"> Line Charts</label>' +
                '<label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"> Bar Charts</label>' +
                '<label style="display: flex; align-items: center;"><input type="checkbox" checked style="margin-right: 8px;"> Pie Charts</label>' +
                '<label style="display: flex; align-items: center;"><input type="checkbox" style="margin-right: 8px;"> Heat Maps</label>' +
                '</div>' +
                '</div>' +
                
                '<button onclick="generateCustomReport()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; margin-bottom: 12px;">📊 Generate Report</button>' +
                '<button onclick="saveReportTemplate()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">💾 Save Template</button>' +
                '</div>' +
                
                '<!-- Report Preview -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📋 Report Preview</h4>' +
                '<div id="reportPreview" style="min-height: 400px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">' +
                'Select options and click "Generate Report" to see preview' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Saved Templates -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 24px;">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📚 Saved Templates</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">' +
                '<div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer;" onclick="loadTemplate(&quot;executive&quot;)">' +
                '<div style="font-weight: 600; margin-bottom: 4px;">Executive Summary</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Monthly overview with key metrics</div>' +
                '</div>' +
                '<div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer;" onclick="loadTemplate(&quot;performance&quot;)">' +
                '<div style="font-weight: 600; margin-bottom: 4px;">Team Performance</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Agent rankings and metrics</div>' +
                '</div>' +
                '<div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer;" onclick="loadTemplate(&quot;sla&quot;)">' +
                '<div style="font-weight: 600; margin-bottom: 4px;">SLA Compliance</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Service level analysis</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateExportsContent() {
            return '<div class="exports-content">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                
                '<!-- Export Options -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📤 Export Options</h4>' +
                '<div style="space-y: 16px;">' +
                '<button onclick="exportToPDF()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;"><span style="margin-right: 8px;">📄</span> Export to PDF</button>' +
                '<button onclick="exportToExcel()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;"><span style="margin-right: 8px;">📊</span> Export to Excel</button>' +
                '<button onclick="exportToCSV()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;"><span style="margin-right: 8px;">📋</span> Export to CSV</button>' +
                '<button onclick="emailReport()" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center;"><span style="margin-right: 8px;">📧</span> Email Report</button>' +
                '</div>' +
                '</div>' +
                
                '<!-- Scheduled Reports -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">⏰ Schedule Reports</h4>' +
                '<div style="margin-bottom: 16px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Frequency</label>' +
                '<select style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 12px;">' +
                '<option>Daily</option>' +
                '<option>Weekly</option>' +
                '<option>Monthly</option>' +
                '<option>Quarterly</option>' +
                '</select>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 500;">Recipients</label>' +
                '<input type="email" placeholder="Enter email addresses..." style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 12px;">' +
                '</div>' +
                '<button onclick="scheduleReport()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">📅 Schedule Report</button>' +
                '</div>' +
                '</div>' +
                
                '<!-- Recent Exports -->' +
                '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📥 Recent Exports</h4>' +
                '<div style="space-y: 12px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px;">' +
                '<div><div style="font-weight: 500;">Executive Summary - January 2025</div><div style="font-size: 12px; color: #6b7280;">PDF • 2.4 MB • 2 hours ago</div></div>' +
                '<button style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Download</button>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px;">' +
                '<div><div style="font-weight: 500;">Agent Performance Report</div><div style="font-size: 12px; color: #6b7280;">Excel • 1.8 MB • 5 hours ago</div></div>' +
                '<button style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Download</button>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 8px;">' +
                '<div><div style="font-weight: 500;">Case Data Export</div><div style="font-size: 12px; color: #6b7280;">CSV • 892 KB • 1 day ago</div></div>' +
                '<button style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Download</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showPerformanceModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Performance Metrics</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="stats-grid" style="margin-bottom: 24px;">' +
                '<div class="stat-card">' +
                '<div class="stat-header">' +
                '<div class="stat-title">First Response Time</div>' +
                '<div class="stat-icon" style="background-color: #fef3c7; color: #d97706;">⚡</div>' +
                '</div>' +
                '<div class="stat-value">2.3h</div>' +
                '<div class="stat-change positive">↗ 15% faster</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-header">' +
                '<div class="stat-title">Agent Productivity</div>' +
                '<div class="stat-icon" style="background-color: #dcfce7; color: #16a34a;">📈</div>' +
                '</div>' +
                '<div class="stat-value">94%</div>' +
                '<div class="stat-change positive">↗ Above target</div>' +
                '</div>' +
                '</div>' +
                '<h3>Top Performing Agents</h3>' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">' +
                '<p><strong>Sarah Chen</strong> - 98% satisfaction rate</p>' +
                '<p><strong>Mike Rodriguez</strong> - 1.8h avg response time</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showAllCasesModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">All Cases</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="display: flex; gap: 10px; margin-bottom: 20px;">' +
                '<input type="text" placeholder="Search cases..." style="flex: 1; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">' +
                '<select style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">' +
                '<option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option>' +
                '</select>' +
                '</div>' +
                '<div class="cases-list">' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<div style="display: flex; justify-content: between; align-items: center;">' +
                '<h4>Case #2024-001: Login Issues</h4>' +
                '<span style="background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 4px; font-size: 12px;">IN PROGRESS</span>' +
                '</div>' +
                '<p style="color: #64748b; margin: 8px 0;">Customer unable to access dashboard</p>' +
                '<p style="font-size: 12px; color: #9ca3af;">Assigned to: John Doe • Priority: High</p>' +
                '</div>' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<div style="display: flex; justify-content: between; align-items: center;">' +
                '<h4>Case #2024-002: Billing Question</h4>' +
                '<span style="background: #dcfce7; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 12px;">RESOLVED</span>' +
                '</div>' +
                '<p style="color: #64748b; margin: 8px 0;">Invoice discrepancy resolved</p>' +
                '<p style="font-size: 12px; color: #9ca3af;">Assigned to: Sarah Chen • Priority: Medium</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showCaseStatusModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Case Status Overview</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="stats-grid">' +
                '<div class="stat-card">' +
                '<div class="stat-title">New</div>' +
                '<div class="stat-value">3</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">In Progress</div>' +
                '<div class="stat-value">8</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Pending</div>' +
                '<div class="stat-value">2</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Resolved</div>' +
                '<div class="stat-value">17</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showAssignmentModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Case Assignments</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<h3>Agent Workload</h3>' +
                '<div style="margin: 16px 0;">' +
                '<div style="display: flex; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">' +
                '<span><strong>John Doe</strong></span><span>5 cases</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">' +
                '<span><strong>Sarah Chen</strong></span><span>3 cases</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<span><strong>Mike Rodriguez</strong></span><span>2 cases</span>' +
                '</div>' +
                '</div>' +
                '<button class="btn btn-primary" onclick="showNotification(&quot;Auto-assignment enabled&quot;, &quot;success&quot;)">Enable Auto-Assignment</button>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showCustomersModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedCustomerManagementHTML();
            document.body.appendChild(modal);
            initializeCustomerManagement();
        }

        function generateAdvancedCustomerManagementHTML() {
            return '<div class="modal-content" style="width: 95vw; max-width: 1400px; height: 90vh; max-height: none;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h2 class="modal-title" style="color: white; margin: 0; font-size: 24px;">🏢 Advanced Customer Management</h2>' +
                '<p style="color: rgba(255,255,255,0.8); margin: 4px 0 0 0; font-size: 14px;">Enterprise CRM • Customer 360° • Sales Intelligence</p>' +
                '</div>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; font-size: 24px;">&times;</button>' +
                '</div>' +
                '</div>' +

                '<!-- Customer Management Tabs -->' +
                '<div style="display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">' +
                '<button class="customer-tab active" onclick="showCustomerTab(&quot;directory&quot;)" data-tab="directory">📁 Master Directory</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;profiles&quot;)" data-tab="profiles">👤 Customer Profiles</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;segments&quot;)" data-tab="segments">📊 Segments & Analytics</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;enterprise&quot;)" data-tab="enterprise">🏆 Major Customers</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;pipeline&quot;)" data-tab="pipeline">⚡ Sales Pipeline</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;insights&quot;)" data-tab="insights">🧠 AI Insights</button>' +
                '</div>' +

                '<!-- Tab Content Area -->' +
                '<div class="modal-body" style="flex: 1; overflow: hidden; padding: 0;">' +
                '<div id="customerTabContent" style="height: 100%; overflow-y: auto; padding: 20px;">' +
                generateCustomerDirectoryHTML() +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateCustomerDirectoryHTML() {
            return '<div class="customer-directory">' +
                '<!-- Header with Search and Actions -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 20px;">📁 Master Customer Directory</h3>' +
                '<p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Complete customer database with 360° view</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="importCustomers()" class="btn" style="background: #f59e0b; color: white; padding: 8px 16px; border-radius: 8px; border: none;">📥 Import</button>' +
                '<button onclick="addNewCustomer()" class="btn btn-primary">➕ Add Customer</button>' +
                '</div>' +
                '</div>' +

                '<!-- Search and Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<div style="position: relative;">' +
                '<input type="text" placeholder="🔍 Search customers, companies, contacts..." style="width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;" onkeyup="filterCustomers(this.value)">' +
                '</div>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;" onchange="filterBySegment(this.value)">' +
                '<option value="">All Segments</option>' +
                '<option value="Enterprise">Enterprise</option>' +
                '<option value="Mid-Market">Mid-Market</option>' +
                '<option value="SMB">SMB</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;" onchange="filterByStatus(this.value)">' +
                '<option value="">All Status</option>' +
                '<option value="active">Active</option>' +
                '<option value="prospect">Prospect</option>' +
                '<option value="inactive">Inactive</option>' +
                '</select>' +
                '<button onclick="exportCustomers()" class="btn" style="background: #059669; color: white; padding: 12px 16px; border-radius: 8px; border: none;">📊 Export</button>' +
                '</div>' +

                '<!-- Customer Stats Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 32px; font-weight: bold;">2,847</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Total Customers</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 32px; font-weight: bold;">847</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Enterprise Accounts</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 32px; font-weight: bold;">$12.4M</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Total ARR</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 32px; font-weight: bold;">94.7%</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Health Score</div>' +
                '</div>' +
                '</div>' +

                '<!-- Customer List -->' +
                '<div id="customerList">' +
                generateCustomerList() +
                '</div>' +
                '</div>';
        }

        function generateCustomerList() {
            const customers = [
                {
                    id: 'microsoft',
                    company: 'Microsoft Corporation',
                    contact: 'Satya Nadella',
                    email: 'satya.nadella@microsoft.com',
                    phone: '+1 (425) 882-8080',
                    segment: 'Enterprise',
                    status: 'active',
                    arr: '$2,400,000',
                    health: '98.2%',
                    cases: 12,
                    lastActivity: '2 hours ago',
                    industry: 'Technology',
                    employees: '221,000+',
                    logo: '🏢',
                    color: '#0078d4'
                },
                {
                    id: 'salesforce',
                    company: 'Salesforce Inc',
                    contact: 'Marc Benioff',
                    email: 'marc.benioff@salesforce.com',
                    phone: '+1 (415) 901-7000',
                    segment: 'Enterprise',
                    status: 'active',
                    arr: '$1,850,000',
                    health: '96.7%',
                    cases: 8,
                    lastActivity: '1 day ago',
                    industry: 'Software',
                    employees: '73,000+',
                    logo: '⚡',
                    color: '#00a1e0'
                },
                {
                    id: 'adobe',
                    company: 'Adobe Systems',
                    contact: 'Shantanu Narayen',
                    email: 'shantanu.narayen@adobe.com',
                    phone: '+1 (408) 536-6000',
                    segment: 'Enterprise',
                    status: 'active',
                    arr: '$1,240,000',
                    health: '94.1%',
                    cases: 6,
                    lastActivity: '3 hours ago',
                    industry: 'Creative Software',
                    employees: '26,000+',
                    logo: '🎨',
                    color: '#ff0000'
                },
                {
                    id: 'techstart',
                    company: 'TechStart Solutions',
                    contact: 'Sarah Wilson',
                    email: 'sarah.wilson@techstart.io',
                    phone: '+1 (555) 123-4567',
                    segment: 'Mid-Market',
                    status: 'active',
                    arr: '$285,000',
                    health: '87.3%',
                    cases: 4,
                    lastActivity: '5 hours ago',
                    industry: 'SaaS',
                    employees: '150-500',
                    logo: '🚀',
                    color: '#10b981'
                },
                {
                    id: 'acme',
                    company: 'Acme Corporation',
                    contact: 'John Anderson',
                    email: 'john.anderson@acme.com',
                    phone: '+1 (555) 987-6543',
                    segment: 'SMB',
                    status: 'prospect',
                    arr: '$85,000',
                    health: '72.1%',
                    cases: 2,
                    lastActivity: '1 week ago',
                    industry: 'Manufacturing',
                    employees: '50-150',
                    logo: '🏭',
                    color: '#f59e0b'
                }
            ];

            let html = '';
            customers.forEach(customer => {
                html += '<div class="customer-card" onclick="viewCustomerDetail(&quot;' + customer.id + '&quot;)">' +
                    '<div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px;">' +
                    '<div style="display: flex; align-items: center;">' +
                    '<div style="width: 48px; height: 48px; background: ' + customer.color + '; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 16px;">' + customer.logo + '</div>' +
                    '<div>' +
                    '<h4 style="color: #1f2937; margin: 0 0 4px 0; font-size: 18px; font-weight: 600;">' + customer.company + '</h4>' +
                    '<p style="color: #64748b; margin: 0; font-size: 14px;">👤 ' + customer.contact + ' • 📧 ' + customer.email + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<span class="customer-status ' + customer.status + '">' + customer.status + '</span>' +
                    '</div>' +
                    '</div>' +

                    '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; margin-bottom: 16px;">' +
                    '<div>' +
                    '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Segment</div>' +
                    '<div style="font-size: 14px; font-weight: 500; color: #1f2937;">' + customer.segment + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">ARR</div>' +
                    '<div style="font-size: 14px; font-weight: 600; color: #059669;">' + customer.arr + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Health Score</div>' +
                    '<div style="font-size: 14px; font-weight: 500; color: ' + (parseFloat(customer.health) > 90 ? '#059669' : parseFloat(customer.health) > 80 ? '#f59e0b' : '#dc2626') + ';">' + customer.health + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Active Cases</div>' +
                    '<div style="font-size: 14px; font-weight: 500; color: #1f2937;">' + customer.cases + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Last Activity</div>' +
                    '<div style="font-size: 14px; color: #64748b;">' + customer.lastActivity + '</div>' +
                    '</div>' +
                    '</div>' +

                    '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f3f4f6;">' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<span style="background: #f3f4f6; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 12px;">' + customer.industry + '</span>' +
                    '<span style="background: #f3f4f6; color: #64748b; padding: 4px 8px; border-radius: 6px; font-size: 12px;">👥 ' + customer.employees + '</span>' +
                    '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="event.stopPropagation(); createCase(&quot;' + customer.email + '&quot;)" style="background: #667eea; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📝 Case</button>' +
                    '<button onclick="event.stopPropagation(); callCustomer(&quot;' + customer.phone + '&quot;)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📞 Call</button>' +
                    '<button onclick="event.stopPropagation(); emailCustomer(&quot;' + customer.email + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📧 Email</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });

            return html;
        }

        function initializeCustomerManagement() {
            // Initialize default tab
            showCustomerTab('directory');
        }

        function showCustomerTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.customer-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            document.querySelector('.customer-tab[data-tab="' + tabName + '"]').classList.add('active');
            
            // Show corresponding content
            const content = document.getElementById('customerTabContent');
            
            switch(tabName) {
                case 'directory':
                    content.innerHTML = generateCustomerDirectoryHTML();
                    break;
                case 'profiles':
                    content.innerHTML = generateCustomerProfilesHTML();
                    break;
                case 'segments':
                    content.innerHTML = generateSegmentsAnalyticsHTML();
                    break;
                case 'enterprise':
                    content.innerHTML = generateMajorCustomersHTML();
                    break;
                case 'pipeline':
                    content.innerHTML = generateSalesPipelineHTML();
                    break;
                case 'insights':
                    content.innerHTML = generateAIInsightsHTML();
                    break;
            }
        }

        // Customer Management Action Functions
        function addNewCustomer() {
            showNotification('📝 Opening new customer form...', 'info');
        }

        function importCustomers() {
            showNotification('📥 Opening customer import wizard...', 'info');
        }

        function exportCustomers() {
            showNotification('📊 Exporting customer data...', 'success');
        }

        function filterCustomers(searchTerm) {
            // Customer search functionality
            console.log('Searching for: ' + searchTerm);
        }

        function filterBySegment(segment) {
            showNotification('Filtering by segment: ' + (segment || 'All'), 'info');
        }

        function filterByStatus(status) {
            showNotification('Filtering by status: ' + (status || 'All'), 'info');
        }

        function viewCustomerDetail(customerId) {
            showNotification('👤 Opening detailed profile for customer ID: ' + customerId, 'info');
        }

        function createCase(email) {
            showNotification('📝 Creating new case for: ' + email, 'info');
        }

        function callCustomer(phone) {
            showNotification('📞 Initiating call to: ' + phone, 'info');
        }

        function emailCustomer(email) {
            showNotification('📧 Opening email composer for: ' + email, 'info');
        }

        // Advanced Customer Module Tab Content Functions
        function generateCustomerProfilesHTML() {
            return '<div style="padding: 20px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">👤 Customer 360° Profiles</h3>' +
                '<div style="text-align: center; padding: 60px 20px; color: #64748b;">' +
                '<div style="font-size: 48px; margin-bottom: 16px;">👥</div>' +
                '<h4 style="color: #1f2937;">Advanced Customer Profiles</h4>' +
                '<p>Comprehensive customer profiles with custom fields, relationship mapping, and interaction history coming soon.</p>' +
                '</div>' +
                '</div>';
        }

        function generateSegmentsAnalyticsHTML() {
            return '<div style="padding: 20px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📊 Customer Segments & Analytics</h3>' +
                
                '<!-- Segment Performance Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">' +
                '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 24px; border-radius: 16px;">' +
                '<h4 style="margin: 0 0 12px 0; font-size: 18px;">🏆 Enterprise Segment</h4>' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">847</div>' +
                '<div style="opacity: 0.9;">$8.2M ARR • 97.3% Health</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 24px; border-radius: 16px;">' +
                '<h4 style="margin: 0 0 12px 0; font-size: 18px;">🚀 Mid-Market</h4>' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">1,425</div>' +
                '<div style="opacity: 0.9;">$3.1M ARR • 89.7% Health</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 24px; border-radius: 16px;">' +
                '<h4 style="margin: 0 0 12px 0; font-size: 18px;">🏢 SMB Segment</h4>' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">575</div>' +
                '<div style="opacity: 0.9;">$1.1M ARR • 78.2% Health</div>' +
                '</div>' +
                '</div>' +

                '<!-- Detailed Analytics Table -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">' +
                '<div style="background: #f8fafc; padding: 16px; border-bottom: 1px solid #e2e8f0;">' +
                '<h4 style="margin: 0; color: #1f2937;">Segment Performance Matrix</h4>' +
                '</div>' +
                '<div style="overflow-x: auto;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f9fafb;">' +
                '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Segment</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Customers</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Total ARR</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Avg ARR</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Health Score</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Churn Risk</th>' +
                '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Growth Rate</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td style="padding: 12px; font-weight: 600; color: #1f2937; border-bottom: 1px solid #f3f4f6;">🏆 Enterprise</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937; border-bottom: 1px solid #f3f4f6;">847</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">$8.2M</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937; border-bottom: 1px solid #f3f4f6;">$9,682</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">97.3%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">2.1%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">+24%</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="padding: 12px; font-weight: 600; color: #1f2937; border-bottom: 1px solid #f3f4f6;">🚀 Mid-Market</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937; border-bottom: 1px solid #f3f4f6;">1,425</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">$3.1M</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937; border-bottom: 1px solid #f3f4f6;">$2,175</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b; border-bottom: 1px solid #f3f4f6;">89.7%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b; border-bottom: 1px solid #f3f4f6;">5.4%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; border-bottom: 1px solid #f3f4f6;">+18%</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="padding: 12px; font-weight: 600; color: #1f2937;">🏢 SMB</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937;">575</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669;">$1.1M</td>' +
                '<td style="padding: 12px; text-align: right; color: #1f2937;">$1,913</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b;">78.2%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #dc2626;">12.3%</td>' +
                '<td style="padding: 12px; text-align: right; font-weight: 600; color: #059669;">+12%</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateMajorCustomersHTML() {
            return '<div style="padding: 20px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🏆 Major Enterprise Customers</h3>' +
                
                '<!-- Enterprise Dashboard -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px;">' +
                '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">$8.2M</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Enterprise ARR</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">847</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Enterprise Accounts</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">97.3%</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Avg Health Score</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">2.1%</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Churn Rate</div>' +
                '</div>' +
                '</div>' +

                '<!-- Top Enterprise Customers -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<h4 style="margin: 0; color: #1f2937;">Top Enterprise Accounts</h4>' +
                '<button onclick="manageEnterpriseAccounts()" class="btn btn-primary" style="padding: 8px 16px;">Manage All</button>' +
                '</div>' +

                '<div style="display: grid; gap: 16px;">' +
                generateTopEnterpriseCustomers() +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateTopEnterpriseCustomers() {
            const topCustomers = [
                { company: 'Microsoft Corporation', logo: '🏢', arr: '$2,400,000', health: '98.2%', contact: 'Satya Nadella', industry: 'Technology', color: '#0078d4' },
                { company: 'Salesforce Inc', logo: '⚡', arr: '$1,850,000', health: '96.7%', contact: 'Marc Benioff', industry: 'Software', color: '#00a1e0' },
                { company: 'Adobe Systems', logo: '🎨', arr: '$1,240,000', health: '94.1%', contact: 'Shantanu Narayen', industry: 'Creative Software', color: '#ff0000' },
                { company: 'Oracle Corporation', logo: '🔺', arr: '$950,000', health: '91.8%', contact: 'Larry Ellison', industry: 'Database', color: '#f80000' },
                { company: 'IBM Corporation', logo: '💼', arr: '$875,000', health: '89.4%', contact: 'Arvind Krishna', industry: 'Enterprise Tech', color: '#1f70c1' }
            ];

            let html = '';
            topCustomers.forEach(customer => {
                html += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; transition: all 0.3s ease;" onmouseover="this.style.boxShadow=&quot;0 4px 20px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;">' +
                    '<div style="display: flex; align-items: center;">' +
                    '<div style="width: 48px; height: 48px; background: ' + customer.color + '; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 16px;">' + customer.logo + '</div>' +
                    '<div>' +
                    '<h5 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px; font-weight: 600;">' + customer.company + '</h5>' +
                    '<p style="margin: 0; color: #64748b; font-size: 14px;">👤 ' + customer.contact + ' • ' + customer.industry + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; gap: 24px;">' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 18px; font-weight: 700; color: #059669; margin-bottom: 2px;">' + customer.arr + '</div>' +
                    '<div style="font-size: 12px; color: #64748b;">Annual Revenue</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 16px; font-weight: 600; color: ' + (parseFloat(customer.health) > 95 ? '#059669' : parseFloat(customer.health) > 90 ? '#f59e0b' : '#dc2626') + '; margin-bottom: 2px;">' + customer.health + '</div>' +
                    '<div style="font-size: 12px; color: #64748b;">Health Score</div>' +
                    '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="viewEnterpriseProfile(&quot;' + customer.company + '&quot;)" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">👤 Profile</button>' +
                    '<button onclick="createEnterpriseReport(&quot;' + customer.company + '&quot;)" style="background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📊 Report</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });

            return html;
        }

        function generateSalesPipelineHTML() {
            return '<div style="padding: 20px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚡ Sales Pipeline & Opportunities</h3>' +
                
                '<!-- Pipeline Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px;">' +
                '<div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">$4.2M</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Pipeline Value</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">127</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Active Deals</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">73%</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Win Rate</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold;">45</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Days Avg Cycle</div>' +
                '</div>' +
                '</div>' +

                '<!-- Pipeline Stages -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">' +
                '<h4 style="margin: 0 0 20px 0; color: #1f2937;">Pipeline by Stage</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">' +
                
                '<div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">🎯</div>' +
                '<div style="font-size: 18px; font-weight: 600; color: #1f2937;">Qualified</div>' +
                '<div style="font-size: 24px; font-weight: bold; color: #667eea; margin: 8px 0;">$980K</div>' +
                '<div style="font-size: 14px; color: #64748b;">23 deals</div>' +
                '</div>' +
                
                '<div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">💼</div>' +
                '<div style="font-size: 18px; font-weight: 600; color: #1f2937;">Proposal</div>' +
                '<div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 8px 0;">$1.4M</div>' +
                '<div style="font-size: 14px; color: #64748b;">18 deals</div>' +
                '</div>' +
                
                '<div style="text-align: center; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">🤝</div>' +
                '<div style="font-size: 18px; font-weight: 600; color: #1f2937;">Negotiation</div>' +
                '<div style="font-size: 24px; font-weight: bold; color: #10b981; margin: 8px 0;">$1.8M</div>' +
                '<div style="font-size: 14px; color: #64748b;">12 deals</div>' +
                '</div>' +
                
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateAIInsightsHTML() {
            return '<div style="padding: 20px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🧠 AI-Powered Customer Insights</h3>' +
                
                '<!-- AI Insights Dashboard -->' +
                '<div style="display: grid; gap: 24px;">' +
                
                '<!-- Health Score Predictions -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">🎯</div>' +
                '<h4 style="margin: 0; color: #1f2937;">Health Score Predictions</h4>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">' +
                '<div style="padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">' +
                '<div style="font-weight: 600; color: #dc2626; margin-bottom: 4px;">⚠️ At Risk Customers</div>' +
                '<div style="font-size: 14px; color: #64748b;">3 customers predicted to churn within 30 days</div>' +
                '<div style="font-size: 12px; color: #dc2626; margin-top: 8px;">Acme Corp, TechVision, StartupX</div>' +
                '</div>' +
                '<div style="padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">' +
                '<div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">✅ Growth Opportunities</div>' +
                '<div style="font-size: 14px; color: #64748b;">8 customers ready for upsell/expansion</div>' +
                '<div style="font-size: 12px; color: #10b981; margin-top: 8px;">Microsoft, Salesforce, Adobe +5 more</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Behavioral Insights -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">📊</div>' +
                '<h4 style="margin: 0; color: #1f2937;">Customer Behavior Analysis</h4>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">' +
                '<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #667eea;">47%</div>' +
                '<div style="font-size: 14px; color: #64748b; margin-top: 4px;">Feature Adoption Rate</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #10b981;">8.4</div>' +
                '<div style="font-size: 14px; color: #64748b; margin-top: 4px;">Avg Support Interactions</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold; color: #f59e0b;">23 days</div>' +
                '<div style="font-size: 14px; color: #64748b; margin-top: 4px;">Time to Value</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- AI Recommendations -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">💡</div>' +
                '<h4 style="margin: 0; color: #1f2937;">Smart Recommendations</h4>' +
                '</div>' +
                '<div style="display: grid; gap: 12px;">' +
                '<div style="display: flex; align-items: center; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #667eea;">' +
                '<div style="margin-right: 12px;">🎯</div>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">Schedule Check-in with Adobe Systems</div>' +
                '<div style="font-size: 14px; color: #64748b;">Health score dropped 5% - recommend proactive outreach</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; align-items: center; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">' +
                '<div style="margin-right: 12px;">📈</div>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">Upsell Opportunity: Microsoft Corp</div>' +
                '<div style="font-size: 14px; color: #64748b;">High feature usage indicates readiness for premium tier</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; align-items: center; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b;">' +
                '<div style="margin-right: 12px;">⏰</div>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">Contract Renewal: Salesforce Inc</div>' +
                '<div style="font-size: 14px; color: #64748b;">Contract expires in 45 days - initiate renewal conversation</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '</div>' +
                '</div>';
        }

        // Enterprise Customer Management Functions
        function manageEnterpriseAccounts() {
            showNotification('🏆 Opening enterprise account management...', 'info');
        }

        function viewEnterpriseProfile(company) {
            showNotification('👤 Opening enterprise profile for: ' + company, 'info');
        }

        function createEnterpriseReport(company) {
            showNotification('📊 Generating enterprise report for: ' + company, 'info');
        }

        function showContactHistoryModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Contact History</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="contact-timeline">' +
                '<div style="border-left: 3px solid #2563eb; padding-left: 16px; margin-bottom: 20px;">' +
                '<h4>📧 Email - Today 2:30 PM</h4>' +
                '<p>Follow-up on billing inquiry</p>' +
                '</div>' +
                '<div style="border-left: 3px solid #16a34a; padding-left: 16px; margin-bottom: 20px;">' +
                '<h4>📞 Phone Call - Yesterday 4:15 PM</h4>' +
                '<p>Technical support session - Issue resolved</p>' +
                '</div>' +
                '<div style="border-left: 3px solid #d97706; padding-left: 16px;">' +
                '<h4>💬 Live Chat - 2 days ago</h4>' +
                '<p>Initial contact about login problems</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showFeedbackModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Customer Feedback</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="feedback-summary" style="margin-bottom: 24px;">' +
                '<div class="stats-grid">' +
                '<div class="stat-card">' +
                '<div class="stat-title">Average Rating</div>' +
                '<div class="stat-value">4.8/5</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Total Reviews</div>' +
                '<div class="stat-value">156</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<h3>Recent Feedback</h3>' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<div style="display: flex; align-items: center; margin-bottom: 8px;">' +
                '<span style="color: #fbbf24;">⭐⭐⭐⭐⭐</span>' +
                '<span style="margin-left: 8px; font-weight: 500;">Sarah Chen handled my case perfectly!</span>' +
                '</div>' +
                '<p style="color: #64748b; font-size: 14px;">Quick response and very helpful solution.</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showSatisfactionModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Satisfaction Metrics</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="stats-grid">' +
                '<div class="stat-card">' +
                '<div class="stat-title">CSAT Score</div>' +
                '<div class="stat-value">96%</div>' +
                '<div class="stat-change positive">↗ +3% this month</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">NPS Score</div>' +
                '<div class="stat-value">72</div>' +
                '<div class="stat-change positive">↗ Excellent</div>' +
                '</div>' +
                '</div>' +
                '<h3>Satisfaction Trends</h3>' +
                '<p>Customer satisfaction has improved significantly with the new response time targets.</p>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showKnowledgeBaseModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Knowledge Base</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="display: flex; gap: 10px; margin-bottom: 20px;">' +
                '<input type="text" placeholder="Search articles..." style="flex: 1; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">' +
                '<button class="btn btn-primary">New Article</button>' +
                '</div>' +
                '<div class="article-categories">' +
                '<h3>Popular Articles</h3>' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<h4>How to Reset Your Password</h4>' +
                '<p style="color: #64748b;">Step-by-step guide for password recovery</p>' +
                '<span style="font-size: 12px; color: #9ca3af;">Viewed 245 times</span>' +
                '</div>' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">' +
                '<h4>Billing and Payment FAQ</h4>' +
                '<p style="color: #64748b;">Common questions about billing</p>' +
                '<span style="font-size: 12px; color: #9ca3af;">Viewed 189 times</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showFAQModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">FAQ Management</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<button class="btn btn-primary" style="margin-bottom: 20px;">Add New FAQ</button>' +
                '<div class="faq-list">' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<h4>Q: How do I update my account information?</h4>' +
                '<p style="color: #64748b; margin: 8px 0;">A: Navigate to Settings > Account > Edit Profile</p>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button style="background: #e2e8f0; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Edit</button>' +
                '<button style="background: #fecaca; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Delete</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showDocumentsModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Document Library</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="display: flex; gap: 10px; margin-bottom: 20px;">' +
                '<input type="file" style="flex: 1; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">' +
                '<button class="btn btn-primary">Upload</button>' +
                '</div>' +
                '<div class="document-list">' +
                '<div style="display: flex; align-items: center; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">' +
                '<span style="margin-right: 12px;">📄</span>' +
                '<div style="flex: 1;">' +
                '<h4>User Manual v2.1.pdf</h4>' +
                '<p style="color: #64748b; font-size: 12px;">Uploaded 2 days ago • 2.3 MB</p>' +
                '</div>' +
                '<button style="background: #e2e8f0; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Download</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showTemplatesModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">Email Templates</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<button class="btn btn-primary" style="margin-bottom: 20px;">Create Template</button>' +
                '<div class="template-list">' +
                '<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<h4>Welcome Email</h4>' +
                '<p style="color: #64748b;">Standard welcome message for new customers</p>' +
                '<div style="display: flex; gap: 8px; margin-top: 8px;">' +
                '<button style="background: #e2e8f0; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Edit</button>' +
                '<button style="background: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Use</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showTeamModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedTeamManagementHTML();
            document.body.appendChild(modal);
            initializeTeamManagement();
        }
        
        function generateAdvancedTeamManagementHTML() {
            return '<div class="modal-content" style="max-width: 1400px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">👥 Advanced Team Management & Roles</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; font-size: 24px;">&times;</button>' +
                '</div>' +
                
                '<!-- Tab Navigation -->' +
                '<div style="display: flex; border-bottom: 2px solid #e2e8f0; background: #f8fafc;">' +
                '<button class="team-tab-btn active" onclick="showTeamTab(&quot;members&quot;)" data-tab="members">Team Members</button>' +
                '<button class="team-tab-btn" onclick="showTeamTab(&quot;roles&quot;)" data-tab="roles">Role Management</button>' +
                '<button class="team-tab-btn" onclick="showTeamTab(&quot;permissions&quot;)" data-tab="permissions">Permissions Matrix</button>' +
                '<button class="team-tab-btn" onclick="showTeamTab(&quot;hierarchy&quot;)" data-tab="hierarchy">Team Hierarchy</button>' +
                '<button class="team-tab-btn" onclick="showTeamTab(&quot;performance&quot;)" data-tab="performance">Performance</button>' +
                '</div>' +
                
                '<div class="modal-body" style="padding: 24px;" id="teamContent">' +
                generateTeamMembersTab() +
                '</div>' +
                '</div>';
        }
        
        function generateTeamMembersTab() {
            return '<div class="team-tab-content active" id="membersTab">' +
                '<!-- Stats Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Total Team Members</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">24</div>' +
                '<div style="color: #10b981; font-size: 12px;">↗ +2 this month</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Currently Online</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">18</div>' +
                '<div style="color: #3b82f6; font-size: 12px;">75% availability</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Active Cases</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">142</div>' +
                '<div style="color: #f59e0b; font-size: 12px;">5.9 per agent avg</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Avg Response Time</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">1.8h</div>' +
                '<div style="color: #10b981; font-size: 12px;">↗ Improved 15%</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Actions Bar -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">' +
                '<div style="display: flex; gap: 12px;">' +
                '<button class="btn btn-primary" onclick="showAddTeamMemberModal()">➕ Add Team Member</button>' +
                '<button class="btn btn-secondary" onclick="showBulkActionsMenu()">📦 Bulk Actions</button>' +
                '<button class="btn btn-secondary" onclick="exportTeamData()">📤 Export</button>' +
                '</div>' +
                '<div style="display: flex; gap: 12px; align-items: center;">' +
                '<input type="text" placeholder="Search team members..." style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px;" onkeyup="filterTeamMembers(this.value)">' +
                '<select style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px;" onchange="filterByRole(this.value)">' +
                '<option value="">All Roles</option>' +
                '<option value="admin">Admin</option>' +
                '<option value="manager">Manager</option>' +
                '<option value="supervisor">Supervisor</option>' +
                '<option value="agent">Agent</option>' +
                '<option value="specialist">Specialist</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                
                '<!-- Team Members Grid -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;" id="teamMembersGrid">' +
                generateTeamMemberCards() +
                '</div>' +
                '</div>';
        }
        
        function generateTeamMemberCards() {
            const members = [
                { name: 'Sarah Johnson', role: 'Team Manager', status: 'online', cases: 3, performance: 98, avatar: 'SJ', color: '#8b5cf6', skills: ['Leadership', 'Escalations'], availability: 'Available' },
                { name: 'Michael Chen', role: 'Senior Supervisor', status: 'online', cases: 8, performance: 95, avatar: 'MC', color: '#3b82f6', skills: ['Technical', 'Training'], availability: 'In Meeting' },
                { name: 'Emily Rodriguez', role: 'Quality Specialist', status: 'online', cases: 5, performance: 97, avatar: 'ER', color: '#ec4899', skills: ['Quality', 'Compliance'], availability: 'Available' },
                { name: 'David Kim', role: 'Senior Agent', status: 'online', cases: 12, performance: 92, avatar: 'DK', color: '#10b981', skills: ['Billing', 'Technical'], availability: 'On Case' },
                { name: 'Lisa Anderson', role: 'Support Agent', status: 'away', cases: 10, performance: 88, avatar: 'LA', color: '#f59e0b', skills: ['Customer Service'], availability: 'Away' },
                { name: 'James Wilson', role: 'Technical Specialist', status: 'online', cases: 7, performance: 94, avatar: 'JW', color: '#06b6d4', skills: ['API', 'Integration'], availability: 'Available' }
            ];
            
            return members.map(member => 
                '<div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; position: relative; transition: all 0.3s ease; cursor: pointer;" onclick="showTeamMemberDetails(&quot;' + member.name + '&quot;)" onmouseover="this.style.transform=&quot;translateY(-2px)&quot;; this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.transform=&quot;&quot;; this.style.boxShadow=&quot;&quot;">' +
                '<!-- Status Indicator -->' +
                '<div style="position: absolute; top: 16px; right: 16px; width: 12px; height: 12px; background: ' + (member.status === 'online' ? '#10b981' : '#fbbf24') + '; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px ' + (member.status === 'online' ? '#dcfce7' : '#fef3c7') + ';"></div>' +
                
                '<!-- Member Info -->' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<div style="width: 48px; height: 48px; background: ' + member.color + '; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; margin-right: 12px;">' + member.avatar + '</div>' +
                '<div>' +
                '<h4 style="margin: 0; color: #1f2937;">' + member.name + '</h4>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">' + member.role + '</p>' +
                '</div>' +
                '</div>' +
                
                '<!-- Skills -->' +
                '<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">' +
                member.skills.map(skill => '<span style="background: #f3f4f6; color: #6b7280; padding: 4px 8px; border-radius: 6px; font-size: 12px;">' + skill + '</span>').join('') +
                '</div>' +
                
                '<!-- Stats -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px solid #f3f4f6;">' +
                '<div>' +
                '<div style="color: #6b7280; font-size: 12px;">Active Cases</div>' +
                '<div style="font-weight: 600; color: #1f2937;">' + member.cases + '</div>' +
                '</div>' +
                '<div>' +
                '<div style="color: #6b7280; font-size: 12px;">Performance</div>' +
                '<div style="font-weight: 600; color: ' + (member.performance >= 90 ? '#10b981' : '#f59e0b') + ';">' + member.performance + '%</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Availability -->' +
                '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f3f4f6;">' +
                '<span style="background: ' + (member.availability === 'Available' ? '#dcfce7' : member.availability === 'Away' ? '#fef3c7' : '#e0e7ff') + '; color: ' + (member.availability === 'Available' ? '#16a34a' : member.availability === 'Away' ? '#d97706' : '#4f46e5') + '; padding: 6px 12px; border-radius: 8px; font-size: 12px; display: inline-block; width: 100%; text-align: center;">' + member.availability + '</span>' +
                '</div>' +
                '</div>'
            ).join('');
        }

        function showSkillsModal() {
            showNotification('Skills & Training module coming soon', 'info');
        }

        function showWorkflowModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedWorkflowRulesHTML();
            document.body.appendChild(modal);
            initializeWorkflowRules();
        }
        
        function generateAdvancedWorkflowRulesHTML() {
            return '<div class="modal-content" style="max-width: 1400px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">⚙️ Advanced Workflow Rules Engine</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()" style="color: white; font-size: 24px;">&times;</button>' +
                '</div>' +
                
                '<!-- Tab Navigation -->' +
                '<div style="display: flex; border-bottom: 2px solid #e2e8f0; background: #f8fafc;">' +
                '<button class="workflow-tab-btn active" onclick="showWorkflowTab(&quot;rules&quot;)" data-tab="rules">Active Rules</button>' +
                '<button class="workflow-tab-btn" onclick="showWorkflowTab(&quot;builder&quot;)" data-tab="builder">Rule Builder</button>' +
                '<button class="workflow-tab-btn" onclick="showWorkflowTab(&quot;triggers&quot;)" data-tab="triggers">Triggers</button>' +
                '<button class="workflow-tab-btn" onclick="showWorkflowTab(&quot;actions&quot;)" data-tab="actions">Actions</button>' +
                '<button class="workflow-tab-btn" onclick="showWorkflowTab(&quot;history&quot;)" data-tab="history">Execution History</button>' +
                '</div>' +
                
                '<div class="modal-body" style="padding: 24px;" id="workflowContent">' +
                generateWorkflowRulesTab() +
                '</div>' +
                '</div>';
        }
        
        function generateWorkflowRulesTab() {
            return '<div class="workflow-tab-content active" id="rulesTab">' +
                '<!-- Stats Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Active Rules</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">28</div>' +
                '<div style="color: #10b981; font-size: 12px;">All functioning</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Rules Triggered Today</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">156</div>' +
                '<div style="color: #3b82f6; font-size: 12px;">↗ +23 from yesterday</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Automation Rate</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">72%</div>' +
                '<div style="color: #8b5cf6; font-size: 12px;">Of eligible cases</div>' +
                '</div>' +
                '<div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Time Saved</div>' +
                '<div style="font-size: 32px; font-weight: 700; color: #1f2937;">18.5h</div>' +
                '<div style="color: #10b981; font-size: 12px;">This week</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Actions Bar -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">' +
                '<div style="display: flex; gap: 12px;">' +
                '<button class="btn btn-primary" onclick="showCreateRuleModal()">➕ Create New Rule</button>' +
                '<button class="btn btn-secondary" onclick="importRules()">📥 Import Rules</button>' +
                '<button class="btn btn-secondary" onclick="exportRules()">📤 Export Rules</button>' +
                '</div>' +
                '<div style="display: flex; gap: 12px; align-items: center;">' +
                '<input type="text" placeholder="Search rules..." style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<select style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<option value="">All Categories</option>' +
                '<option value="assignment">Assignment Rules</option>' +
                '<option value="escalation">Escalation Rules</option>' +
                '<option value="notification">Notification Rules</option>' +
                '<option value="sla">SLA Rules</option>' +
                '<option value="routing">Routing Rules</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                
                '<!-- Active Rules List -->' +
                '<div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">' +
                generateWorkflowRulesList() +
                '</div>' +
                '</div>';
        }
        
        function generateWorkflowRulesList() {
            const rules = [
                { 
                    name: 'High Priority Auto-Assignment',
                    category: 'Assignment',
                    status: 'active',
                    trigger: 'Case Priority = High',
                    action: 'Assign to Senior Agent',
                    executions: 45,
                    lastTriggered: '2 hours ago',
                    color: '#ef4444'
                },
                {
                    name: 'VIP Customer Escalation',
                    category: 'Escalation',
                    status: 'active',
                    trigger: 'Customer Type = VIP & Wait Time > 30min',
                    action: 'Escalate to Manager',
                    executions: 12,
                    lastTriggered: '1 hour ago',
                    color: '#f59e0b'
                },
                {
                    name: 'SLA Breach Prevention',
                    category: 'SLA',
                    status: 'active',
                    trigger: 'Time to SLA < 1 hour',
                    action: 'Send Alert & Prioritize',
                    executions: 28,
                    lastTriggered: '30 mins ago',
                    color: '#8b5cf6'
                },
                {
                    name: 'Technical Issue Routing',
                    category: 'Routing',
                    status: 'active',
                    trigger: 'Category = Technical',
                    action: 'Route to Tech Team',
                    executions: 67,
                    lastTriggered: '15 mins ago',
                    color: '#3b82f6'
                },
                {
                    name: 'Customer Satisfaction Follow-up',
                    category: 'Notification',
                    status: 'active',
                    trigger: 'Case Resolved & Rating < 3',
                    action: 'Schedule Manager Callback',
                    executions: 8,
                    lastTriggered: '4 hours ago',
                    color: '#10b981'
                }
            ];
            
            return rules.map(rule =>
                '<div style="display: flex; align-items: center; padding: 20px; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f9fafb&quot;" onmouseout="this.style.background=&quot;&quot;">' +
                '<!-- Status Toggle -->' +
                '<div style="margin-right: 16px;">' +
                '<label style="position: relative; display: inline-block; width: 48px; height: 24px;">' +
                '<input type="checkbox" checked style="opacity: 0; width: 0; height: 0;">' +
                '<span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #10b981; transition: .4s; border-radius: 24px;">' +
                '<span style="position: absolute; content: &quot;&quot;; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; transform: translateX(24px);"></span>' +
                '</span>' +
                '</label>' +
                '</div>' +
                
                '<!-- Rule Info -->' +
                '<div style="flex: 1;">' +
                '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">' +
                '<h4 style="margin: 0; color: #1f2937;">' + rule.name + '</h4>' +
                '<span style="background: ' + rule.color + '20; color: ' + rule.color + '; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500;">' + rule.category + '</span>' +
                '</div>' +
                '<div style="display: flex; gap: 24px; color: #6b7280; font-size: 14px;">' +
                '<div><strong>Trigger:</strong> ' + rule.trigger + '</div>' +
                '<div><strong>Action:</strong> ' + rule.action + '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Stats -->' +
                '<div style="text-align: right; margin-right: 20px;">' +
                '<div style="font-size: 20px; font-weight: 600; color: #1f2937;">' + rule.executions + '</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Executions today</div>' +
                '<div style="color: #6b7280; font-size: 11px; margin-top: 4px;">' + rule.lastTriggered + '</div>' +
                '</div>' +
                
                '<!-- Actions -->' +
                '<div style="display: flex; gap: 8px;">' +
                '<button style="padding: 8px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer;" onclick="editWorkflowRule(&quot;' + rule.name + '&quot;)" title="Edit Rule">✏️</button>' +
                '<button style="padding: 8px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer;" onclick="duplicateWorkflowRule(&quot;' + rule.name + '&quot;)" title="Duplicate Rule">📋</button>' +
                '<button style="padding: 8px; background: #fee2e2; border: none; border-radius: 8px; cursor: pointer;" onclick="deleteWorkflowRule(&quot;' + rule.name + '&quot;)" title="Delete Rule">🗑️</button>' +
                '</div>' +
                '</div>'
            ).join('');
        }

        function showAutomationModal() {
            showNotification('Automation engine coming soon', 'info');
        }
        
        // Team Management Support Functions
        function initializeTeamManagement() {
            // Initialize team management features
            console.log('Team management initialized');
        }
        
        function showTeamTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.team-tab-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const content = document.getElementById('teamContent');
            switch(tabName) {
                case 'members':
                    content.innerHTML = generateTeamMembersTab();
                    break;
                case 'roles':
                    content.innerHTML = generateRolesManagementTab();
                    break;
                case 'permissions':
                    content.innerHTML = generatePermissionsMatrixTab();
                    break;
                case 'hierarchy':
                    content.innerHTML = generateTeamHierarchyTab();
                    break;
                case 'performance':
                    content.innerHTML = generatePerformanceTab();
                    break;
            }
        }
        
        function generateRolesManagementTab() {
            return '<div class="roles-tab-content">' +
                '<h3 style="margin-bottom: 20px;">Role Management & Permissions</h3>' +
                
                '<!-- Predefined Roles -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">' +
                
                '<div style="background: white; border-radius: 12px; border: 2px solid #8b5cf6; padding: 20px;">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 12px;">👑 Administrator</h4>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Full system access and control</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="font-weight: 600; margin-bottom: 8px;">Permissions:</div>' +
                '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #f3e8ff; color: #8b5cf6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">All Access</span>' +
                '<span style="background: #f3e8ff; color: #8b5cf6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">System Config</span>' +
                '<span style="background: #f3e8ff; color: #8b5cf6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">User Management</span>' +
                '</div>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 12px;">3 users assigned</div>' +
                '</div>' +
                
                '<div style="background: white; border-radius: 12px; border: 2px solid #3b82f6; padding: 20px;">' +
                '<h4 style="color: #3b82f6; margin-bottom: 12px;">👔 Manager</h4>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Team and escalation management</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="font-weight: 600; margin-bottom: 8px;">Permissions:</div>' +
                '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #dbeafe; color: #3b82f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Team Management</span>' +
                '<span style="background: #dbeafe; color: #3b82f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Reports</span>' +
                '<span style="background: #dbeafe; color: #3b82f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Escalations</span>' +
                '</div>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 12px;">5 users assigned</div>' +
                '</div>' +
                
                '<div style="background: white; border-radius: 12px; border: 2px solid #10b981; padding: 20px;">' +
                '<h4 style="color: #10b981; margin-bottom: 12px;">👨‍💼 Supervisor</h4>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Team lead and quality control</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="font-weight: 600; margin-bottom: 8px;">Permissions:</div>' +
                '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #d1fae5; color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Case Assignment</span>' +
                '<span style="background: #d1fae5; color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Quality Review</span>' +
                '<span style="background: #d1fae5; color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Team Stats</span>' +
                '</div>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 12px;">8 users assigned</div>' +
                '</div>' +
                
                '<div style="background: white; border-radius: 12px; border: 2px solid #f59e0b; padding: 20px;">' +
                '<h4 style="color: #f59e0b; margin-bottom: 12px;">🧑‍💻 Agent</h4>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Case handling and customer support</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="font-weight: 600; margin-bottom: 8px;">Permissions:</div>' +
                '<div style="display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #fed7aa; color: #f59e0b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Case Management</span>' +
                '<span style="background: #fed7aa; color: #f59e0b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Customer View</span>' +
                '<span style="background: #fed7aa; color: #f59e0b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Knowledge Base</span>' +
                '</div>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 12px;">12 users assigned</div>' +
                '</div>' +
                
                '</div>' +
                
                '<button class="btn btn-primary" style="margin-top: 20px;">➕ Create Custom Role</button>' +
                '</div>';
        }
        
        function generatePermissionsMatrixTab() {
            return '<div class="permissions-tab-content">' +
                '<h3 style="margin-bottom: 20px;">Permissions Matrix</h3>' +
                '<div style="background: white; border-radius: 12px; overflow: hidden;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc;">' +
                '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Permission</th>' +
                '<th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Admin</th>' +
                '<th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Manager</th>' +
                '<th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Supervisor</th>' +
                '<th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Agent</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">View Cases</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td></tr>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">Create Cases</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td></tr>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">Delete Cases</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td></tr>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">Manage Team</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td></tr>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">View Reports</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td></tr>' +
                '<tr><td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">System Settings</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">✅</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td><td style="text-align: center; border-bottom: 1px solid #f3f4f6;">❌</td></tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '</div>';
        }
        
        function generateTeamHierarchyTab() {
            return '<div class="hierarchy-tab-content">' +
                '<h3 style="margin-bottom: 20px;">Team Hierarchy</h3>' +
                '<div style="text-align: center;">Organizational structure visualization</div>' +
                '</div>';
        }
        
        function generatePerformanceTab() {
            return '<div class="performance-tab-content">' +
                '<h3 style="margin-bottom: 20px;">Team Performance Metrics</h3>' +
                '<div style="text-align: center;">Performance analytics and KPIs</div>' +
                '</div>';
        }
        
        // Workflow Rules Support Functions
        function initializeWorkflowRules() {
            console.log('Workflow rules initialized');
        }
        
        function showWorkflowTab(tabName) {
            document.querySelectorAll('.workflow-tab-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const content = document.getElementById('workflowContent');
            switch(tabName) {
                case 'rules':
                    content.innerHTML = generateWorkflowRulesTab();
                    break;
                case 'builder':
                    content.innerHTML = '<div style="padding: 40px; text-align: center;">Visual Rule Builder Interface</div>';
                    break;
                case 'triggers':
                    content.innerHTML = '<div style="padding: 40px; text-align: center;">Trigger Configuration</div>';
                    break;
                case 'actions':
                    content.innerHTML = '<div style="padding: 40px; text-align: center;">Action Templates</div>';
                    break;
                case 'history':
                    content.innerHTML = '<div style="padding: 40px; text-align: center;">Execution History & Logs</div>';
                    break;
            }
        }
        
        // Action handlers
        function showTeamMemberDetails(name) {
            showNotification('Opening details for ' + name, 'info');
        }
        
        function showAddTeamMemberModal() {
            showNotification('Add Team Member modal would open here', 'info');
        }
        
        function showBulkActionsMenu() {
            showNotification('Bulk actions menu', 'info');
        }
        
        function exportTeamData() {
            showNotification('Team data exported successfully', 'success');
        }
        
        function filterTeamMembers(query) {
            console.log('Filtering team members:', query);
        }
        
        function filterByRole(role) {
            console.log('Filtering by role:', role);
        }
        
        function showCreateRuleModal() {
            showNotification('Create Rule modal would open here', 'info');
        }
        
        function importRules() {
            showNotification('Import rules functionality', 'info');
        }
        
        function exportRules() {
            showNotification('Workflow rules exported successfully', 'success');
        }
        
        function editWorkflowRule(name) {
            showNotification('Editing rule: ' + name, 'info');
        }
        
        function duplicateWorkflowRule(name) {
            showNotification('Rule duplicated: ' + name, 'success');
        }
        
        function deleteWorkflowRule(name) {
            if (confirm('Are you sure you want to delete the rule: ' + name + '?')) {
                showNotification('Rule deleted: ' + name, 'success');
            }
        }

        function showSchedulingModal() {
            showNotification('Team scheduling module coming soon', 'info');
        }

        function showQualityModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedQualityHTML();
            document.body.appendChild(modal);
        }

        function generateAdvancedQualityHTML() {
            return '<div class="modal-content" style="max-width: 1400px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">✅ Advanced Quality Control & Assurance</h2>' +
                '<button class="modal-close" onclick="closeModal(this)">&times;</button>' +
                '</div>' +
                '<div class="modal-body" style="padding: 0;">' +
                '<div class="quality-container">' +
                '<div class="quality-header" style="padding: 24px; background: #fafafa; border-bottom: 1px solid #e5e7eb;">' +
                '<div class="quality-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div class="quality-stat-card" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Quality Score</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">94.8%</p>' +
                '</div>' +
                '<div class="quality-stat-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Cases Reviewed</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">1,247</p>' +
                '</div>' +
                '<div class="quality-stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Pending Reviews</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">23</p>' +
                '</div>' +
                '<div class="quality-stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Avg Response Quality</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">4.7/5</p>' +
                '</div>' +
                '<div class="quality-stat-card" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Failed Evaluations</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">12</p>' +
                '</div>' +
                '</div>' +
                '<div class="quality-tabs" style="display: flex; border-bottom: 1px solid #e5e7eb; background: white; border-radius: 8px; overflow: hidden;">' +
                '<button class="quality-tab-btn active" onclick="showQualityTab(&quot;dashboard&quot;)" data-tab="dashboard" style="flex: 1; padding: 16px; border: none; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; cursor: pointer; font-weight: 600; transition: all 0.3s;">📊 Dashboard</button>' +
                '<button class="quality-tab-btn" onclick="showQualityTab(&quot;evaluations&quot;)" data-tab="evaluations" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📋 Evaluations</button>' +
                '<button class="quality-tab-btn" onclick="showQualityTab(&quot;standards&quot;)" data-tab="standards" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">⚖️ Standards</button>' +
                '<button class="quality-tab-btn" onclick="showQualityTab(&quot;monitoring&quot;)" data-tab="monitoring" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📈 Monitoring</button>' +
                '<button class="quality-tab-btn" onclick="showQualityTab(&quot;improvement&quot;)" data-tab="improvement" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">🚀 Improvement</button>' +
                '</div>' +
                '</div>' +
                '<div class="quality-content" style="padding: 24px;" id="qualityContent">' +
                generateQualityDashboardContent() +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateQualityDashboardContent() {
            return '<div class="quality-dashboard">' +
                '<div class="quality-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                '<div class="quality-main-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">' +
                '<h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">⭐ Quality Evaluation Results</h3>' +
                '<div class="evaluation-list">' +
                '<div class="evaluation-item" style="display: flex; align-items: center; justify-content: between; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #059669; font-size: 14px; font-weight: 600;">Case #TK-2024-0891 - Sarah Johnson</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Excellent response quality, resolved within SLA</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 12px;">' +
                '<span style="color: #059669; font-size: 18px;">⭐⭐⭐⭐⭐</span>' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">5.0</span>' +
                '</div>' +
                '</div>' +
                '<div class="evaluation-item" style="display: flex; align-items: center; justify-content: between; padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #d97706; font-size: 14px; font-weight: 600;">Case #TK-2024-0890 - Mike Chen</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Good resolution, minor communication improvement needed</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 12px;">' +
                '<span style="color: #d97706; font-size: 18px;">⭐⭐⭐⭐☆</span>' +
                '<span style="background: #d97706; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">4.2</span>' +
                '</div>' +
                '</div>' +
                '<div class="evaluation-item" style="display: flex; align-items: center; justify-content: between; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #dc2626; font-size: 14px; font-weight: 600;">Case #TK-2024-0889 - Emma Davis</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Needs improvement: Delayed response, incomplete resolution</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 12px;">' +
                '<span style="color: #dc2626; font-size: 18px;">⭐⭐☆☆☆</span>' +
                '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">2.1</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="quality-metrics" style="margin-top: 24px; padding: 20px; background: #f8fafc; border-radius: 8px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">📊 Quality Metrics Overview</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">' +
                '<div class="metric-card" style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h5 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 500;">AVERAGE SCORE</h5>' +
                '<p style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">4.7</p>' +
                '</div>' +
                '<div class="metric-card" style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h5 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 500;">PASS RATE</h5>' +
                '<p style="margin: 0; color: #3b82f6; font-size: 24px; font-weight: 700;">89%</p>' +
                '</div>' +
                '<div class="metric-card" style="text-align: center; padding: 16px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h5 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; font-weight: 500;">IMPROVEMENT</h5>' +
                '<p style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">+12%</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="quality-sidebar">' +
                '<div class="quality-actions" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; margin-bottom: 20px;">' +
                '<h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">⚡ Quick Actions</h3>' +
                '<button class="action-btn" onclick="showNotification(&quot;Starting new quality evaluation...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 8px; cursor: pointer;">📝 New Evaluation</button>' +
                '<button class="action-btn" onclick="showNotification(&quot;Generating quality report...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 8px; cursor: pointer;">📊 Quality Report</button>' +
                '<button class="action-btn" onclick="showNotification(&quot;Setting quality standards...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">⚖️ Set Standards</button>' +
                '</div>' +
                '<div class="agent-performance" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">' +
                '<h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">👥 Agent Performance</h3>' +
                '<div class="agent-list">' +
                '<div class="agent-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">' +
                '<div style="display: flex; align-items: center;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #059669, #047857); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">' +
                '<span style="color: white; font-size: 14px; font-weight: 600;">SJ</span>' +
                '</div>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">Sarah Johnson</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">156 cases</p>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">4.9</p>' +
                '<span style="color: #059669; font-size: 12px;">⭐⭐⭐⭐⭐</span>' +
                '</div>' +
                '</div>' +
                '<div class="agent-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">' +
                '<div style="display: flex; align-items: center;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">' +
                '<span style="color: white; font-size: 14px; font-weight: 600;">MC</span>' +
                '</div>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">Mike Chen</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">142 cases</p>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<p style="margin: 0; color: #3b82f6; font-size: 14px; font-weight: 600;">4.5</p>' +
                '<span style="color: #3b82f6; font-size: 12px;">⭐⭐⭐⭐☆</span>' +
                '</div>' +
                '</div>' +
                '<div class="agent-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0;">' +
                '<div style="display: flex; align-items: center;">' +
                '<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">' +
                '<span style="color: white; font-size: 14px; font-weight: 600;">ED</span>' +
                '</div>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">Emma Davis</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">98 cases</p>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<p style="margin: 0; color: #f59e0b; font-size: 14px; font-weight: 600;">4.1</p>' +
                '<span style="color: #f59e0b; font-size: 12px;">⭐⭐⭐⭐☆</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showQualityTab(tabName) {
            document.querySelectorAll('.quality-tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#f8fafc';
                btn.style.color = '#64748b';
            });
            
            event.target.classList.add('active');
            event.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
            event.target.style.color = 'white';
            
            const content = document.getElementById('qualityContent');
            
            switch(tabName) {
                case 'dashboard':
                    content.innerHTML = generateQualityDashboardContent();
                    break;
                case 'evaluations':
                    content.innerHTML = generateQualityEvaluationsContent();
                    break;
                case 'standards':
                    content.innerHTML = generateQualityStandardsContent();
                    break;
                case 'monitoring':
                    content.innerHTML = generateQualityMonitoringContent();
                    break;
                case 'improvement':
                    content.innerHTML = generateQualityImprovementContent();
                    break;
            }
        }

        function generateQualityEvaluationsContent() {
            return '<div class="evaluations-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📋 Quality Evaluations</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Review and manage case quality evaluations.</p>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #059669; margin-bottom: 20px;">Recent Evaluations</h4>' +
                '<div style="border-bottom: 1px solid #f3f4f6; padding: 16px 0; margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                '<div style="flex: 1;">' +
                '<h5 style="margin: 0 0 8px 0; color: #1f2937;">Case #TK-2024-0891 - Customer Account Issue</h5>' +
                '<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">Agent: Sarah Johnson | Evaluated by: Quality Team</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Communication: Excellent | Resolution: Complete | Timeliness: Within SLA</p>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                '<span style="color: #059669;">⭐⭐⭐⭐⭐</span>' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">5.0</span>' +
                '</div>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Dec 15, 2024</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="border-bottom: 1px solid #f3f4f6; padding: 16px 0; margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                '<div style="flex: 1;">' +
                '<h5 style="margin: 0 0 8px 0; color: #1f2937;">Case #TK-2024-0890 - Technical Support</h5>' +
                '<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">Agent: Mike Chen | Evaluated by: Quality Team</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Communication: Good | Resolution: Complete | Timeliness: Minor delay</p>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                '<span style="color: #f59e0b;">⭐⭐⭐⭐☆</span>' +
                '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">4.2</span>' +
                '</div>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Dec 14, 2024</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateQualityStandardsContent() {
            return '<div class="standards-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚖️ Quality Standards</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Define and manage quality evaluation criteria.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #3b82f6; margin-bottom: 16px;">📞 Communication Standards</h4>' +
                '<ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">' +
                '<li style="margin-bottom: 8px;">Professional tone and language</li>' +
                '<li style="margin-bottom: 8px;">Clear and concise explanations</li>' +
                '<li style="margin-bottom: 8px;">Active listening demonstration</li>' +
                '<li>Proper grammar and spelling</li>' +
                '</ul>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #059669; margin-bottom: 16px;">✅ Resolution Standards</h4>' +
                '<ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">' +
                '<li style="margin-bottom: 8px;">Complete issue resolution</li>' +
                '<li style="margin-bottom: 8px;">Root cause identification</li>' +
                '<li style="margin-bottom: 8px;">Follow-up when necessary</li>' +
                '<li>Customer satisfaction confirmation</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateQualityMonitoringContent() {
            return '<div class="monitoring-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📈 Quality Monitoring</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Real-time quality metrics and monitoring dashboards.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 16px;">📊 Live Metrics</h4>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Average Quality Score</span>' +
                '<span style="color: #059669; font-weight: 600;">4.7/5</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Cases Evaluated Today</span>' +
                '<span style="color: #3b82f6; font-weight: 600;">12</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between;">' +
                '<span style="color: #6b7280; font-size: 14px;">Pass Rate</span>' +
                '<span style="color: #059669; font-weight: 600;">89%</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #dc2626; margin-bottom: 16px;">🚨 Quality Alerts</h4>' +
                '<div style="padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin-bottom: 8px;">' +
                '<p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 500;">Low Score Alert</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Emma Davis - Case #TK-2024-0889</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateQualityImprovementContent() {
            return '<div class="improvement-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🚀 Quality Improvement</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Identify improvement opportunities and track progress.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #f59e0b; margin-bottom: 16px;">📈 Improvement Areas</h4>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<span style="color: #1f2937; font-size: 14px;">Response Time</span>' +
                '<span style="color: #f59e0b; font-size: 12px;">Needs Improvement</span>' +
                '</div>' +
                '<div style="background: #fef3c7; height: 4px; border-radius: 2px;">' +
                '<div style="background: #f59e0b; width: 65%; height: 100%; border-radius: 2px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<span style="color: #1f2937; font-size: 14px;">Communication Quality</span>' +
                '<span style="color: #059669; font-size: 12px;">Good</span>' +
                '</div>' +
                '<div style="background: #dcfce7; height: 4px; border-radius: 2px;">' +
                '<div style="background: #059669; width: 85%; height: 100%; border-radius: 2px;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 16px;">🎯 Action Items</h4>' +
                '<div style="margin-bottom: 12px;">' +
                '<p style="margin: 0 0 4px 0; color: #1f2937; font-size: 14px; font-weight: 500;">Schedule training session</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Focus on response time optimization</p>' +
                '</div>' +
                '<div>' +
                '<p style="margin: 0 0 4px 0; color: #1f2937; font-size: 14px; font-weight: 500;">Review communication templates</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Update standard responses</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showComplianceModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedComplianceHTML();
            document.body.appendChild(modal);
        }

        function generateAdvancedComplianceHTML() {
            return '<div class="modal-content" style="max-width: 1400px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">🔒 Advanced Compliance Management</h2>' +
                '<button class="modal-close" onclick="closeModal(this)">&times;</button>' +
                '</div>' +
                '<div class="modal-body" style="padding: 0;">' +
                '<div class="compliance-container">' +
                '<div class="compliance-header" style="padding: 24px; background: #fafafa; border-bottom: 1px solid #e5e7eb;">' +
                '<div class="compliance-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div class="compliance-stat-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Overall Compliance</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">92.5%</p>' +
                '</div>' +
                '<div class="compliance-stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Active Regulations</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">14</p>' +
                '</div>' +
                '<div class="compliance-stat-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">Pending Reviews</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">7</p>' +
                '</div>' +
                '<div class="compliance-stat-card" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">' +
                '<h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; opacity: 0.9;">High Priority Issues</h3>' +
                '<p style="margin: 0; font-size: 28px; font-weight: 700; color: white;">2</p>' +
                '</div>' +
                '</div>' +
                '<div class="compliance-tabs" style="display: flex; border-bottom: 1px solid #e5e7eb; background: white; border-radius: 8px; overflow: hidden;">' +
                '<button class="compliance-tab-btn active" onclick="showComplianceTab(&quot;dashboard&quot;)" data-tab="dashboard" style="flex: 1; padding: 16px; border: none; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; cursor: pointer; font-weight: 600; transition: all 0.3s;">📊 Dashboard</button>' +
                '<button class="compliance-tab-btn" onclick="showComplianceTab(&quot;regulations&quot;)" data-tab="regulations" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📋 Regulations</button>' +
                '<button class="compliance-tab-btn" onclick="showComplianceTab(&quot;audits&quot;)" data-tab="audits" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">🔍 Audits</button>' +
                '<button class="compliance-tab-btn" onclick="showComplianceTab(&quot;policies&quot;)" data-tab="policies" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📝 Policies</button>' +
                '<button class="compliance-tab-btn" onclick="showComplianceTab(&quot;reports&quot;)" data-tab="reports" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📈 Reports</button>' +
                '</div>' +
                '</div>' +
                '<div class="compliance-content" style="padding: 24px;" id="complianceContent">' +
                generateComplianceDashboardContent() +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateComplianceDashboardContent() {
            return '<div class="compliance-dashboard">' +
                '<div class="compliance-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                '<div class="compliance-main-panel" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">' +
                '<h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">🚨 Critical Compliance Issues</h3>' +
                '<div class="issue-list">' +
                '<div class="issue-item" style="display: flex; align-items: center; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; margin-bottom: 12px;">' +
                '<span style="color: #dc2626; font-size: 20px; margin-right: 12px;">⚠️</span>' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #dc2626; font-size: 14px; font-weight: 600;">GDPR Data Retention Violation</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Customer data retained beyond 24-month policy</p>' +
                '</div>' +
                '<span style="color: #dc2626; font-size: 12px; font-weight: 500;">HIGH</span>' +
                '</div>' +
                '<div class="issue-item" style="display: flex; align-items: center; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; margin-bottom: 12px;">' +
                '<span style="color: #ea580c; font-size: 20px; margin-right: 12px;">⚡</span>' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #ea580c; font-size: 14px; font-weight: 600;">SOX Documentation Gap</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Missing approval signatures for financial cases</p>' +
                '</div>' +
                '<span style="color: #ea580c; font-size: 12px; font-weight: 500;">MEDIUM</span>' +
                '</div>' +
                '</div>' +
                '<div class="compliance-chart" style="margin-top: 24px; padding: 20px; background: #f8fafc; border-radius: 8px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">📈 Compliance Trend (Last 6 Months)</h4>' +
                '<div class="trend-bars" style="display: flex; align-items: end; gap: 8px; height: 120px;">' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 85%; background: linear-gradient(180deg, #10b981, #059669); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">Jan</span>' +
                '</div>' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 90%; background: linear-gradient(180deg, #10b981, #059669); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">Feb</span>' +
                '</div>' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 75%; background: linear-gradient(180deg, #f59e0b, #d97706); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">Mar</span>' +
                '</div>' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 95%; background: linear-gradient(180deg, #10b981, #059669); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">Apr</span>' +
                '</div>' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 88%; background: linear-gradient(180deg, #10b981, #059669); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">May</span>' +
                '</div>' +
                '<div class="trend-bar" style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                '<div style="width: 100%; height: 92%; background: linear-gradient(180deg, #10b981, #059669); border-radius: 4px 4px 0 0; margin-bottom: 8px;"></div>' +
                '<span style="font-size: 11px; color: #6b7280;">Jun</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="compliance-sidebar">' +
                '<div class="quick-actions" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; margin-bottom: 20px;">' +
                '<h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">⚡ Quick Actions</h3>' +
                '<button class="action-btn" onclick="showNotification(&quot;Generating compliance report...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 8px; cursor: pointer;">📊 Generate Report</button>' +
                '<button class="action-btn" onclick="showNotification(&quot;Starting new audit...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-weight: 500; margin-bottom: 8px; cursor: pointer;">🔍 Start Audit</button>' +
                '<button class="action-btn" onclick="showNotification(&quot;Reviewing policies...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">📝 Review Policies</button>' +
                '</div>' +
                '<div class="recent-activity" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">' +
                '<h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">🕒 Recent Activity</h3>' +
                '<div class="activity-list">' +
                '<div class="activity-item" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">' +
                '<span style="color: #10b981; font-size: 16px; margin-right: 12px;">✅</span>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">HIPAA Audit Completed</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">2 hours ago</p>' +
                '</div>' +
                '</div>' +
                '<div class="activity-item" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">' +
                '<span style="color: #f59e0b; font-size: 16px; margin-right: 12px;">⚠️</span>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">PCI DSS Review Flagged</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">4 hours ago</p>' +
                '</div>' +
                '</div>' +
                '<div class="activity-item" style="display: flex; align-items: center; padding: 12px 0;">' +
                '<span style="color: #3b82f6; font-size: 16px; margin-right: 12px;">📋</span>' +
                '<div>' +
                '<p style="margin: 0; color: #374151; font-size: 13px; font-weight: 500;">New Policy Updated</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">1 day ago</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showComplianceTab(tabName) {
            document.querySelectorAll('.compliance-tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#f8fafc';
                btn.style.color = '#64748b';
            });
            
            event.target.classList.add('active');
            event.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            event.target.style.color = 'white';
            
            const content = document.getElementById('complianceContent');
            
            switch(tabName) {
                case 'dashboard':
                    content.innerHTML = generateComplianceDashboardContent();
                    break;
                case 'regulations':
                    content.innerHTML = generateComplianceRegulationsContent();
                    break;
                case 'audits':
                    content.innerHTML = generateComplianceAuditsContent();
                    break;
                case 'policies':
                    content.innerHTML = generateCompliancePoliciesContent();
                    break;
                case 'reports':
                    content.innerHTML = generateComplianceReportsContent();
                    break;
            }
        }

        function generateComplianceRegulationsContent() {
            return '<div class="regulations-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📋 Regulatory Compliance Management</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Manage and track compliance with various regulations and standards.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #059669; margin-bottom: 12px;">✅ GDPR Compliance</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Status: Active | Score: 95%</p>' +
                '<p style="color: #6b7280; font-size: 12px;">Last Review: 2024-12-15</p>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #f59e0b; margin-bottom: 12px;">⚠️ SOX Compliance</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Status: Needs Review | Score: 78%</p>' +
                '<p style="color: #6b7280; font-size: 12px;">Last Review: 2024-11-28</p>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #059669; margin-bottom: 12px;">✅ HIPAA Compliance</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Status: Active | Score: 92%</p>' +
                '<p style="color: #6b7280; font-size: 12px;">Last Review: 2024-12-10</p>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #3b82f6; margin-bottom: 12px;">🔒 PCI DSS</h4>' +
                '<p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Status: Active | Score: 88%</p>' +
                '<p style="color: #6b7280; font-size: 12px;">Last Review: 2024-12-01</p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateComplianceAuditsContent() {
            return '<div class="audits-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔍 Audit Management</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Track and manage compliance audits and reviews.</p>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #3b82f6; margin-bottom: 16px;">Recent Audits</h4>' +
                '<div style="border-bottom: 1px solid #f3f4f6; padding: 16px 0;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div>' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">HIPAA Security Assessment</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Comprehensive security review</p>' +
                '</div>' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">PASSED</span>' +
                '</div>' +
                '<p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">Completed 2 days ago</p>' +
                '</div>' +
                '<div style="border-bottom: 1px solid #f3f4f6; padding: 16px 0;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div>' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">PCI DSS Compliance Review</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Payment processing standards</p>' +
                '</div>' +
                '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">PENDING</span>' +
                '</div>' +
                '<p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">In progress</p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateCompliancePoliciesContent() {
            return '<div class="policies-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📝 Policy Management</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Manage organizational policies and procedures.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 16px;">📋 Active Policies</h4>' +
                '<div style="space-y: 12px;">' +
                '<div style="padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 8px;">' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">Data Protection Policy</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Last updated: Dec 15, 2024</p>' +
                '</div>' +
                '<div style="padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 8px;">' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">Security Guidelines</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Last updated: Dec 10, 2024</p>' +
                '</div>' +
                '<div style="padding: 12px; background: #f8fafc; border-radius: 6px;">' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">Access Control Standards</p>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Last updated: Dec 5, 2024</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #dc2626; margin-bottom: 16px;">⚠️ Pending Reviews</h4>' +
                '<div style="padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin-bottom: 8px;">' +
                '<p style="margin: 0; color: #1f2937; font-weight: 500;">Incident Response Plan</p>' +
                '<p style="margin: 4px 0 0 0; color: #dc2626; font-size: 12px;">Review due: Dec 20, 2024</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateComplianceReportsContent() {
            return '<div class="reports-content">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📈 Compliance Reports</h3>' +
                '<p style="color: #6b7280; margin-bottom: 20px;">Generate and view compliance reports.</p>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<h4 style="color: #059669; margin-bottom: 20px;">📊 Available Reports</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">' +
                '<div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">' +
                '<h5 style="margin: 0 0 8px 0; color: #059669;">Monthly Compliance Summary</h5>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Overview of all compliance metrics</p>' +
                '<button onclick="showNotification(&quot;Generating monthly report...&quot;, &quot;info&quot;)" style="margin-top: 12px; padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Generate</button>' +
                '</div>' +
                '<div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">' +
                '<h5 style="margin: 0 0 8px 0; color: #3b82f6;">Audit Trail Report</h5>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Detailed audit activity log</p>' +
                '<button onclick="showNotification(&quot;Generating audit report...&quot;, &quot;info&quot;)" style="margin-top: 12px; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Generate</button>' +
                '</div>' +
                '<div style="padding: 16px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px;">' +
                '<h5 style="margin: 0 0 8px 0; color: #f59e0b;">Risk Assessment</h5>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Compliance risk analysis</p>' +
                '<button onclick="showNotification(&quot;Generating risk report...&quot;, &quot;info&quot;)" style="margin-top: 12px; padding: 6px 12px; background: #f59e0b; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Generate</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showAuditModal() {
            showNotification('Audit trails coming soon', 'info');
        }

        function showEmailModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'z-index: 10000;';
            modal.innerHTML = generateAdvancedEmailIntegrationHTML();
            document.body.appendChild(modal);
        }

        function generateAdvancedEmailIntegrationHTML() {
            return '<div class="modal-content" style="max-width: 1400px; width: 95vw; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border-radius: 12px 12px 0 0;">' +
                '<h2 class="modal-title" style="color: white; font-size: 24px;">📧 Advanced Email Integration & Routing</h2>' +
                '<button class="modal-close" onclick="closeModal(this)">&times;</button>' +
                '</div>' +
                '<div class="modal-body" style="padding: 0;">' +
                '<div class="email-container">' +
                '<div class="email-header" style="padding: 24px; background: #fafafa; border-bottom: 1px solid #e5e7eb;">' +
                '<div class="email-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div class="email-stat-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 18px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">' +
                '<h3 style="margin: 0 0 6px 0; color: white; font-size: 13px; opacity: 0.9;">Unread Emails</h3>' +
                '<p style="margin: 0; font-size: 26px; font-weight: 700; color: white;">43</p>' +
                '</div>' +
                '<div class="email-stat-card" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 18px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">' +
                '<h3 style="margin: 0 0 6px 0; color: white; font-size: 13px; opacity: 0.9;">High Priority</h3>' +
                '<p style="margin: 0; font-size: 26px; font-weight: 700; color: white;">7</p>' +
                '</div>' +
                '<div class="email-stat-card" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 18px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);">' +
                '<h3 style="margin: 0 0 6px 0; color: white; font-size: 13px; opacity: 0.9;">Auto-Routed</h3>' +
                '<p style="margin: 0; font-size: 26px; font-weight: 700; color: white;">156</p>' +
                '</div>' +
                '<div class="email-stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">' +
                '<h3 style="margin: 0 0 6px 0; color: white; font-size: 13px; opacity: 0.9;">Pending Review</h3>' +
                '<p style="margin: 0; font-size: 26px; font-weight: 700; color: white;">12</p>' +
                '</div>' +
                '<div class="email-stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 18px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);">' +
                '<h3 style="margin: 0 0 6px 0; color: white; font-size: 13px; opacity: 0.9;">Response Time</h3>' +
                '<p style="margin: 0; font-size: 26px; font-weight: 700; color: white;">2.4h</p>' +
                '</div>' +
                '</div>' +
                '<div class="email-tabs" style="display: flex; border-bottom: 1px solid #e5e7eb; background: white; border-radius: 8px; overflow: hidden;">' +
                '<button class="email-tab-btn active" onclick="showEmailTab(&quot;inbox&quot;)" data-tab="inbox" style="flex: 1; padding: 16px; border: none; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; cursor: pointer; font-weight: 600; transition: all 0.3s;">📥 Inbox</button>' +
                '<button class="email-tab-btn" onclick="showEmailTab(&quot;routing&quot;)" data-tab="routing" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">🔀 Routing Rules</button>' +
                '<button class="email-tab-btn" onclick="showEmailTab(&quot;priority&quot;)" data-tab="priority" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">⚡ Priority Detection</button>' +
                '<button class="email-tab-btn" onclick="showEmailTab(&quot;departments&quot;)" data-tab="departments" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">🏢 Departments</button>' +
                '<button class="email-tab-btn" onclick="showEmailTab(&quot;templates&quot;)" data-tab="templates" style="flex: 1; padding: 16px; border: none; background: #f8fafc; color: #64748b; cursor: pointer; font-weight: 600; transition: all 0.3s;">📝 Templates</button>' +
                '</div>' +
                '</div>' +
                '<div class="email-content" style="padding: 24px;" id="emailContent">' +
                generateEmailInboxContent() +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateEmailInboxContent() {
            return '<div class="email-inbox">' +
                '<div class="inbox-toolbar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">' +
                '<div class="inbox-filters" style="display: flex; gap: 12px;">' +
                '<button class="filter-btn active" onclick="filterEmails(&quot;all&quot;)" style="padding: 8px 16px; border: 1px solid #3b82f6; background: #3b82f6; color: white; border-radius: 6px; font-size: 12px; cursor: pointer;">All (43)</button>' +
                '<button class="filter-btn" onclick="filterEmails(&quot;high&quot;)" style="padding: 8px 16px; border: 1px solid #dc2626; background: white; color: #dc2626; border-radius: 6px; font-size: 12px; cursor: pointer;">High Priority (7)</button>' +
                '<button class="filter-btn" onclick="filterEmails(&quot;pending&quot;)" style="padding: 8px 16px; border: 1px solid #f59e0b; background: white; color: #f59e0b; border-radius: 6px; font-size: 12px; cursor: pointer;">Pending (12)</button>' +
                '</div>' +
                '<div class="inbox-actions" style="display: flex; gap: 8px;">' +
                '<button onclick="showNotification(&quot;Checking for new emails...&quot;, &quot;info&quot;)" style="padding: 8px 12px; background: #059669; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">🔄 Refresh</button>' +
                '<button onclick="showNotification(&quot;Configuring email settings...&quot;, &quot;info&quot;)" style="padding: 8px 12px; background: #6b7280; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">⚙️ Settings</button>' +
                '</div>' +
                '</div>' +
                '<div class="email-list">' +
                '<div class="email-item high-priority" style="background: white; border: 1px solid #e5e7eb; border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #dc2626; font-size: 16px; font-weight: 600;">🚨 URGENT: Server Downtime Issue</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;">From: support@criticalclient.com | To: tech-support@company.com</p>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">HIGH PRIORITY</span>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">2 min ago</p>' +
                '</div>' +
                '</div>' +
                '<p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">Our production server has been down for 15 minutes. Critical business operations are affected. Please escalate immediately.</p>' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div class="auto-routing" style="display: flex; align-items: center; gap: 8px;">' +
                '<span style="color: #059669; font-size: 12px; font-weight: 500;">🎯 Auto-routed to:</span>' +
                '<span style="background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Technical Support</span>' +
                '</div>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button onclick="showNotification(&quot;Creating case from email...&quot;, &quot;success&quot;)" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Create Case</button>' +
                '<button onclick="showNotification(&quot;Opening quick reply...&quot;, &quot;info&quot;)" style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Reply</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="email-item medium-priority" style="background: white; border: 1px solid #e5e7eb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #f59e0b; font-size: 16px; font-weight: 600;">⚡ Billing Inquiry - Account Update</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;">From: finance@clientcorp.com | To: billing@company.com</p>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">MEDIUM</span>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">15 min ago</p>' +
                '</div>' +
                '</div>' +
                '<p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">Need to update billing information for our enterprise account. Current payment method expires next month.</p>' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div class="auto-routing" style="display: flex; align-items: center; gap: 8px;">' +
                '<span style="color: #059669; font-size: 12px; font-weight: 500;">🎯 Auto-routed to:</span>' +
                '<span style="background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Billing Department</span>' +
                '</div>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button onclick="showNotification(&quot;Creating case from email...&quot;, &quot;success&quot;)" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Create Case</button>' +
                '<button onclick="showNotification(&quot;Opening quick reply...&quot;, &quot;info&quot;)" style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Reply</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="email-item low-priority" style="background: white; border: 1px solid #e5e7eb; border-left: 4px solid #059669; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">' +
                '<div style="flex: 1;">' +
                '<h4 style="margin: 0 0 4px 0; color: #059669; font-size: 16px; font-weight: 600;">📝 Feature Request - Dashboard Enhancement</h4>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;">From: product@startupinc.com | To: support@company.com</p>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">LOW</span>' +
                '<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">1 hour ago</p>' +
                '</div>' +
                '</div>' +
                '<p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; line-height: 1.5;">Would like to request additional filtering options in the main dashboard. Current setup works well but could use more granular controls.</p>' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div class="auto-routing" style="display: flex; align-items: center; gap: 8px;">' +
                '<span style="color: #059669; font-size: 12px; font-weight: 500;">🎯 Auto-routed to:</span>' +
                '<span style="background: #059669; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Product Support</span>' +
                '</div>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button onclick="showNotification(&quot;Creating case from email...&quot;, &quot;success&quot;)" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Create Case</button>' +
                '<button onclick="showNotification(&quot;Opening quick reply...&quot;, &quot;info&quot;)" style="padding: 6px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Reply</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showEmailTab(tabName) {
            document.querySelectorAll('.email-tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#f8fafc';
                btn.style.color = '#64748b';
            });
            
            event.target.classList.add('active');
            event.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            event.target.style.color = 'white';
            
            const content = document.getElementById('emailContent');
            
            switch(tabName) {
                case 'inbox':
                    content.innerHTML = generateEmailInboxContent();
                    break;
                case 'routing':
                    content.innerHTML = generateEmailRoutingContent();
                    break;
                case 'priority':
                    content.innerHTML = generateEmailPriorityContent();
                    break;
                case 'departments':
                    content.innerHTML = generateEmailDepartmentsContent();
                    break;
                case 'templates':
                    content.innerHTML = generateEmailTemplatesContent();
                    break;
            }
        }

        function filterEmails(filterType) {
            showNotification('Filtering emails by: ' + filterType, 'info');
        }

        function generateEmailRoutingContent() {
            return '<div class="email-routing">' +
                '<h3 style="color: #1f2937; margin-bottom: 24px;">🔀 Intelligent Email Routing Rules</h3>' +
                '<p style="color: #6b7280; margin-bottom: 24px;">Configure automatic email routing based on content, sender, keywords, and priority.</p>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">' +
                '<div class="routing-rules" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #3b82f6; margin-bottom: 20px;">📋 Active Routing Rules</h4>' +
                '<div class="rule-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
                '<h5 style="margin: 0; color: #1f2937; font-weight: 600;">Server/System Issues</h5>' +
                '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">HIGH PRIORITY</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Keywords:</strong> "server down", "system outage", "critical", "urgent", "production"</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Route to:</strong> Technical Support Team</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;"><strong>Auto-escalate:</strong> Yes (within 5 minutes)</p>' +
                '</div>' +
                '<div class="rule-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
                '<h5 style="margin: 0; color: #1f2937; font-weight: 600;">Billing & Payment</h5>' +
                '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">MEDIUM</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Keywords:</strong> "billing", "payment", "invoice", "subscription", "account"</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Route to:</strong> Billing Department</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;"><strong>Auto-escalate:</strong> After 24 hours</p>' +
                '</div>' +
                '<div class="rule-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f8fafc;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
                '<h5 style="margin: 0; color: #1f2937; font-weight: 600;">Feature Requests</h5>' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">LOW</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Keywords:</strong> "feature", "enhancement", "suggestion", "improvement"</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Route to:</strong> Product Support</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;"><strong>Auto-escalate:</strong> After 7 days</p>' +
                '</div>' +
                '</div>' +
                '<div class="routing-stats" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #059669; margin-bottom: 20px;">📊 Routing Statistics</h4>' +
                '<div class="stat-item" style="margin-bottom: 16px; padding: 12px; background: #f0fdf4; border-radius: 6px;">' +
                '<p style="margin: 0 0 4px 0; color: #1f2937; font-weight: 500;">Accuracy Rate</p>' +
                '<p style="margin: 0; color: #059669; font-size: 24px; font-weight: 700;">94.2%</p>' +
                '</div>' +
                '<div class="stat-item" style="margin-bottom: 16px; padding: 12px; background: #eff6ff; border-radius: 6px;">' +
                '<p style="margin: 0 0 4px 0; color: #1f2937; font-weight: 500;">Emails Routed Today</p>' +
                '<p style="margin: 0; color: #3b82f6; font-size: 24px; font-weight: 700;">156</p>' +
                '</div>' +
                '<div class="stat-item" style="padding: 12px; background: #fef3c7; border-radius: 6px;">' +
                '<p style="margin: 0 0 4px 0; color: #1f2937; font-weight: 500;">Avg Processing Time</p>' +
                '<p style="margin: 0; color: #f59e0b; font-size: 24px; font-weight: 700;">0.3s</p>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Creating new routing rule...&quot;, &quot;info&quot;)" style="width: 100%; margin-top: 20px; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">+ Add New Rule</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateEmailPriorityContent() {
            return '<div class="email-priority">' +
                '<h3 style="color: #1f2937; margin-bottom: 24px;">⚡ Intelligent Priority Detection</h3>' +
                '<p style="color: #6b7280; margin-bottom: 24px;">AI-powered system analyzes email content to automatically assign priority levels.</p>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">' +
                '<div class="priority-rules" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #dc2626; margin-bottom: 20px;">🚨 High Priority Indicators</h4>' +
                '<div class="priority-list">' +
                '<div style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: #fef2f2; border-radius: 6px;">' +
                '<span style="margin-right: 8px;">🔥</span>' +
                '<span style="color: #dc2626; font-weight: 500;">Urgent, Critical, Emergency</span>' +
                '</div>' +
                '<div style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: #fef2f2; border-radius: 6px;">' +
                '<span style="margin-right: 8px;">⚠️</span>' +
                '<span style="color: #dc2626; font-weight: 500;">System Down, Outage, Failure</span>' +
                '</div>' +
                '<div style="display: flex; align-items: center; margin-bottom: 12px; padding: 8px; background: #fef2f2; border-radius: 6px;">' +
                '<span style="margin-right: 8px;">💰</span>' +
                '<span style="color: #dc2626; font-weight: 500;">Security Breach, Data Loss</span>' +
                '</div>' +
                '<div style="display: flex; align-items: center; padding: 8px; background: #fef2f2; border-radius: 6px;">' +
                '<span style="margin-right: 8px;">👤</span>' +
                '<span style="color: #dc2626; font-weight: 500;">VIP Customer, Executive</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="priority-analytics" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #3b82f6; margin-bottom: 20px;">📈 Priority Analytics</h4>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">High Priority Emails</span>' +
                '<span style="color: #dc2626; font-weight: 600;">16.3%</span>' +
                '</div>' +
                '<div style="background: #fee2e2; height: 6px; border-radius: 3px;">' +
                '<div style="background: #dc2626; width: 16.3%; height: 100%; border-radius: 3px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Medium Priority</span>' +
                '<span style="color: #f59e0b; font-weight: 600;">42.1%</span>' +
                '</div>' +
                '<div style="background: #fef3c7; height: 6px; border-radius: 3px;">' +
                '<div style="background: #f59e0b; width: 42.1%; height: 100%; border-radius: 3px;"></div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Low Priority</span>' +
                '<span style="color: #059669; font-weight: 600;">41.6%</span>' +
                '</div>' +
                '<div style="background: #dcfce7; height: 6px; border-radius: 3px;">' +
                '<div style="background: #059669; width: 41.6%; height: 100%; border-radius: 3px;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="ai-training" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 20px;">🤖 AI Training & Accuracy</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">' +
                '<div style="text-align: center; padding: 16px; background: #faf5ff; border-radius: 8px;">' +
                '<p style="margin: 0 0 4px 0; color: #8b5cf6; font-size: 24px; font-weight: 700;">96.8%</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Accuracy Rate</p>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #f0f9ff; border-radius: 8px;">' +
                '<p style="margin: 0 0 4px 0; color: #3b82f6; font-size: 24px; font-weight: 700;">1,247</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Emails Analyzed</p>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px;">' +
                '<p style="margin: 0 0 4px 0; color: #059669; font-size: 24px; font-weight: 700;">2.1s</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 12px;">Avg Analysis Time</p>' +
                '</div>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Retraining AI model with latest data...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">🔄 Retrain AI Model</button>' +
                '</div>' +
                '</div>';
        }

        function generateEmailDepartmentsContent() {
            return '<div class="email-departments">' +
                '<h3 style="color: #1f2937; margin-bottom: 24px;">🏢 Department Routing Configuration</h3>' +
                '<p style="color: #6b7280; margin-bottom: 24px;">Manage department assignments and team routing preferences.</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">' +
                '<div class="department-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<span style="font-size: 24px; margin-right: 12px;">🔧</span>' +
                '<h4 style="margin: 0; color: #1f2937; font-weight: 600;">Technical Support</h4>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Team Members:</strong> 8 agents</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Current Load:</strong> 23 active cases</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Response SLA:</strong> 4 hours</p>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<span style="color: #1f2937; font-size: 14px; font-weight: 500;">Keywords:</span>' +
                '<div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">server</span>' +
                '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">outage</span>' +
                '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">critical</span>' +
                '<span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">urgent</span>' +
                '</div>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Configuring Technical Support routing...&quot;, &quot;info&quot;)" style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Configure</button>' +
                '</div>' +
                '<div class="department-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<span style="font-size: 24px; margin-right: 12px;">💰</span>' +
                '<h4 style="margin: 0; color: #1f2937; font-weight: 600;">Billing Department</h4>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Team Members:</strong> 5 agents</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Current Load:</strong> 12 active cases</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Response SLA:</strong> 24 hours</p>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<span style="color: #1f2937; font-size: 14px; font-weight: 500;">Keywords:</span>' +
                '<div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">billing</span>' +
                '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">payment</span>' +
                '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">invoice</span>' +
                '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">subscription</span>' +
                '</div>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Configuring Billing Department routing...&quot;, &quot;info&quot;)" style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Configure</button>' +
                '</div>' +
                '<div class="department-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">' +
                '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                '<span style="font-size: 24px; margin-right: 12px;">📦</span>' +
                '<h4 style="margin: 0; color: #1f2937; font-weight: 600;">Product Support</h4>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Team Members:</strong> 6 agents</p>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Current Load:</strong> 18 active cases</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Response SLA:</strong> 12 hours</p>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<span style="color: #1f2937; font-size: 14px; font-weight: 500;">Keywords:</span>' +
                '<div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">' +
                '<span style="background: #059669; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">feature</span>' +
                '<span style="background: #059669; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">enhancement</span>' +
                '<span style="background: #059669; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">suggestion</span>' +
                '<span style="background: #059669; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">improvement</span>' +
                '</div>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Configuring Product Support routing...&quot;, &quot;info&quot;)" style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Configure</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateEmailTemplatesContent() {
            return '<div class="email-templates">' +
                '<h3 style="color: #1f2937; margin-bottom: 24px;">📝 Email Response Templates</h3>' +
                '<p style="color: #6b7280; margin-bottom: 24px;">Manage automated responses and template library for consistent communication.</p>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">' +
                '<div class="template-list" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #3b82f6; margin-bottom: 20px;">📋 Available Templates</h4>' +
                '<div class="template-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<h5 style="margin: 0; color: #1f2937;">High Priority Acknowledgment</h5>' +
                '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;">URGENT</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">Auto-sent within 5 minutes for high priority emails</p>' +
                '<p style="margin: 0; color: #374151; font-size: 12px; font-style: italic;">"We have received your urgent request and our technical team is investigating immediately..."</p>' +
                '</div>' +
                '<div class="template-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<h5 style="margin: 0; color: #1f2937;">Billing Query Response</h5>' +
                '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;">STANDARD</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">Standard response for billing-related inquiries</p>' +
                '<p style="margin: 0; color: #374151; font-size: 12px; font-style: italic;">"Thank you for contacting our billing department. We will review your account and respond within 24 hours..."</p>' +
                '</div>' +
                '<div class="template-item" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<h5 style="margin: 0; color: #1f2937;">Feature Request Confirmation</h5>' +
                '<span style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;">LOW</span>' +
                '</div>' +
                '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">Confirmation for feature requests and suggestions</p>' +
                '<p style="margin: 0; color: #374151; font-size: 12px; font-style: italic;">"Thank you for your feature suggestion. Our product team will review and consider it for future updates..."</p>' +
                '</div>' +
                '</div>' +
                '<div class="template-stats" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #8b5cf6; margin-bottom: 20px;">📊 Template Performance</h4>' +
                '<div style="margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Auto-response Rate</span>' +
                '<span style="color: #059669; font-weight: 600;">87.3%</span>' +
                '</div>' +
                '<div style="background: #dcfce7; height: 6px; border-radius: 3px;">' +
                '<div style="background: #059669; width: 87.3%; height: 100%; border-radius: 3px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Customer Satisfaction</span>' +
                '<span style="color: #3b82f6; font-weight: 600;">4.6/5</span>' +
                '</div>' +
                '<div style="background: #dbeafe; height: 6px; border-radius: 3px;">' +
                '<div style="background: #3b82f6; width: 92%; height: 100%; border-radius: 3px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">' +
                '<div style="text-align: center; padding: 12px; background: #f0f9ff; border-radius: 6px;">' +
                '<p style="margin: 0 0 4px 0; color: #3b82f6; font-size: 20px; font-weight: 700;">342</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">Templates Sent</p>' +
                '</div>' +
                '<div style="text-align: center; padding: 12px; background: #f0fdf4; border-radius: 6px;">' +
                '<p style="margin: 0 0 4px 0; color: #059669; font-size: 20px; font-weight: 700;">1.8s</p>' +
                '<p style="margin: 0; color: #6b7280; font-size: 11px;">Avg Send Time</p>' +
                '</div>' +
                '</div>' +
                '<button onclick="showNotification(&quot;Creating new email template...&quot;, &quot;info&quot;)" style="width: 100%; padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">+ Create Template</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function showChatModal() {
            showNotification('Live chat module coming soon', 'info');
        }

        function showSocialModal() {
            showNotification('Social media integration coming soon', 'info');
        }

        function showNotificationsModal() {
            showNotification('Notification settings coming soon', 'info');
        }

        function showUserManagementModal() {
            showNotification('User management coming soon', 'info');
        }

        function showPermissionsModal() {
            showNotification('Permissions management coming soon', 'info');
        }

        function showSystemConfigModal() {
            showNotification('System configuration coming soon', 'info');
        }

        function showIntegrationsModal() {
            showNotification('Third-party integrations coming soon', 'info');
        }

        function showBackupModal() {
            showNotification('Backup & security settings coming soon', 'info');
        }

        // Advanced SLA System Functions
        function showSLAConfiguration() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="max-width: 1400px; width: 95vw;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">⚙️ Advanced SLA Rules Engine</h2>' +
                '<div style="display: flex; gap: 10px;">' +
                '<button class="btn btn-secondary" onclick="showSLATemplates()">📋 Templates</button>' +
                '<button class="btn btn-secondary" onclick="exportSLARules()">📤 Export Rules</button>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-body" style="max-height: 80vh; overflow-y: auto;">' +
                
                '<!-- Tab Navigation -->' +
                '<div style="display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 25px;">' +
                '<button class="sla-tab active" onclick="showSLATab(&quot;rules&quot;)" data-tab="rules">🎯 Rule Builder</button>' +
                '<button class="sla-tab" onclick="showSLATab(&quot;priority&quot;)" data-tab="priority">⚡ Priority Matrix</button>' +
                '<button class="sla-tab" onclick="showSLATab(&quot;conditions&quot;)" data-tab="conditions">🔧 Conditions</button>' +
                '<button class="sla-tab" onclick="showSLATab(&quot;escalation&quot;)" data-tab="escalation">🚨 Escalation</button>' +
                '<button class="sla-tab" onclick="showSLATab(&quot;schedule&quot;)" data-tab="schedule">📅 Schedule</button>' +
                '</div>' +
                
                '<!-- Rule Builder Tab -->' +
                '<div id="sla-rules-tab" class="sla-tab-content">' +
                '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">' +
                '<h3 style="margin: 0 0 10px 0; display: flex; align-items: center;"><span style="margin-right: 10px;">🎯</span>Visual SLA Rule Builder</h3>' +
                '<p style="margin: 0; opacity: 0.9;">Create sophisticated SLA rules with conditional logic and automated actions</p>' +
                '</div>' +
                
                '<!-- Active Rules List -->' +
                '<div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 25px;">' +
                '<div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">' +
                '<h4>📋 Active SLA Rules</h4>' +
                '<button class="btn btn-primary" onclick="createNewSLARule()">+ Create New Rule</button>' +
                '</div>' +
                '<div id="sla-rules-list">' +
                getSLARulesList() +
                '</div>' +
                '</div>' +
                
                '<!-- Rule Builder Interface -->' +
                '<div id="rule-builder-interface" style="display: none; background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px;">' +
                '<h4 style="margin-bottom: 20px; display: flex; align-items: center;"><span style="margin-right: 8px;">⚙️</span>Rule Configuration</h4>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">' +
                
                '<!-- Rule Basics -->' +
                '<div>' +
                '<div class="form-group">' +
                '<label><strong>Rule Name</strong></label>' +
                '<input type="text" id="rule-name" placeholder="e.g., VIP Customer Fast Track" style="width: 100%;">' +
                '</div>' +
                '<div class="form-group">' +
                '<label><strong>Rule Priority</strong></label>' +
                '<select id="rule-priority" style="width: 100%;">' +
                '<option value="1">🔴 Critical - Execute First</option>' +
                '<option value="2">🟡 High - Execute Second</option>' +
                '<option value="3">🟢 Normal - Standard Priority</option>' +
                '<option value="4">⚪ Low - Execute Last</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label><strong>Status</strong></label>' +
                '<div style="display: flex; gap: 15px;">' +
                '<label><input type="radio" name="rule-status" value="active" checked> ✅ Active</label>' +
                '<label><input type="radio" name="rule-status" value="inactive"> ❌ Inactive</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Targets -->' +
                '<div>' +
                '<div class="form-group">' +
                '<label><strong>Response Time (Minutes)</strong></label>' +
                '<input type="number" id="response-time" value="60" style="width: 100%;">' +
                '</div>' +
                '<div class="form-group">' +
                '<label><strong>Resolution Time (Hours)</strong></label>' +
                '<input type="number" id="resolution-time" value="24" style="width: 100%;">' +
                '</div>' +
                '<div class="form-group">' +
                '<label><strong>First Contact Resolution Target (%)</strong></label>' +
                '<input type="number" id="fcr-target" value="80" min="0" max="100" style="width: 100%;">' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Conditions Builder -->' +
                '<div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">' +
                '<h5 style="margin-bottom: 15px;">🔧 Rule Conditions (When this rule applies)</h5>' +
                '<div id="conditions-container">' +
                '<div class="condition-row" style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">' +
                '<select style="flex: 1;">' +
                '<option>Customer Tier</option>' +
                '<option>Case Category</option>' +
                '<option>Priority Level</option>' +
                '<option>Source Channel</option>' +
                '<option>Agent Team</option>' +
                '<option>Business Hours</option>' +
                '<option>Custom Field</option>' +
                '</select>' +
                '<select style="flex: 1;">' +
                '<option>Equals</option>' +
                '<option>Not Equals</option>' +
                '<option>Contains</option>' +
                '<option>Greater Than</option>' +
                '<option>Less Than</option>' +
                '</select>' +
                '<input type="text" placeholder="Value" style="flex: 1;">' +
                '<button class="btn btn-secondary" onclick="removeCondition(this)">×</button>' +
                '</div>' +
                '</div>' +
                '<button class="btn btn-secondary" onclick="addCondition()">+ Add Condition</button>' +
                '</div>' +
                
                '<!-- Actions Builder -->' +
                '<div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">' +
                '<h5 style="margin-bottom: 15px;">⚡ Automated Actions (What happens when conditions are met)</h5>' +
                '<div id="actions-container">' +
                '<div class="action-row" style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">' +
                '<select style="flex: 1;">' +
                '<option>Send Email Notification</option>' +
                '<option>Assign to Specific Agent</option>' +
                '<option>Escalate to Manager</option>' +
                '<option>Set Priority Level</option>' +
                '<option>Add Tags</option>' +
                '<option>Create Follow-up Task</option>' +
                '<option>Update Custom Field</option>' +
                '</select>' +
                '<input type="text" placeholder="Action details" style="flex: 2;">' +
                '<button class="btn btn-secondary" onclick="removeAction(this)">×</button>' +
                '</div>' +
                '</div>' +
                '<button class="btn btn-secondary" onclick="addAction()">+ Add Action</button>' +
                '</div>' +
                
                '<!-- Rule Preview -->' +
                '<div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 8px;">' +
                '<h5 style="margin-bottom: 10px;">👁️ Rule Preview</h5>' +
                '<div id="rule-preview" style="font-family: monospace; background: white; padding: 15px; border-radius: 6px; font-size: 14px;">' +
                'WHEN Customer Tier = VIP<br>' +
                'AND Priority Level ≥ High<br>' +
                'THEN Response Time = 15 minutes<br>' +
                'AND Resolution Time = 4 hours<br>' +
                'AND Send notification to manager@company.com' +
                '</div>' +
                '</div>' +
                
                '<div style="text-align: center; margin-top: 30px;">' +
                '<button class="btn btn-success" onclick="saveNewSLARule()">💾 Save Rule</button>' +
                '<button class="btn btn-secondary" onclick="cancelRuleBuilder()" style="margin-left: 10px;">Cancel</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Priority Matrix Tab -->' +
                '<div id="sla-priority-tab" class="sla-tab-content" style="display: none;">' +
                '<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">' +
                '<h3 style="margin: 0 0 10px 0; display: flex; align-items: center;"><span style="margin-right: 10px;">⚡</span>Priority-Based SLA Matrix</h3>' +
                '<p style="margin: 0; opacity: 0.9;">Configure SLA targets based on case priority and customer tier</p>' +
                '</div>' +
                getPriorityMatrixHTML() +
                '</div>' +
                
                '<!-- Conditions Tab -->' +
                '<div id="sla-conditions-tab" class="sla-tab-content" style="display: none;">' +
                '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">' +
                '<h3 style="margin: 0 0 10px 0; display: flex; align-items: center;"><span style="margin-right: 10px;">🔧</span>Advanced Conditions</h3>' +
                '<p style="margin: 0; opacity: 0.9;">Set up complex conditions and triggers for SLA rules</p>' +
                '</div>' +
                getAdvancedConditionsHTML() +
                '</div>' +
                
                '<!-- Escalation Tab -->' +
                '<div id="sla-escalation-tab" class="sla-tab-content" style="display: none;">' +
                '<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">' +
                '<h3 style="margin: 0 0 10px 0; display: flex; align-items: center;"><span style="margin-right: 10px;">🚨</span>Escalation Management</h3>' +
                '<p style="margin: 0; opacity: 0.9;">Configure automated escalation paths and notification chains</p>' +
                '</div>' +
                getEscalationHTML() +
                '</div>' +
                
                '<!-- Schedule Tab -->' +
                '<div id="sla-schedule-tab" class="sla-tab-content" style="display: none;">' +
                '<div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">' +
                '<h3 style="margin: 0 0 10px 0; display: flex; align-items: center;"><span style="margin-right: 10px;">📅</span>Business Schedule</h3>' +
                '<p style="margin: 0; opacity: 0.9;">Define business hours, holidays, and timezone configurations</p>' +
                '</div>' +
                getBusinessScheduleHTML() +
                '</div>' +
                
                '<div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e2e8f0; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 10px; padding: 30px;">' +
                '<button class="btn btn-success" onclick="saveSLAConfiguration()" style="padding: 12px 30px; font-size: 16px;">💾 Save All SLA Configuration</button>' +
                '<button class="btn btn-secondary" onclick="testSLARules()" style="margin-left: 15px;">🧪 Test Rules</button>' +
                '<button class="btn btn-info" onclick="previewSLAImpact()" style="margin-left: 15px;">👁️ Preview Impact</button>' +
                '</div>' +
                '</div>' +
                
                '<style>' +
                '.sla-tab { padding: 12px 20px; background: #f1f5f9; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: 500; margin-right: 5px; border-radius: 8px 8px 0 0; transition: all 0.3s ease; }' +
                '.sla-tab:hover { background: #e2e8f0; }' +
                '.sla-tab.active { background: white; border-bottom-color: #3b82f6; color: #3b82f6; font-weight: 600; }' +
                '.condition-row, .action-row { transition: all 0.3s ease; }' +
                '.condition-row:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }' +
                '.action-row:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }' +
                '</style>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showSLAReports() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="max-width: 1100px;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">📊 Advanced SLA Reports & Analytics</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                
                '<!-- Report Filters -->' +
                '<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">' +
                '<h3 style="margin-bottom: 15px;">📅 Report Filters</h3>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">' +
                '<div>' +
                '<label>Date Range</label>' +
                '<select style="width: 100%;">' +
                '<option>Last 7 days</option>' +
                '<option>Last 30 days</option>' +
                '<option>Last 90 days</option>' +
                '<option>Custom Range</option>' +
                '</select>' +
                '</div>' +
                '<div>' +
                '<label>Priority Filter</label>' +
                '<select style="width: 100%;">' +
                '<option>All Priorities</option>' +
                '<option>Critical Only</option>' +
                '<option>High Priority</option>' +
                '<option>Medium Priority</option>' +
                '</select>' +
                '</div>' +
                '<div>' +
                '<label>Agent/Team</label>' +
                '<select style="width: 100%;">' +
                '<option>All Agents</option>' +
                '<option>Technical Team</option>' +
                '<option>Billing Team</option>' +
                '<option>Customer Success</option>' +
                '</select>' +
                '</div>' +
                '<div style="display: flex; align-items: end;">' +
                '<button class="btn btn-primary" style="width: 100%;">Generate Report</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- SLA Performance Summary -->' +
                '<div class="stats-grid" style="margin-bottom: 25px;">' +
                '<div class="stat-card" style="background: linear-gradient(135deg, #10b981, #059669); color: white;">' +
                '<div class="stat-title">Overall SLA Compliance</div>' +
                '<div class="stat-value">92.4%</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">↗ +2.1% vs last period</div>' +
                '</div>' +
                '<div class="stat-card" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white;">' +
                '<div class="stat-title">Avg First Response</div>' +
                '<div class="stat-value">2.3h</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">Target: 4h</div>' +
                '</div>' +
                '<div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white;">' +
                '<div class="stat-title">Avg Resolution Time</div>' +
                '<div class="stat-value">18.7h</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">↓ -12% improvement</div>' +
                '</div>' +
                '<div class="stat-card" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white;">' +
                '<div class="stat-title">SLA Breaches</div>' +
                '<div class="stat-value">8</div>' +
                '<div class="stat-change" style="color: rgba(255,255,255,0.9);">↓ 60% reduction</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Detailed Performance Table -->' +
                '<h3 style="margin-bottom: 15px;">📈 Agent Performance Breakdown</h3>' +
                '<div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 12px; background: #f8fafc; font-weight: 500; border-bottom: 1px solid #e2e8f0;">' +
                '<div>Agent Name</div>' +
                '<div>Cases Handled</div>' +
                '<div>Avg Response</div>' +
                '<div>Avg Resolution</div>' +
                '<div>SLA Compliance</div>' +
                '<div>Breaches</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 12px; border-bottom: 1px solid #f1f5f9;">' +
                '<div><strong>Sarah Chen</strong><br><span style="font-size: 12px; color: #64748b;">Senior Agent</span></div>' +
                '<div>47</div>' +
                '<div style="color: #10b981;">1.2h</div>' +
                '<div style="color: #10b981;">14.3h</div>' +
                '<div style="color: #10b981;">98.1%</div>' +
                '<div style="color: #10b981;">0</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 12px; border-bottom: 1px solid #f1f5f9;">' +
                '<div><strong>Mike Rodriguez</strong><br><span style="font-size: 12px; color: #64748b;">Agent</span></div>' +
                '<div>38</div>' +
                '<div style="color: #f59e0b;">2.8h</div>' +
                '<div style="color: #10b981;">16.2h</div>' +
                '<div style="color: #f59e0b;">89.5%</div>' +
                '<div style="color: #f59e0b;">3</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; padding: 12px;">' +
                '<div><strong>Alex Thompson</strong><br><span style="font-size: 12px; color: #64748b;">Junior Agent</span></div>' +
                '<div>29</div>' +
                '<div style="color: #3b82f6;">3.1h</div>' +
                '<div style="color: #f59e0b;">28.7h</div>' +
                '<div style="color: #f59e0b;">86.2%</div>' +
                '<div style="color: #f59e0b;">5</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Export Options -->' +
                '<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">' +
                '<h3 style="margin-bottom: 15px;">📁 Export SLA Report</h3>' +
                '<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">' +
                '<button class="btn btn-primary" onclick="showNotification(&quot;PDF report generated&quot;, &quot;success&quot;)">📄 Export PDF</button>' +
                '<button class="btn btn-primary" onclick="showNotification(&quot;Excel report exported&quot;, &quot;success&quot;)">📊 Export Excel</button>' +
                '<button class="btn btn-primary" onclick="showNotification(&quot;CSV data exported&quot;, &quot;success&quot;)">📝 Export CSV</button>' +
                '<button class="btn btn-primary" onclick="showNotification(&quot;Email sent to stakeholders&quot;, &quot;success&quot;)">📧 Email Report</button>' +
                '</div>' +
                '</div>' +
                
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function showSLAEscalations() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="max-width: 900px;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">🚨 SLA Escalation Management</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                
                '<!-- Escalation Rules -->' +
                '<h3 style="margin-bottom: 15px; display: flex; align-items: center;"><span style="margin-right: 8px;">⚙️</span>Escalation Rules</h3>' +
                '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">' +
                '<div>' +
                '<div class="form-group">' +
                '<label>Critical Priority Escalation</label>' +
                '<select style="width: 100%;">' +
                '<option>Auto-escalate at 75% SLA</option>' +
                '<option>Auto-escalate at 90% SLA</option>' +
                '<option>Manual escalation only</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label>Escalation Path</label>' +
                '<select style="width: 100%;">' +
                '<option>Agent → Team Lead → Manager</option>' +
                '<option>Agent → Manager → Director</option>' +
                '<option>Custom escalation path</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="form-group">' +
                '<label>Notification Methods</label>' +
                '<div style="display: flex; flex-direction: column; gap: 5px;">' +
                '<label><input type="checkbox" checked> Email notifications</label>' +
                '<label><input type="checkbox" checked> In-app alerts</label>' +
                '<label><input type="checkbox"> SMS alerts</label>' +
                '<label><input type="checkbox"> Slack integration</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<button class="btn btn-primary">💾 Save Escalation Rules</button>' +
                '</div>' +
                
                '<!-- Active Escalations -->' +
                '<h3 style="margin-bottom: 15px; display: flex; align-items: center;"><span style="margin-right: 8px;">🔥</span>Active Escalations</h3>' +
                '<div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">' +
                
                '<div style="display: flex; align-items: center; padding: 16px; background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px;">' +
                '<span style="font-size: 24px; margin-right: 15px;">🚨</span>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 600; color: #991b1b; margin-bottom: 4px;">HIGH PRIORITY ESCALATION</div>' +
                '<div style="margin-bottom: 4px;"><strong>Case #2024-005:</strong> Critical system outage affecting 500+ users</div>' +
                '<div style="font-size: 14px; color: #7f1d1d;">Escalated to: Director of Operations • Time in escalation: 45 minutes</div>' +
                '</div>' +
                '<button style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Manage</button>' +
                '</div>' +
                
                '<div style="display: flex; align-items: center; padding: 16px; background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px;">' +
                '<span style="font-size: 24px; margin-right: 15px;">⚠️</span>' +
                '<div style="flex: 1;">' +
                '<div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">STANDARD ESCALATION</div>' +
                '<div style="margin-bottom: 4px;"><strong>Case #2024-007:</strong> Billing discrepancy for enterprise client</div>' +
                '<div style="font-size: 14px; color: #b45309;">Escalated to: Billing Team Lead • Time in escalation: 2 hours 15 minutes</div>' +
                '</div>' +
                '<button style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Manage</button>' +
                '</div>' +
                '</div>' +
                
                '<!-- Escalation History -->' +
                '<h3 style="margin-bottom: 15px; display: flex; align-items: center;"><span style="margin-right: 8px;">📊</span>Escalation Analytics (Last 30 Days)</h3>' +
                '<div class="stats-grid">' +
                '<div class="stat-card">' +
                '<div class="stat-title">Total Escalations</div>' +
                '<div class="stat-value">23</div>' +
                '<div class="stat-change negative">↗ +15% vs last month</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Avg Resolution After Escalation</div>' +
                '<div class="stat-value">4.2h</div>' +
                '<div class="stat-change positive">↓ 30% improvement</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Most Common Reason</div>' +
                '<div class="stat-value">SLA Breach Risk</div>' +
                '<div class="stat-change neutral">78% of escalations</div>' +
                '</div>' +
                '<div class="stat-card">' +
                '<div class="stat-title">Auto vs Manual</div>' +
                '<div class="stat-value">87% Auto</div>' +
                '<div class="stat-change positive">Smart automation working</div>' +
                '</div>' +
                '</div>' +
                
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        // Supporting functions for Advanced SLA Configuration
        function getSLARulesList() {
            return '<div class="rule-item" style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 10px; display: flex; justify-content: between; align-items: center;">' +
                '<div>' +
                '<div style="font-weight: 600; color: #374151;">VIP Customer Priority</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Response: 15 min | Resolution: 4 hours | Active</div>' +
                '</div>' +
                '<div style="display: flex; gap: 10px;">' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editSLARule(1)">✏️ Edit</button>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="toggleSLARule(1)">⏸️ Disable</button>' +
                '</div>' +
                '</div>' +
                
                '<div class="rule-item" style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 10px; display: flex; justify-content: between; align-items: center;">' +
                '<div>' +
                '<div style="font-weight: 600; color: #374151;">Critical System Issues</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Response: 30 min | Resolution: 8 hours | Active</div>' +
                '</div>' +
                '<div style="display: flex; gap: 10px;">' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editSLARule(2)">✏️ Edit</button>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="toggleSLARule(2)">⏸️ Disable</button>' +
                '</div>' +
                '</div>' +
                
                '<div class="rule-item" style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #6b7280; margin-bottom: 10px; display: flex; justify-content: between; align-items: center;">' +
                '<div>' +
                '<div style="font-weight: 600; color: #374151;">Standard Support Request</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Response: 2 hours | Resolution: 24 hours | Active</div>' +
                '</div>' +
                '<div style="display: flex; gap: 10px;">' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editSLARule(3)">✏️ Edit</button>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="toggleSLARule(3)">⏸️ Disable</button>' +
                '</div>' +
                '</div>';
        }

        function getPriorityMatrixHTML() {
            return '<div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">' +
                '<div style="overflow-x: auto;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc;">' +
                '<th style="padding: 15px; text-align: left; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Priority Level</th>' +
                '<th style="padding: 15px; text-align: center; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Response Time</th>' +
                '<th style="padding: 15px; text-align: center; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Resolution Time</th>' +
                '<th style="padding: 15px; text-align: center; font-weight: 600; border-bottom: 2px solid #e2e8f0;">First Contact Resolution</th>' +
                '<th style="padding: 15px; text-align: center; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Escalation Threshold</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr style="border-bottom: 1px solid #f1f5f9;">' +
                '<td style="padding: 15px;"><span style="color: #dc2626; font-weight: 600;">🔴 Critical</span></td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="15" style="width: 80px; text-align: center;"> min</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="4" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="90" style="width: 80px; text-align: center;"> %</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="75" style="width: 80px; text-align: center;"> %</td>' +
                '</tr>' +
                '<tr style="border-bottom: 1px solid #f1f5f9;">' +
                '<td style="padding: 15px;"><span style="color: #f59e0b; font-weight: 600;">🟡 High</span></td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="60" style="width: 80px; text-align: center;"> min</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="24" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="85" style="width: 80px; text-align: center;"> %</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="80" style="width: 80px; text-align: center;"> %</td>' +
                '</tr>' +
                '<tr style="border-bottom: 1px solid #f1f5f9;">' +
                '<td style="padding: 15px;"><span style="color: #10b981; font-weight: 600;">🟢 Medium</span></td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="4" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="72" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="80" style="width: 80px; text-align: center;"> %</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="85" style="width: 80px; text-align: center;"> %</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="padding: 15px;"><span style="color: #6b7280; font-weight: 600;">⚪ Low</span></td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="24" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="168" style="width: 80px; text-align: center;"> hrs</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="75" style="width: 80px; text-align: center;"> %</td>' +
                '<td style="padding: 15px; text-align: center;"><input type="number" value="90" style="width: 80px; text-align: center;"> %</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                
                '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">' +
                '<h4 style="margin-bottom: 15px;">🏆 Customer Tier Modifiers</h4>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">' +
                '<div style="background: #fef3c7; padding: 15px; border-radius: 8px;">' +
                '<h5 style="margin-bottom: 10px; color: #92400e;">👑 VIP Customers</h5>' +
                '<label style="display: block; margin-bottom: 8px;">Response Time Modifier:</label>' +
                '<select style="width: 100%;">' +
                '<option value="0.5">50% faster (0.5x)</option>' +
                '<option value="0.75">25% faster (0.75x)</option>' +
                '<option value="1.0">Standard (1.0x)</option>' +
                '</select>' +
                '</div>' +
                '<div style="background: #dbeafe; padding: 15px; border-radius: 8px;">' +
                '<h5 style="margin-bottom: 10px; color: #1e40af;">🥇 Premium Customers</h5>' +
                '<label style="display: block; margin-bottom: 8px;">Response Time Modifier:</label>' +
                '<select style="width: 100%;">' +
                '<option value="0.75">25% faster (0.75x)</option>' +
                '<option value="0.85">15% faster (0.85x)</option>' +
                '<option value="1.0">Standard (1.0x)</option>' +
                '</select>' +
                '</div>' +
                '<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">' +
                '<h5 style="margin-bottom: 10px; color: #374151;">👥 Standard Customers</h5>' +
                '<label style="display: block; margin-bottom: 8px;">Response Time Modifier:</label>' +
                '<select style="width: 100%;">' +
                '<option value="1.0" selected>Standard (1.0x)</option>' +
                '<option value="1.25">25% slower (1.25x)</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function getAdvancedConditionsHTML() {
            return '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">' +
                '<div>' +
                '<h4 style="margin-bottom: 20px;">🔧 Condition Types</h4>' +
                '<div class="condition-type-card" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 2px solid #e5e7eb; cursor: pointer;" onclick="selectConditionType(&quot;customer&quot;)">' +
                '<h5 style="margin-bottom: 8px; color: #3b82f6;">👤 Customer-based Conditions</h5>' +
                '<p style="color: #6b7280; font-size: 14px; margin: 0;">Customer tier, account value, region, industry</p>' +
                '</div>' +
                '<div class="condition-type-card" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 2px solid #e5e7eb; cursor: pointer;" onclick="selectConditionType(&quot;case&quot;)">' +
                '<h5 style="margin-bottom: 8px; color: #10b981;">📋 Case-based Conditions</h5>' +
                '<p style="color: #6b7280; font-size: 14px; margin: 0;">Priority, category, source channel, complexity</p>' +
                '</div>' +
                '<div class="condition-type-card" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 2px solid #e5e7eb; cursor: pointer;" onclick="selectConditionType(&quot;time&quot;)">' +
                '<h5 style="margin-bottom: 8px; color: #f59e0b;">⏰ Time-based Conditions</h5>' +
                '<p style="color: #6b7280; font-size: 14px; margin: 0;">Business hours, holidays, urgency timing</p>' +
                '</div>' +
                '<div class="condition-type-card" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border: 2px solid #e5e7eb; cursor: pointer;" onclick="selectConditionType(&quot;agent&quot;)">' +
                '<h5 style="margin-bottom: 8px; color: #8b5cf6;">👥 Agent/Team Conditions</h5>' +
                '<p style="color: #6b7280; font-size: 14px; margin: 0;">Team workload, skills, availability</p>' +
                '</div>' +
                '</div>' +
                
                '<div>' +
                '<h4 style="margin-bottom: 20px;">⚡ Condition Builder</h4>' +
                '<div style="background: #f8fafc; border-radius: 10px; padding: 20px;">' +
                '<div class="form-group">' +
                '<label><strong>IF Condition Group</strong></label>' +
                '<div style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 15px;">' +
                '<div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">' +
                '<select style="flex: 1;">' +
                '<option>Customer Tier</option>' +
                '<option>Case Priority</option>' +
                '<option>Source Channel</option>' +
                '</select>' +
                '<select style="flex: 1;">' +
                '<option>Equals</option>' +
                '<option>Not Equals</option>' +
                '<option>Contains</option>' +
                '</select>' +
                '<input type="text" placeholder="Value" style="flex: 1;">' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 14px;">' +
                '<button class="btn btn-secondary" style="font-size: 12px;">AND</button>' +
                '<button class="btn btn-secondary" style="font-size: 12px;">OR</button>' +
                '<span>Logic operator for next condition</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>THEN Action</strong></label>' +
                '<div style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 15px;">' +
                '<select style="width: 100%; margin-bottom: 10px;">' +
                '<option>Set Response Time</option>' +
                '<option>Set Resolution Time</option>' +
                '<option>Send Notification</option>' +
                '<option>Escalate Case</option>' +
                '<option>Assign to Team</option>' +
                '</select>' +
                '<input type="text" placeholder="Action value or details" style="width: 100%;">' +
                '</div>' +
                '</div>' +
                
                '<button class="btn btn-primary" style="width: 100%; margin-top: 15px;">+ Add Condition Group</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">' +
                '<h4 style="margin-bottom: 15px;">🧪 Condition Testing</h4>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">' +
                '<div>' +
                '<label><strong>Test Case Data</strong></label>' +
                '<textarea placeholder="Customer: VIP\\nPriority: High\\nCategory: Technical\\nSource: Email" style="width: 100%; height: 100px; font-family: monospace;"></textarea>' +
                '</div>' +
                '<div>' +
                '<label><strong>Expected SLA Result</strong></label>' +
                '<div id="test-result" style="background: #f3f4f6; padding: 15px; border-radius: 6px; height: 100px; font-family: monospace; color: #374151;">Click \\'Test Conditions\\' to see results</div>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: center; margin-top: 15px;">' +
                '<button class="btn btn-info" onclick="testSLAConditions()">🧪 Test Conditions</button>' +
                '</div>' +
                '</div>';
        }

        function getEscalationHTML() {
            return '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">' +
                '<div>' +
                '<h4 style="margin-bottom: 20px;">🚨 Escalation Paths</h4>' +
                '<div id="escalation-paths">' +
                '<div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ef4444;">' +
                '<div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">' +
                '<h5 style="margin: 0;">Level 1: Team Lead</h5>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editEscalationPath(1)">✏️ Edit</button>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Trigger: 75% of SLA time elapsed</div>' +
                '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
                '<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📧 Email</span>' +
                '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📱 SMS</span>' +
                '<span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 12px;">🔔 In-App</span>' +
                '</div>' +
                '</div>' +
                
                '<div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">' +
                '<div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">' +
                '<h5 style="margin: 0;">Level 2: Department Manager</h5>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editEscalationPath(2)">✏️ Edit</button>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Trigger: 90% of SLA time elapsed</div>' +
                '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
                '<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📧 Email</span>' +
                '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📱 SMS</span>' +
                '</div>' +
                '</div>' +
                
                '<div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #dc2626;">' +
                '<div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">' +
                '<h5 style="margin: 0;">Level 3: Executive Escalation</h5>' +
                '<button class="btn btn-secondary" style="padding: 5px 10px;" onclick="editEscalationPath(3)">✏️ Edit</button>' +
                '</div>' +
                '<div style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Trigger: SLA breach + 2 hours</div>' +
                '<div style="display: flex; gap: 10px; flex-wrap: wrap;">' +
                '<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📞 Phone</span>' +
                '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">📱 SMS</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<div style="text-align: center; margin-top: 20px;">' +
                '<button class="btn btn-primary" onclick="createEscalationPath()">+ Add Escalation Level</button>' +
                '</div>' +
                '</div>' +
                
                '<div>' +
                '<h4 style="margin-bottom: 20px;">⚙️ Escalation Settings</h4>' +
                '<div style="background: white; border-radius: 10px; padding: 20px;">' +
                '<div class="form-group">' +
                '<label><strong>Default Escalation Trigger</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>75% of SLA time elapsed</option>' +
                '<option>80% of SLA time elapsed</option>' +
                '<option>90% of SLA time elapsed</option>' +
                '<option>SLA breach occurred</option>' +
                '<option>Custom condition</option>' +
                '</select>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Escalation Frequency</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>Every 30 minutes</option>' +
                '<option>Every 1 hour</option>' +
                '<option>Every 2 hours</option>' +
                '<option>Every 4 hours</option>' +
                '<option>Only once</option>' +
                '</select>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Auto-assignment on Escalation</strong></label>' +
                '<div style="display: flex; gap: 15px;">' +
                '<label><input type="radio" name="auto-assign" value="yes" checked> ✅ Yes</label>' +
                '<label><input type="radio" name="auto-assign" value="no"> ❌ No</label>' +
                '</div>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Weekend/Holiday Escalation</strong></label>' +
                '<div style="margin-top: 10px;">' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox" checked> Escalate on weekends</label>' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox" checked> Escalate on holidays</label>' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox"> Use emergency contact list</label>' +
                '</div>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Notification Templates</strong></label>' +
                '<select style="width: 100%; margin-bottom: 10px;">' +
                '<option>Standard Escalation Template</option>' +
                '<option>Critical Issue Template</option>' +
                '<option>VIP Customer Template</option>' +
                '<option>Executive Briefing Template</option>' +
                '</select>' +
                '<button class="btn btn-secondary" style="width: 100%;">📝 Edit Templates</button>' +
                '</div>' +
                '</div>' +
                
                '<div style="background: #fef3c7; border-radius: 10px; padding: 20px; margin-top: 20px;">' +
                '<h5 style="margin-bottom: 10px;">⚠️ Escalation Analytics</h5>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">' +
                '<div>' +
                '<div style="font-size: 24px; font-weight: 600; color: #dc2626;">23</div>' +
                '<div style="font-size: 12px; color: #6b7280;">This Week</div>' +
                '</div>' +
                '<div>' +
                '<div style="font-size: 24px; font-weight: 600; color: #059669;">12%</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Escalation Rate</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function getBusinessScheduleHTML() {
            return '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">' +
                '<div>' +
                '<h4 style="margin-bottom: 20px;">📅 Business Hours</h4>' +
                '<div style="background: white; border-radius: 10px; padding: 20px;">' +
                '<div class="form-group">' +
                '<label><strong>Operating Schedule</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>24/7 Support</option>' +
                '<option>Business Hours (9 AM - 5 PM)</option>' +
                '<option>Extended Hours (7 AM - 10 PM)</option>' +
                '<option>Follow Sun (Always Business Hours Somewhere)</option>' +
                '<option>Custom Schedule</option>' +
                '</select>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Primary Timezone</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>UTC-8 (Pacific Time)</option>' +
                '<option>UTC-5 (Eastern Time)</option>' +
                '<option>UTC+0 (GMT/London)</option>' +
                '<option>UTC+1 (Central European)</option>' +
                '<option>UTC+8 (Singapore/Hong Kong)</option>' +
                '</select>' +
                '</div>' +
                
                '<h5 style="margin: 20px 0 10px 0;">Weekly Schedule</h5>' +
                '<div style="border: 1px solid #e5e7eb; border-radius: 6px;">' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600;">' +
                '<div>Day</div>' +
                '<div>Start Time</div>' +
                '<div>End Time</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Monday</div>' +
                '<div><input type="time" value="09:00" style="width: 100%;"></div>' +
                '<div><input type="time" value="17:00" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Tuesday</div>' +
                '<div><input type="time" value="09:00" style="width: 100%;"></div>' +
                '<div><input type="time" value="17:00" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Wednesday</div>' +
                '<div><input type="time" value="09:00" style="width: 100%;"></div>' +
                '<div><input type="time" value="17:00" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Thursday</div>' +
                '<div><input type="time" value="09:00" style="width: 100%;"></div>' +
                '<div><input type="time" value="17:00" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Friday</div>' +
                '<div><input type="time" value="09:00" style="width: 100%;"></div>' +
                '<div><input type="time" value="17:00" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px; border-bottom: 1px solid #f3f4f6;">' +
                '<div>Saturday</div>' +
                '<div><input type="time" value="" placeholder="Closed" style="width: 100%;"></div>' +
                '<div><input type="time" value="" placeholder="Closed" style="width: 100%;"></div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; padding: 10px;">' +
                '<div>Sunday</div>' +
                '<div><input type="time" value="" placeholder="Closed" style="width: 100%;"></div>' +
                '<div><input type="time" value="" placeholder="Closed" style="width: 100%;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<div>' +
                '<h4 style="margin-bottom: 20px;">🏖️ Holidays & Special Dates</h4>' +
                '<div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px;">' +
                '<div class="form-group">' +
                '<label><strong>Holiday Calendar</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>US Federal Holidays</option>' +
                '<option>UK Bank Holidays</option>' +
                '<option>Canadian Statutory Holidays</option>' +
                '<option>Custom Holiday List</option>' +
                '</select>' +
                '</div>' +
                
                '<h5 style="margin: 20px 0 10px 0;">Upcoming Holidays</h5>' +
                '<div style="max-height: 200px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 6px;">' +
                '<div style="padding: 10px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: between;">' +
                '<div>New Year\\'s Day</div>' +
                '<div style="color: #6b7280;">Jan 1, 2025</div>' +
                '</div>' +
                '<div style="padding: 10px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: between;">' +
                '<div>Martin Luther King Jr. Day</div>' +
                '<div style="color: #6b7280;">Jan 20, 2025</div>' +
                '</div>' +
                '<div style="padding: 10px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: between;">' +
                '<div>Presidents Day</div>' +
                '<div style="color: #6b7280;">Feb 17, 2025</div>' +
                '</div>' +
                '<div style="padding: 10px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: between;">' +
                '<div>Memorial Day</div>' +
                '<div style="color: #6b7280;">May 26, 2025</div>' +
                '</div>' +
                '</div>' +
                
                '<button class="btn btn-secondary" style="width: 100%; margin-top: 15px;">+ Add Custom Holiday</button>' +
                '</div>' +
                
                '<h4 style="margin: 30px 0 20px 0;">⏰ SLA Pause Settings</h4>' +
                '<div style="background: white; border-radius: 10px; padding: 20px;">' +
                '<div style="margin-bottom: 15px;">' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox" checked> Pause SLA during non-business hours</label>' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox" checked> Pause SLA during holidays</label>' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox"> Pause SLA during weekends</label>' +
                '<label style="display: block; margin-bottom: 5px;"><input type="checkbox"> Pause SLA for customer response wait time</label>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Grace Period After Business Hours</strong></label>' +
                '<select style="width: 100%;">' +
                '<option>No grace period</option>' +
                '<option>30 minutes</option>' +
                '<option>1 hour</option>' +
                '<option>2 hours</option>' +
                '</select>' +
                '</div>' +
                
                '<div class="form-group">' +
                '<label><strong>Critical Issue Override</strong></label>' +
                '<div style="display: flex; gap: 15px; margin-top: 5px;">' +
                '<label><input type="radio" name="critical-override" value="always" checked> Always apply SLA</label>' +
                '<label><input type="radio" name="critical-override" value="business"> Only business hours</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Tab switching function
        function showSLATab(tabName) {
            document.querySelectorAll('.sla-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.sla-tab-content').forEach(content => content.style.display = 'none');
            
            document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
            document.getElementById('sla-' + tabName + '-tab').style.display = 'block';
        }

        function createNewSLARule() {
            document.getElementById('rule-builder-interface').style.display = 'block';
            document.getElementById('rule-name').focus();
        }

        function cancelRuleBuilder() {
            document.getElementById('rule-builder-interface').style.display = 'none';
        }

        function addCondition() {
            const container = document.getElementById('conditions-container');
            const newCondition = document.createElement('div');
            newCondition.className = 'condition-row';
            newCondition.style.cssText = 'background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; gap: 10px; align-items: center;';
            newCondition.innerHTML = 
                '<select style="flex: 1;">' +
                '<option>Customer Tier</option>' +
                '<option>Case Category</option>' +
                '<option>Priority Level</option>' +
                '<option>Source Channel</option>' +
                '<option>Agent Team</option>' +
                '<option>Business Hours</option>' +
                '<option>Custom Field</option>' +
                '</select>' +
                '<select style="flex: 1;">' +
                '<option>Equals</option>' +
                '<option>Not Equals</option>' +
                '<option>Contains</option>' +
                '<option>Greater Than</option>' +
                '<option>Less Than</option>' +
                '</select>' +
                '<input type="text" placeholder="Value" style="flex: 1;">' +
                '<button class="btn btn-secondary" onclick="removeCondition(this)">×</button>';
            container.appendChild(newCondition);
        }

        function removeCondition(button) {
            button.closest('.condition-row').remove();
        }

        function addAction() {
            const container = document.getElementById('actions-container');
            const newAction = document.createElement('div');
            newAction.className = 'action-row';
            newAction.style.cssText = 'background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; gap: 10px; align-items: center;';
            newAction.innerHTML = 
                '<select style="flex: 1;">' +
                '<option>Send Email Notification</option>' +
                '<option>Assign to Specific Agent</option>' +
                '<option>Escalate to Manager</option>' +
                '<option>Set Priority Level</option>' +
                '<option>Add Tags</option>' +
                '<option>Create Follow-up Task</option>' +
                '<option>Update Custom Field</option>' +
                '</select>' +
                '<input type="text" placeholder="Action details" style="flex: 2;">' +
                '<button class="btn btn-secondary" onclick="removeAction(this)">×</button>';
            container.appendChild(newAction);
        }

        function removeAction(button) {
            button.closest('.action-row').remove();
        }

        function saveNewSLARule() {
            const ruleName = document.getElementById('rule-name').value;
            if (ruleName) {
                showNotification('SLA Rule "' + ruleName + '" saved successfully!', 'success');
                cancelRuleBuilder();
            } else {
                showNotification('Please enter a rule name', 'warning');
            }
        }

        function editSLARule(ruleId) {
            createNewSLARule();
            showNotification('Editing SLA rule ' + ruleId, 'info');
        }

        function toggleSLARule(ruleId) {
            showNotification('SLA rule ' + ruleId + ' has been disabled', 'info');
        }

        function testSLARules() {
            showNotification('Running SLA rules test... All rules validated successfully!', 'success');
        }

        function testSLAConditions() {
            const resultDiv = document.getElementById('test-result');
            if (resultDiv) {
                resultDiv.innerHTML = 'Rule: VIP Fast Track<br>Response: 15 minutes<br>Resolution: 4 hours<br>Escalation: Manager notify<br>✅ Conditions matched';
                resultDiv.style.background = '#ecfdf5';
                resultDiv.style.color = '#059669';
            }
        }

        function previewSLAImpact() {
            showNotification('Generating SLA impact analysis... This will affect 15 active cases', 'info');
        }

        function showSLATemplates() {
            showNotification('SLA rule templates available: Standard, VIP, Critical, Enterprise', 'info');
        }

        function exportSLARules() {
            showNotification('SLA rules exported to sla-configuration.json', 'success');
        }

        function selectConditionType(type) {
            showNotification('Selected condition type: ' + type, 'info');
        }

        function editEscalationPath(level) {
            showNotification('Editing escalation path level ' + level, 'info');
        }

        function createEscalationPath() {
            showNotification('Creating new escalation level', 'info');
        }

        function saveSLAConfiguration() {
            showNotification('Advanced SLA Rules Engine configuration saved successfully! All rules and settings updated.', 'success');
        }

        function exportSLAData() {
            showNotification('SLA data export initiated. Download will begin shortly.', 'success');
        }

        // Notification system
        function showNotification(message, type) {
            type = type || 'info';
            const notification = document.createElement('div');
            notification.className = 'notification ' + type;
            
            const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info';
            
            notification.innerHTML = 
                '<div class="notification-title">' + title + '</div>' +
                '<div class="notification-message">' + message + '</div>';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function initializePerformanceCharts() {
            const ctx = document.getElementById('performanceChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Resolution Rate', 'Response Time', 'Customer Rating', 'Case Load', 'SLA Compliance', 'First Contact Resolution'],
                        datasets: [{
                            label: 'Sarah Johnson',
                            data: [98, 85, 95, 75, 96, 89],
                            backgroundColor: 'rgba(5, 150, 105, 0.2)',
                            borderColor: '#059669',
                            borderWidth: 2
                        }, {
                            label: 'Mike Chen',
                            data: [94, 78, 88, 82, 87, 76],
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            borderColor: '#3b82f6',
                            borderWidth: 2
                        }, {
                            label: 'Emma Davis',
                            data: [91, 92, 85, 68, 92, 83],
                            backgroundColor: 'rgba(249, 158, 11, 0.2)',
                            borderColor: '#f59e0b',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            }
        }

        function initializeTrendsCharts() {
            // Monthly Trends Chart
            const ctx1 = document.getElementById('monthlyTrendsChart');
            if (ctx1) {
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                        datasets: [{
                            label: 'Total Cases',
                            data: [156, 189, 234, 298, 312],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }, {
                            label: 'Resolved Cases',
                            data: [142, 178, 221, 276, 294],
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }

            // Category Chart
            const ctx2 = document.getElementById('categoryChart');
            if (ctx2) {
                new Chart(ctx2, {
                    type: 'polarArea',
                    data: {
                        labels: ['Technical Support', 'Billing', 'Account Management', 'Product Features', 'Bug Reports', 'Other'],
                        datasets: [{
                            data: [145, 89, 67, 45, 34, 12],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(5, 150, 105, 0.8)',
                                'rgba(249, 158, 11, 0.8)',
                                'rgba(124, 58, 237, 0.8)',
                                'rgba(220, 38, 38, 0.8)',
                                'rgba(107, 114, 128, 0.8)'
                            ],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            }
        }

        // Export Functions
        function exportToPDF() {
            showNotification('🔄 Generating PDF report...', 'info');
            
            setTimeout(() => {
                // Simulate PDF generation
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,JVBERi0xLjMKJf////8';
                link.download = 'case-management-report.pdf';
                link.click();
                showNotification('📄 PDF report downloaded successfully!', 'success');
            }, 2000);
        }

        function exportToExcel() {
            showNotification('🔄 Generating Excel report...', 'info');
            
            setTimeout(() => {
                // Simulate Excel generation
                const csvContent = "data:text/csv;charset=utf-8," +
                    "Case ID,Title,Priority,Status,Agent,Created Date,Resolution Date\\n" +
                    "CASE-001,Login Issue,High,Resolved,Sarah Johnson,2025-01-01,2025-01-02\\n" +
                    "CASE-002,Billing Question,Medium,Open,Mike Chen,2025-01-03,\\n" +
                    "CASE-003,Feature Request,Low,In Progress,Emma Davis,2025-01-04,\\n";
                
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = 'case-management-data.csv';
                link.click();
                showNotification('📊 Excel report downloaded successfully!', 'success');
            }, 1500);
        }

        function exportToCSV() {
            showNotification('🔄 Generating CSV export...', 'info');
            
            setTimeout(() => {
                const csvContent = "data:text/csv;charset=utf-8," +
                    "Metric,Value,Period\\n" +
                    "Total Cases,847,January 2025\\n" +
                    "Resolution Rate,94.2%,January 2025\\n" +
                    "Avg Response Time,2.1 hours,January 2025\\n" +
                    "Customer Satisfaction,4.7 stars,January 2025\\n";
                
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = 'case-metrics-export.csv';
                link.click();
                showNotification('📋 CSV data exported successfully!', 'success');
            }, 1000);
        }

        function emailReport() {
            showNotification('📧 Opening email client with report...', 'info');
            
            const subject = encodeURIComponent('Case Management Report - January 2025');
            const body = encodeURIComponent('Please find the attached case management report for January 2025.\\n\\nKey Highlights:\\n• Total Cases: 847\\n• Resolution Rate: 94.2%\\n• Customer Satisfaction: 4.7★\\n\\nBest regards,\\nCase Management System');
            
            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
        }

        function scheduleReport() {
            showNotification('📅 Report scheduling configured successfully!', 'success');
        }

        function generateInstantReport() {
            showNotification('🔄 Generating instant report...', 'info');
            
            setTimeout(() => {
                showNotification('📊 Instant report generated! Check your downloads.', 'success');
            }, 2000);
        }

        function shareReport() {
            showNotification('📧 Report sharing link copied to clipboard!', 'success');
        }

        // Custom Report Builder Functions
        function generateCustomReport() {
            const reportType = document.getElementById('reportType')?.value || 'summary';
            const dateRange = document.getElementById('dateRange')?.value || '30d';
            
            showNotification('🔄 Generating custom report...', 'info');
            
            setTimeout(() => {
                const preview = document.getElementById('reportPreview');
                if (preview) {
                    preview.innerHTML = 
                        '<div style="padding: 20px; text-align: left;">' +
                        '<h3 style="margin-bottom: 16px; color: #059669;">📊 Custom Report Preview</h3>' +
                        '<div style="background: #f0fdf4; padding: 12px; border-radius: 8px; margin-bottom: 12px;">' +
                        '<strong>Report Type:</strong> ' + reportType.charAt(0).toUpperCase() + reportType.slice(1) +
                        '</div>' +
                        '<div style="background: #eff6ff; padding: 12px; border-radius: 8px; margin-bottom: 12px;">' +
                        '<strong>Date Range:</strong> ' + dateRange +
                        '</div>' +
                        '<div style="background: #fef3f2; padding: 12px; border-radius: 8px; margin-bottom: 12px;">' +
                        '<strong>Generated:</strong> ' + new Date().toLocaleString() +
                        '</div>' +
                        '<div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">' +
                        '<h4>Sample Data Preview:</h4>' +
                        '<p style="margin: 8px 0;">• Total Cases: 847</p>' +
                        '<p style="margin: 8px 0;">• Resolution Rate: 94.2%</p>' +
                        '<p style="margin: 8px 0;">• Avg Response Time: 2.1h</p>' +
                        '<p style="margin: 8px 0;">• Customer Satisfaction: 4.7★</p>' +
                        '</div>' +
                        '</div>';
                }
                showNotification('📊 Custom report preview generated!', 'success');
            }, 1500);
        }

        function saveReportTemplate() {
            showNotification('💾 Report template saved successfully!', 'success');
        }

        function loadTemplate(templateName) {
            showNotification('📚 Loading ' + templateName + ' template...', 'info');
            
            setTimeout(() => {
                showNotification('✅ ' + templateName.charAt(0).toUpperCase() + templateName.slice(1) + ' template loaded!', 'success');
            }, 500);
        }

        // Initialize app
        if (!currentUser) {
            showLogin();
        }
    </script>
</body>
</html>`;

// Server code remains the same
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            if (email === 'admin@example.com' && password === 'admin123') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Login successful',
                    user: mockUser,
                    token: 'demo-token-12345'
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/auth/me' && req.method === 'GET') {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.includes('Bearer')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ user: mockUser }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
        }
        return;
    }
    
    if (pathname === '/api/analytics/dashboard' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockStats));
        return;
    }
    
    if (pathname === '/api/analytics/trends' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockStats.trends));
        return;
    }
    
    if (pathname === '/api/analytics/breakdown' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockStats.breakdown));
        return;
    }
    
    if (pathname === '/api/analytics/agents' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockStats.agents));
        return;
    }
    
    if (pathname === '/api/analytics/sla' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockStats.sla));
        return;
    }
    
    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlTemplate);
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`
🚀 Professional CRM Case Management System

📱 Access: http://localhost:${PORT}
🔧 Health: http://localhost:${PORT}/health

👤 Demo Login:
   Email: admin@example.com  
   Password: admin123

✨ Features:
   ✓ Clean Apollo.io inspired design
   ✓ Professional CRM interface
   ✓ Organized sidebar navigation
   ✓ Dashboard with key metrics
   ✓ Create Case functionality
   ✓ Escalations management
   ✓ SLA tracking dashboard
   ✓ Modern notification system
   ✓ Responsive design

🎨 Design:
   ✓ Clean white interface
   ✓ Professional typography
   ✓ Subtle shadows and borders
   ✓ Business-focused color scheme
   ✓ Apollo.io style layout

🎯 Professional Case Management CRM
    `);
});