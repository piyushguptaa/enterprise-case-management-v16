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

// Global navigation variables
let currentView = 'dashboard';
let currentCustomerId = null;

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
        
        /* Rule Engine Tabs */
        .rule-tab {
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
        
        .rule-tab:hover {
            color: #334155;
            background: rgba(99, 102, 241, 0.1);
        }
        
        .rule-tab.active {
            color: #6366f1;
            border-bottom-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
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
        
        /* Team Member Dashboard Styles */
        #teamMemberApp {
            min-height: 100vh;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
        }
        
        #teamMemberApp .app-layout {
            display: flex;
            flex: 1;
            overflow: hidden;
        }
        
        #teamMemberApp .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
            height: 64px;
            display: flex;
            align-items: center;
            padding: 0 24px;
            position: relative;
            z-index: 100;
        }
        
        #teamMemberApp .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
        
        #teamMemberApp .logo h1 {
            color: white;
            font-size: 24px;
            margin: 0;
            font-weight: 700;
        }
        
        #teamMemberApp .header-profile {
            display: flex;
            align-items: center;
            gap: 24px;
        }
        
        #teamMemberApp .user-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        #teamMemberApp .user-details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        
        #teamMemberApp .user-name {
            color: white;
            font-size: 14px;
            font-weight: 600;
        }
        
        #teamMemberApp .user-role {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
        }
        
        #teamMemberApp .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
        }
        
        #teamMemberApp .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        
        #teamMemberApp .sidebar {
            width: 260px;
            background: white;
            border-right: 1px solid #e5e7eb;
            overflow-y: auto;
            flex-shrink: 0;
        }
        
        #teamMemberApp .sidebar-content {
            padding: 20px 0;
        }
        
        #teamMemberApp .nav-section {
            margin-bottom: 24px;
        }
        
        #teamMemberApp .nav-section-title {
            color: #6b7280;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0 20px;
            margin-bottom: 8px;
        }
        
        #teamMemberApp .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 20px;
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            color: #4b5563;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        
        #teamMemberApp .nav-item:hover {
            background: #f8fafc;
            color: #1f2937;
        }
        
        #teamMemberApp .nav-item.active {
            background: #eef2ff;
            color: #667eea;
            font-weight: 500;
        }
        
        #teamMemberApp .nav-icon {
            font-size: 18px;
        }
        
        #teamMemberApp .main-content {
            flex: 1;
            overflow-y: auto;
            background: #f8fafc;
        }
        
        #teamMemberApp .page-header {
            background: white;
            padding: 20px 32px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #teamMemberApp .page-title {
            color: #1f2937;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
        }
        
        #teamMemberApp .page-actions {
            display: flex;
            gap: 12px;
        }
        
        #teamMemberApp .content-wrapper {
            padding: 0;
        }
        
        #teamMemberApp .dashboard-content {
            min-height: calc(100vh - 144px);
        }
        
        #teamMemberApp .user-specialization {
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            margin-top: 2px;
        }
        
        #teamMemberApp .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            gap: 8px;
        }
        
        #teamMemberApp .btn-primary {
            background: #667eea;
            color: white;
        }
        
        #teamMemberApp .btn-primary:hover {
            background: #5a67d8;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        
        .team-dashboard {
            padding: 24px;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Team KPI Cards */
        .team-kpi-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .team-kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .team-kpi-card:hover::before {
            transform: scaleX(1);
        }
        
        .team-kpi-card:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        /* Team Charts */
        .team-chart-container {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .team-chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 2px solid #f3f4f6;
        }
        
        .team-chart-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Team Case Table */
        .team-case-table {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .team-case-table table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .team-case-table thead {
            background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
            border-bottom: 2px solid #e5e7eb;
        }
        
        .team-case-table th {
            text-align: left;
            padding: 16px;
            color: #475569;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .team-case-table tbody tr {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s ease;
        }
        
        .team-case-table tbody tr:hover {
            background-color: #f8fafc;
        }
        
        .team-case-table td {
            padding: 16px;
            color: #1f2937;
            font-size: 14px;
        }
        
        /* Priority Badges */
        .priority-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .priority-critical {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .priority-high {
            background: #fef3c7;
            color: #d97706;
        }
        
        .priority-medium {
            background: #dbeafe;
            color: #2563eb;
        }
        
        .priority-low {
            background: #dcfce7;
            color: #16a34a;
        }
        
        /* Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-new {
            background: #f0f9ff;
            color: #0369a1;
        }
        
        .status-in-progress {
            background: #fef3c7;
            color: #d97706;
        }
        
        .status-waiting {
            background: #f3e8ff;
            color: #9333ea;
        }
        
        .status-waiting-customer {
            background: #f3e8ff;
            color: #9333ea;
        }
        
        .status-escalated {
            background: #fee2e2;
            color: #dc2626;
        }
        
        /* Activity Timeline */
        .activity-timeline {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .activity-item {
            display: flex;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s ease;
        }
        
        .activity-item:hover {
            background-color: #f8fafc;
            margin: 0 -12px;
            padding: 12px;
        }
        
        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        
        .activity-content {
            flex: 1;
        }
        
        .activity-action {
            color: #1f2937;
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .activity-time {
            color: #6b7280;
            font-size: 12px;
        }
        
        /* Team Navigation Enhancement */
        #teamMemberApp .nav-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            transform: scaleX(0);
            transition: transform 0.2s ease;
        }
        
        #teamMemberApp .nav-item.active::before,
        #teamMemberApp .nav-item:hover::before {
            transform: scaleX(1);
        }
        
        /* Responsive Improvements */
        @media (max-width: 768px) {
            .team-dashboard {
                padding: 16px;
            }
            
            .team-kpi-card {
                padding: 16px;
            }
            
            .team-case-table {
                overflow-x: auto;
            }
            
            .team-case-table table {
                min-width: 600px;
            }
        }
        
        .customer-status.active { background: #dcfce7; color: #166534; }
        .customer-status.inactive { background: #fef2f2; color: #991b1b; }
        .customer-status.prospect { background: #fef3c7; color: #92400e; }
        .customer-status.churned { background: #f3f4f6; color: #374151; }
        
        /* Customer Profile Page Tabs */
        .profile-tab {
            padding: 16px 24px;
            background: none;
            border: none;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            font-size: 14px;
            margin-right: 8px;
        }
        
        .profile-tab:hover {
            color: #334155;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 8px 8px 0 0;
        }
        
        .profile-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 8px 8px 0 0;
        }
        
        /* Contact Cards */
        .contact-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .contact-card:hover {
            border-color: #6366f1;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
            transform: translateY(-2px);
        }
        
        .contact-type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .contact-type-badge.primary { background: #dbeafe; color: #1d4ed8; }
        .contact-type-badge.technical { background: #ecfdf5; color: #065f46; }
        .contact-type-badge.billing { background: #fef3c7; color: #92400e; }
        .contact-type-badge.executive { background: #fce7f3; color: #be185d; }
        
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
                        <div class="nav-section-title">Rule Engine & Automation</div>
                        <button class="nav-item" onclick="showRuleEngineModal()">
                            <span class="nav-icon">🔧</span>
                            Rule Engine
                        </button>
                        <button class="nav-item" onclick="showRulesLibraryModal()">
                            <span class="nav-icon">📋</span>
                            Rules Library
                        </button>
                        <button class="nav-item" onclick="showRuleExecutionModal()">
                            <span class="nav-icon">⚡</span>
                            Execution Monitor
                        </button>
                        <button class="nav-item" onclick="showAutomationModal()">
                            <span class="nav-icon">🤖</span>
                            Automation Hub
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

    <!-- Team Member Dashboard Application -->
    <div id="teamMemberApp" class="app-container hidden">
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <h1 style="color: #6366f1;">⚡ Team Dashboard</h1>
                </div>
                
                <div class="header-profile">
                    <div class="user-info">
                        <div class="user-details">
                            <div class="user-name" id="teamWelcomeText">Team Member</div>
                            <div class="user-role" id="teamDepartment">Customer Support</div>
                            <div class="user-specialization" id="teamSpecialization">General</div>
                        </div>
                    </div>
                    <button class="logout-btn" id="teamLogoutBtn">
                        <span>🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </header>

        <div class="app-layout">
            <nav class="sidebar" id="teamSidebar">
                <div class="sidebar-content">
                    <div class="nav-section">
                        <div class="nav-section-title">My Workspace</div>
                        <button class="nav-item active" onclick="showTeamDashboard()">
                            <span class="nav-icon">📊</span>
                            Dashboard
                        </button>
                        <button class="nav-item" onclick="showMyCases()">
                            <span class="nav-icon">📋</span>
                            My Cases
                        </button>
                        <button class="nav-item" onclick="showMyPerformance()">
                            <span class="nav-icon">📈</span>
                            Performance
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Case Management</div>
                        <button class="nav-item" onclick="showAssignedCases()">
                            <span class="nav-icon">🎯</span>
                            Assigned Cases
                        </button>
                        <button class="nav-item" onclick="showUrgentCases()">
                            <span class="nav-icon">🚨</span>
                            Urgent Cases
                        </button>
                        <button class="nav-item" onclick="showOverdueCases()">
                            <span class="nav-icon">⏰</span>
                            Overdue Cases
                        </button>
                        <button class="nav-item" onclick="showCompletedCases()">
                            <span class="nav-icon">✅</span>
                            Completed Cases
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Customer Support</div>
                        <button class="nav-item" onclick="showCustomerInteractions()">
                            <span class="nav-icon">👥</span>
                            Customer Interactions
                        </button>
                        <button class="nav-item" onclick="showKnowledgeBase()">
                            <span class="nav-icon">📚</span>
                            Knowledge Base
                        </button>
                        <button class="nav-item" onclick="showTicketTemplates()">
                            <span class="nav-icon">📝</span>
                            Quick Templates
                        </button>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Tools & Reports</div>
                        <button class="nav-item" onclick="showTimeTracking()">
                            <span class="nav-icon">⏱️</span>
                            Time Tracking
                        </button>
                        <button class="nav-item" onclick="showMyReports()">
                            <span class="nav-icon">📊</span>
                            My Reports
                        </button>
                        <button class="nav-item" onclick="showTeamCollaboration()">
                            <span class="nav-icon">🤝</span>
                            Team Collaboration
                        </button>
                    </div>
                </div>
            </nav>

            <main class="main-content">
                <div class="page-header">
                    <h1 class="page-title" id="teamPageTitle">Dashboard Overview</h1>
                    <div class="page-actions">
                        <button class="btn btn-primary" onclick="createNewCase()">
                            <span>➕</span>
                            New Case
                        </button>
                        <button class="btn" onclick="refreshTeamDashboard()">
                            <span>🔄</span>
                            Refresh
                        </button>
                    </div>
                </div>

                <div class="content-wrapper">
                    <div id="teamDashboardContent" class="dashboard-content">
                        <!-- Team member dashboard content will be loaded here -->
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
            const userRole = localStorage.getItem('userRole');
            if (token && token.startsWith('demo-token-')) {
                if (userRole === 'admin') {
                    currentUser = {
                        id: 1,
                        name: 'Admin User',
                        email: 'admin@example.com',
                        role: 'admin'
                    };
                    showMainApp();
                    loadStats();
                } else if (userRole === 'team_member') {
                    currentUser = {
                        id: 2,
                        name: 'Sarah Johnson',
                        email: 'team@example.com',
                        role: 'team_member',
                        department: 'Customer Support',
                        specialization: 'Technical Issues'
                    };
                    showTeamMemberApp();
                    loadTeamMemberData();
                }
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
                        const userData = authenticateUser(email, password);
                        if (userData) {
                            currentUser = userData;
                            localStorage.setItem('token', 'demo-token-' + Date.now());
                            localStorage.setItem('userRole', userData.role);
                            
                            if (userData.role === 'admin') {
                                showMainApp();
                                loadStats();
                            } else if (userData.role === 'team_member') {
                                showTeamMemberApp();
                                loadTeamMemberData();
                            }
                            
                            showNotification('Welcome back, ' + userData.name + '!', 'success');
                        } else {
                            showNotification('Invalid credentials. Try: admin@example.com/admin123 or team@example.com/team123', 'error');
                            if (loginBtn) {
                                loginBtn.textContent = 'Sign In';
                                loginBtn.disabled = false;
                            }
                        }
                    }, 1000);
                });
            }

            // Logout handlers
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    currentUser = null;
                    showLogin();
                });
            }

            const teamLogoutBtn = document.getElementById('teamLogoutBtn');
            if (teamLogoutBtn) {
                teamLogoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    currentUser = null;
                    showLogin();
                });
            }
        });


        // Show/hide pages
        function showLogin() {
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('teamMemberApp').classList.add('hidden');
        }

        function authenticateUser(email, password) {
            // Admin credentials
            if (email === 'admin@example.com' && password === 'admin123') {
                return {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin',
                    department: 'Management'
                };
            }
            
            // Team member credentials
            const teamMembers = [
                { email: 'team@example.com', password: 'team123', id: 2, name: 'Sarah Johnson', role: 'team_member', department: 'Customer Support', specialization: 'Technical Issues', level: 'Senior' },
                { email: 'agent1@example.com', password: 'agent123', id: 3, name: 'Michael Chen', role: 'team_member', department: 'Customer Support', specialization: 'Billing & Account', level: 'Junior' },
                { email: 'agent2@example.com', password: 'agent123', id: 4, name: 'Emily Rodriguez', role: 'team_member', department: 'Customer Support', specialization: 'General Inquiry', level: 'Senior' },
                { email: 'agent3@example.com', password: 'agent123', id: 5, name: 'David Kim', role: 'team_member', department: 'Customer Support', specialization: 'Escalations', level: 'Lead' },
                { email: 'agent4@example.com', password: 'agent123', id: 6, name: 'Lisa Anderson', role: 'team_member', department: 'Customer Support', specialization: 'Enterprise Accounts', level: 'Senior' }
            ];
            
            return teamMembers.find(member => member.email === email && member.password === password) || null;
        }

        function showMainApp() {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            document.getElementById('teamMemberApp').classList.add('hidden');
            if (currentUser) {
                document.getElementById('welcomeText').textContent = currentUser.name;
            }
        }

        function showTeamMemberApp() {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('teamMemberApp').classList.remove('hidden');
            if (currentUser) {
                document.getElementById('teamWelcomeText').textContent = currentUser.name;
                document.getElementById('teamDepartment').textContent = currentUser.department;
                document.getElementById('teamSpecialization').textContent = currentUser.specialization;
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

        // Team Member Dashboard Functions
        function loadTeamMemberData() {
            if (currentUser && currentUser.role === 'team_member') {
                showTeamDashboard();
                loadTeamStats();
            }
        }

        function loadTeamStats() {
            // Mock team member statistics based on user
            const teamStats = generateTeamMemberStats(currentUser);
            updateTeamDashboardStats(teamStats);
        }

        function showTeamDashboard() {
            document.getElementById('teamPageTitle').textContent = 'Dashboard Overview';
            document.getElementById('teamDashboardContent').innerHTML = generateTeamDashboardHTML();
            
            // Update active nav item
            const navItems = document.querySelectorAll('#teamSidebar .nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            navItems[0].classList.add('active');
        }

        function generateTeamDashboardHTML() {
            const teamData = generateTeamMemberStats(currentUser);
            
            return '<div class="team-dashboard">' +
                '<!-- Performance Overview -->' +
                '<div style="margin-bottom: 32px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">📊 My Performance Dashboard</h2>' +
                '<p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">Track your productivity, case resolution, and performance metrics</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="refreshTeamDashboard()" class="btn" style="background: #10b981; color: white;">🔄 Refresh</button>' +
                '<button onclick="exportTeamReport()" class="btn" style="background: #3b82f6; color: white;">📥 Export Report</button>' +
                '</div>' +
                '</div>' +

                '<!-- Key Metrics Cards -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">' +
                generateTeamKPICards(teamData.kpis) +
                '</div>' +
                '</div>' +

                '<!-- Case Assignment Overview -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">📋 My Case Portfolio</h3>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">' +
                '<div class="team-chart-container">' +
                '<div class="team-chart-header"><h4 class="team-chart-title">📈 Case Resolution Trends</h4></div>' +
                generateCaseResolutionChart(teamData.caseStats) +
                '</div>' +
                '<div class="team-chart-container">' +
                '<div class="team-chart-header"><h4 class="team-chart-title">🎯 Priority Distribution</h4></div>' +
                generatePriorityDistributionChart(teamData.priorities) +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Active Cases Table -->' +
                '<div style="margin-bottom: 32px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">🔄 Active Cases</h3>' +
                '<div style="display: flex; gap: 12px;">' +
                '<select id="priorityFilter" style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px;" onchange="filterCasesByPriority(this.value)">' +
                '<option value="">All Priorities</option>' +
                '<option value="critical">Critical</option>' +
                '<option value="high">High</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="low">Low</option>' +
                '</select>' +
                '<button onclick="viewAllCases()" class="btn btn-primary">📋 View All Cases</button>' +
                '</div>' +
                '</div>' +
                generateActiveCasesTable(teamData.activeCases) +
                '</div>' +

                '<!-- Performance Analytics -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div class="team-chart-container">' +
                '<div class="team-chart-header"><h4 class="team-chart-title">⏱️ Response Time Analytics</h4></div>' +
                generateResponseTimeChart(teamData.responseTime) +
                '</div>' +
                '<div class="team-chart-container">' +
                '<div class="team-chart-header"><h4 class="team-chart-title">😊 Customer Satisfaction</h4></div>' +
                generateSatisfactionChart(teamData.satisfaction) +
                '</div>' +
                '</div>' +

                '<!-- Recent Activity Timeline -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">📅 Recent Activity Timeline</h3>' +
                '<div class="activity-timeline">' +
                generateActivityTimeline(teamData.recentActivity) +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateTeamMemberStats(user) {
            return {
                kpis: {
                    assignedCases: { value: 47, trend: '+12%', status: 'up', description: 'Total assigned cases' },
                    resolvedToday: { value: 8, trend: '+25%', status: 'up', description: 'Cases resolved today' },
                    avgResponseTime: { value: '2.3h', trend: '-15%', status: 'down', description: 'Average first response time' },
                    customerSatisfaction: { value: '4.8/5', trend: '+0.2', status: 'up', description: 'Customer satisfaction rating' },
                    slaCompliance: { value: '96%', trend: '+3%', status: 'up', description: 'SLA compliance rate' },
                    hoursWorked: { value: '7.5h', trend: '', status: 'neutral', description: 'Hours worked today' }
                },
                caseStats: {
                    weekly: [
                        { day: 'Mon', resolved: 12, assigned: 15 },
                        { day: 'Tue', resolved: 10, assigned: 12 },
                        { day: 'Wed', resolved: 14, assigned: 16 },
                        { day: 'Thu', resolved: 11, assigned: 13 },
                        { day: 'Fri', resolved: 13, assigned: 14 },
                        { day: 'Sat', resolved: 8, assigned: 9 },
                        { day: 'Sun', resolved: 6, assigned: 7 }
                    ]
                },
                priorities: {
                    critical: 3,
                    high: 12,
                    medium: 24,
                    low: 8
                },
                activeCases: [
                    { id: 'CS-2024-1158', customer: 'TechCorp Solutions', subject: 'API Integration Issue', priority: 'high', created: '2 hours ago', due: 'Today 6:00 PM', status: 'in_progress' },
                    { id: 'CS-2024-1159', customer: 'Global Industries', subject: 'Billing Discrepancy', priority: 'medium', created: '4 hours ago', due: 'Tomorrow 10:00 AM', status: 'waiting_customer' },
                    { id: 'CS-2024-1160', customer: 'StartupHub', subject: 'Account Access Problem', priority: 'high', created: '1 hour ago', due: 'Today 4:00 PM', status: 'new' },
                    { id: 'CS-2024-1161', customer: 'Enterprise Co', subject: 'Feature Request', priority: 'low', created: '6 hours ago', due: 'Next Week', status: 'in_progress' },
                    { id: 'CS-2024-1162', customer: 'MegaCorp Ltd', subject: 'Performance Issues', priority: 'critical', created: '30 minutes ago', due: 'Today 2:00 PM', status: 'escalated' }
                ],
                responseTime: {
                    thisWeek: [2.1, 2.5, 1.8, 2.3, 2.0, 2.7, 2.4],
                    target: 2.0
                },
                satisfaction: {
                    thisMonth: [4.6, 4.7, 4.8, 4.5, 4.9, 4.8, 4.7, 4.8],
                    average: 4.8
                },
                recentActivity: [
                    { time: '10 minutes ago', action: 'Resolved case CS-2024-1157 for DataFlow Inc', type: 'resolution', icon: '✅' },
                    { time: '25 minutes ago', action: 'Updated case CS-2024-1158 with technical solution', type: 'update', icon: '📝' },
                    { time: '1 hour ago', action: 'Started working on case CS-2024-1160', type: 'assignment', icon: '🎯' },
                    { time: '2 hours ago', action: 'Customer call completed for CS-2024-1159', type: 'interaction', icon: '📞' },
                    { time: '3 hours ago', action: 'Escalated case CS-2024-1162 to senior team', type: 'escalation', icon: '🔺' }
                ]
            };
        }

        // Team Member Chart Generation Functions
        function generateTeamKPICards(kpis) {
            let html = '';
            const kpiList = [
                { key: 'assignedCases', title: 'Assigned Cases', icon: '📋', color: '#3b82f6' },
                { key: 'resolvedToday', title: 'Resolved Today', icon: '✅', color: '#10b981' },
                { key: 'avgResponseTime', title: 'Avg Response Time', icon: '⏱️', color: '#f59e0b' },
                { key: 'customerSatisfaction', title: 'Customer Satisfaction', icon: '😊', color: '#ec4899' },
                { key: 'slaCompliance', title: 'SLA Compliance', icon: '🎯', color: '#8b5cf6' },
                { key: 'hoursWorked', title: 'Hours Worked Today', icon: '⏰', color: '#06b6d4' }
            ];

            kpiList.forEach(kpi => {
                const data = kpis[kpi.key];
                const trendColor = data.status === 'up' ? '#10b981' : data.status === 'down' ? '#dc2626' : '#6b7280';
                const trendIcon = data.status === 'up' ? '↗' : data.status === 'down' ? '↘' : '→';

                html += '<div class="team-kpi-card">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">' +
                    '<div style="width: 48px; height: 48px; background: ' + kpi.color + '15; color: ' + kpi.color + '; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">' + kpi.icon + '</div>' +
                    (data.trend ? '<div style="text-align: right;"><div style="color: ' + trendColor + '; font-size: 14px; font-weight: 600; margin-bottom: 2px;">' + trendIcon + ' ' + data.trend + '</div></div>' : '') +
                    '</div>' +
                    '<h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">' + kpi.title + '</h4>' +
                    '<div style="font-size: 28px; font-weight: 800; color: #1f2937; margin-bottom: 4px;">' + data.value + '</div>' +
                    '<p style="color: #6b7280; font-size: 12px; margin: 0;">' + data.description + '</p>' +
                    '</div>';
            });

            return html;
        }

        function generateCaseResolutionChart(caseStats) {
            let html = '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
                '<div style="display: flex; gap: 16px; align-items: center;">' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #10b981; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Resolved</span></div>' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #3b82f6; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Assigned</span></div>' +
                '</div>' +
                '</div>';

            // Simple bar chart for case resolution
            html += '<div style="display: flex; align-items: end; gap: 8px; height: 200px; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">';
            
            const maxCases = Math.max(...caseStats.weekly.map(day => Math.max(day.resolved, day.assigned)));
            caseStats.weekly.forEach((day, index) => {
                const resolvedHeight = (day.resolved / maxCases) * 100;
                const assignedHeight = (day.assigned / maxCases) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="display: flex; gap: 4px; width: 100%;">' +
                    '<div style="width: 50%; background: #10b981; height: ' + resolvedHeight + '%; border-radius: 4px 4px 0 0; position: relative; margin-bottom: 8px;">' +
                    '<div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #10b981; font-weight: 500;">' + day.resolved + '</div>' +
                    '</div>' +
                    '<div style="width: 50%; background: #3b82f6; height: ' + assignedHeight + '%; border-radius: 4px 4px 0 0; position: relative; margin-bottom: 8px;">' +
                    '<div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #3b82f6; font-weight: 500;">' + day.assigned + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="font-size: 12px; color: #6b7280; margin-top: 8px;">' + day.day + '</div>' +
                    '</div>';
            });
            
            html += '</div></div>';
            return html;
        }

        function generatePriorityDistributionChart(priorities) {
            const total = Object.values(priorities).reduce((sum, val) => sum + val, 0);
            const colors = {
                critical: '#dc2626',
                high: '#f59e0b',
                medium: '#3b82f6',
                low: '#10b981'
            };

            let html = '<div style="margin-bottom: 16px;">';
            
            // Priority distribution bars
            Object.entries(priorities).forEach(([priority, count]) => {
                const percentage = (count / total * 100).toFixed(1);
                html += '<div style="margin-bottom: 12px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">' +
                    '<span style="color: #1f2937; font-size: 14px; text-transform: capitalize; font-weight: 500;">' + priority + '</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + count + ' cases (' + percentage + '%)</span>' +
                    '</div>' +
                    '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                    '<div style="width: ' + percentage + '%; height: 100%; background: ' + colors[priority] + '; border-radius: 4px;"></div>' +
                    '</div>' +
                    '</div>';
            });

            html += '</div>';
            return html;
        }

        function generateActiveCasesTable(activeCases) {
            const priorityIcons = {
                critical: '🔴',
                high: '🟡', 
                medium: '🔵',
                low: '🟢'
            };

            const statusIcons = {
                new: '🆕',
                in_progress: '⚡',
                waiting_customer: '⏳',
                escalated: '🔺'
            };

            let html = '<div class="team-case-table">' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Case ID</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Customer</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Subject</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Priority</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Status</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Due</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            activeCases.forEach(caseItem => {
                const priorityIcon = priorityIcons[caseItem.priority];
                const statusIcon = statusIcons[caseItem.status];
                const statusClass = 'status-' + caseItem.status.replace('_', '-');
                
                html += '<tr>' +
                    '<td>' + caseItem.id + '</td>' +
                    '<td>' + caseItem.customer + '</td>' +
                    '<td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="' + caseItem.subject + '">' + caseItem.subject + '</td>' +
                    '<td><span class="priority-badge priority-' + caseItem.priority + '">' + priorityIcon + ' ' + caseItem.priority.toUpperCase() + '</span></td>' +
                    '<td><span class="status-badge ' + statusClass + '">' + statusIcon + ' ' + caseItem.status.replace('_', ' ').toUpperCase() + '</span></td>' +
                    '<td style="color: #6b7280; font-size: 14px;">' + caseItem.due + '</td>' +
                    '<td><div style="display: flex; gap: 8px;"><button onclick="openCase(&quot;' + caseItem.id + '&quot;)" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">Open</button><button onclick="updateCase(&quot;' + caseItem.id + '&quot;)" class="btn" style="background: #10b981; color: white; padding: 6px 12px; font-size: 12px;">Update</button></div></td>' +
                    '</tr>';
            });

            html += '</tbody></table></div>';
            return html;
        }

        function generateResponseTimeChart(responseTime) {
            let html = '<div style="margin-bottom: 16px;">';
            
            // Response time trend
            html += '<div style="display: flex; align-items: end; gap: 8px; height: 150px; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">';
            
            const maxTime = Math.max(...responseTime.thisWeek, responseTime.target + 1);
            responseTime.thisWeek.forEach((time, index) => {
                const heightPercent = (time / maxTime) * 100;
                const color = time <= responseTime.target ? '#10b981' : '#f59e0b';
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="width: 80%; background: ' + color + '; height: ' + heightPercent + '%; border-radius: 4px 4px 0 0; position: relative; margin-bottom: 8px;">' +
                    '<div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: ' + color + '; font-weight: 500;">' + time + 'h</div>' +
                    '</div>' +
                    '<div style="font-size: 12px; color: #6b7280; margin-top: 8px;">' + days[index] + '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            html += '<div style="margin-top: 12px; padding: 8px; background: #f0fdf4; border-radius: 6px; font-size: 12px; color: #166534;">🎯 Target: ' + responseTime.target + 'h | Current Average: ' + (responseTime.thisWeek.reduce((a, b) => a + b) / responseTime.thisWeek.length).toFixed(1) + 'h</div>';
            html += '</div>';
            
            return html;
        }

        function generateSatisfactionChart(satisfaction) {
            let html = '<div style="margin-bottom: 16px;">';
            
            // Satisfaction trend
            html += '<div style="display: flex; align-items: end; gap: 6px; height: 120px; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">';
            
            satisfaction.thisMonth.forEach((score, index) => {
                const heightPercent = (score / 5) * 100;
                const color = score >= 4.5 ? '#10b981' : score >= 4.0 ? '#3b82f6' : '#f59e0b';
                
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="width: 80%; background: ' + color + '; height: ' + heightPercent + '%; border-radius: 4px 4px 0 0; position: relative; margin-bottom: 8px;">' +
                    '<div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 9px; color: ' + color + '; font-weight: 500;">' + score + '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            html += '<div style="margin-top: 12px; padding: 8px; background: #f0f9ff; border-radius: 6px; font-size: 12px; color: #1e40af;">⭐ Average Rating: ' + satisfaction.average + '/5.0 | Target: 4.5+</div>';
            html += '</div>';
            
            return html;
        }

        function generateActivityTimeline(recentActivity) {
            let html = '';
            
            recentActivity.forEach((activity, index) => {
                const typeColors = {
                    resolution: '#10b981',
                    update: '#3b82f6',
                    assignment: '#8b5cf6',
                    interaction: '#f59e0b',
                    escalation: '#dc2626'
                };
                
                html += '<div class="activity-item">' +
                    '<div class="activity-icon" style="background: ' + typeColors[activity.type] + '15; color: ' + typeColors[activity.type] + ';">' + activity.icon + '</div>' +
                    '<div class="activity-content">' +
                    '<p class="activity-action">' + activity.action + '</p>' +
                    '<p class="activity-time">' + activity.time + '</p>' +
                    '</div>' +
                    '</div>';
            });
            
            return html;
        }

        // Team Member Action Functions
        function refreshTeamDashboard() {
            showNotification('🔄 Dashboard refreshed successfully!', 'success');
            loadTeamMemberData();
        }

        function exportTeamReport() {
            showNotification('📥 Exporting team performance report...', 'success');
        }

        function filterCasesByPriority(priority) {
            showNotification('🔍 Filtering cases by priority: ' + (priority || 'All'), 'info');
        }

        function viewAllCases() {
            showNotification('📋 Opening full case management view...', 'info');
        }

        function openCase(caseId) {
            showNotification('📂 Opening case: ' + caseId, 'info');
        }

        function updateCase(caseId) {
            showNotification('✏️ Updating case: ' + caseId, 'info');
        }

        function updateTeamDashboardStats(stats) {
            // Update dashboard with fresh stats
            console.log('Team stats updated:', stats);
        }

        // Team Member Navigation Functions
        function showMyCases() {
            document.getElementById('teamPageTitle').textContent = 'My Cases';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">📋</div><h3 style="color: #1f2937; margin-bottom: 8px;">My Cases</h3><p>Comprehensive case management view coming soon...</p></div>';
            updateActiveNav('My Cases');
        }

        function showMyPerformance() {
            document.getElementById('teamPageTitle').textContent = 'Performance Analytics';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">📈</div><h3 style="color: #1f2937; margin-bottom: 8px;">Performance Analytics</h3><p>Detailed performance metrics and insights coming soon...</p></div>';
            updateActiveNav('Performance');
        }

        function showAssignedCases() {
            document.getElementById('teamPageTitle').textContent = 'Assigned Cases';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">🎯</div><h3 style="color: #1f2937; margin-bottom: 8px;">Assigned Cases</h3><p>All your assigned cases with advanced filtering coming soon...</p></div>';
            updateActiveNav('Assigned Cases');
        }

        function showUrgentCases() {
            document.getElementById('teamPageTitle').textContent = 'Urgent Cases';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">🚨</div><h3 style="color: #1f2937; margin-bottom: 8px;">Urgent Cases</h3><p>High priority and critical cases requiring immediate attention coming soon...</p></div>';
            updateActiveNav('Urgent Cases');
        }

        function showOverdueCases() {
            document.getElementById('teamPageTitle').textContent = 'Overdue Cases';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">⏰</div><h3 style="color: #1f2937; margin-bottom: 8px;">Overdue Cases</h3><p>Cases past their SLA deadlines coming soon...</p></div>';
            updateActiveNav('Overdue Cases');
        }

        function showCompletedCases() {
            document.getElementById('teamPageTitle').textContent = 'Completed Cases';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">✅</div><h3 style="color: #1f2937; margin-bottom: 8px;">Completed Cases</h3><p>Your successfully resolved cases and achievements coming soon...</p></div>';
            updateActiveNav('Completed Cases');
        }

        function showCustomerInteractions() {
            document.getElementById('teamPageTitle').textContent = 'Customer Interactions';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">👥</div><h3 style="color: #1f2937; margin-bottom: 8px;">Customer Interactions</h3><p>Communication history and customer relationship management coming soon...</p></div>';
            updateActiveNav('Customer Interactions');
        }

        function showKnowledgeBase() {
            document.getElementById('teamPageTitle').textContent = 'Knowledge Base';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">📚</div><h3 style="color: #1f2937; margin-bottom: 8px;">Knowledge Base</h3><p>Searchable knowledge articles and solutions coming soon...</p></div>';
            updateActiveNav('Knowledge Base');
        }

        function showTicketTemplates() {
            document.getElementById('teamPageTitle').textContent = 'Quick Templates';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">📝</div><h3 style="color: #1f2937; margin-bottom: 8px;">Quick Templates</h3><p>Pre-built response templates and shortcuts coming soon...</p></div>';
            updateActiveNav('Quick Templates');
        }

        function showTimeTracking() {
            document.getElementById('teamPageTitle').textContent = 'Time Tracking';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">⏱️</div><h3 style="color: #1f2937; margin-bottom: 8px;">Time Tracking</h3><p>Track time spent on cases and activities coming soon...</p></div>';
            updateActiveNav('Time Tracking');
        }

        function showMyReports() {
            document.getElementById('teamPageTitle').textContent = 'My Reports';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">📊</div><h3 style="color: #1f2937; margin-bottom: 8px;">My Reports</h3><p>Personal performance reports and analytics coming soon...</p></div>';
            updateActiveNav('My Reports');
        }

        function showTeamCollaboration() {
            document.getElementById('teamPageTitle').textContent = 'Team Collaboration';
            document.getElementById('teamDashboardContent').innerHTML = '<div style="text-align: center; padding: 60px 20px; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">🤝</div><h3 style="color: #1f2937; margin-bottom: 8px;">Team Collaboration</h3><p>Team communication and collaboration tools coming soon...</p></div>';
            updateActiveNav('Team Collaboration');
        }

        function updateActiveNav(activeSection) {
            // Update active navigation item
            const navItems = document.querySelectorAll('#teamSidebar .nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.textContent.trim().includes(activeSection) || (activeSection === 'Dashboard Overview' && item.textContent.trim().includes('Dashboard'))) {
                    item.classList.add('active');
                }
            });
        }

        function createNewCase() {
            showNotification('➕ Opening new case creation form...', 'info');
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
            // Show customers as a page instead of modal
            showCustomersPage();
        }

        function showCustomersPage() {
            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = '🏢 Customers';
            }
            
            // Replace dashboard content with customers page
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardContent) {
                dashboardContent.innerHTML = generateAdvancedCustomerPageHTML();
                initializeCustomerManagement();
            }
            
            currentView = 'customers';
        }

        function generateAdvancedCustomerPageHTML() {
            return '<div style="background: #f8fafc; margin: -20px; min-height: calc(100vh - 100px);">' +
                '<!-- Breadcrumbs -->' +
                '<div style="background: white; padding: 16px 32px; border-bottom: 1px solid #e5e7eb;">' +
                '<nav style="display: flex; align-items: center; gap: 8px; font-size: 14px;">' +
                '<a href="#" onclick="showDashboard(); return false;" style="color: #6b7280; text-decoration: none;">Dashboard</a>' +
                '<span style="color: #9ca3af;">›</span>' +
                '<span style="color: #1f2937; font-weight: 500;">Customers</span>' +
                '</nav>' +
                '</div>' +
                
                '<!-- Page Header -->' +
                '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 32px;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h2 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🏢 Customer Management Center</h2>' +
                '<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Enterprise CRM • Customer 360° • Sales Intelligence</p>' +
                '</div>' +
                '<button onclick="showDashboard()" style="color: white; font-size: 14px; background: rgba(255,255,255,0.2); border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">← Back to Dashboard</button>' +
                '</div>' +
                '</div>' +

                '<!-- Customer Management Tabs -->' +
                '<div style="display: flex; background: white; border-bottom: 1px solid #e2e8f0; padding: 0 32px;">' +
                '<button class="customer-tab active" onclick="showCustomerTab(&quot;dashboard&quot;)" data-tab="dashboard">📊 Analytics Dashboard</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;directory&quot;)" data-tab="directory">📁 Master Directory</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;profiles&quot;)" data-tab="profiles">👤 Customer Profiles</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;segments&quot;)" data-tab="segments">📈 Segments & Analytics</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;enterprise&quot;)" data-tab="enterprise">🏆 Major Customers</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;pipeline&quot;)" data-tab="pipeline">⚡ Sales Pipeline</button>' +
                '<button class="customer-tab" onclick="showCustomerTab(&quot;insights&quot;)" data-tab="insights">🧠 AI Insights</button>' +
                '</div>' +

                '<!-- Tab Content Area -->' +
                '<div style="background: white; margin: 0 32px 32px 32px; padding: 32px; border-radius: 0 0 12px 12px; min-height: 500px;">' +
                '<div id="customerTabContent">' +
                generateCustomerDashboardHTML() +
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

        function generateCustomerDashboardHTML() {
            return '<div class="customer-dashboard">' +
                '<!-- Dashboard Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">📊 Customer Analytics Dashboard</h2>' +
                '<p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">Real-time insights and performance metrics across your customer portfolio</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="refreshDashboard()" class="btn" style="background: #10b981; color: white;">🔄 Refresh</button>' +
                '<button onclick="exportDashboard()" class="btn" style="background: #3b82f6; color: white;">📥 Export</button>' +
                '<button onclick="scheduleDashboard()" class="btn" style="background: #8b5cf6; color: white;">📅 Schedule</button>' +
                '</div>' +
                '</div>' +

                '<!-- Key Performance Indicators -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🎯 Key Performance Indicators</h3>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">' +
                generateCustomerKPICards() +
                '</div>' +
                '</div>' +

                '<!-- Charts and Analytics -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">💰 Revenue Trends</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateCustomerRevenueChart() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📈 Customer Growth</h3>' +
                '<div style="display: grid; gap: 16px;">' +
                generateGrowthMetrics() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Customer Segmentation -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🎯 Customer Segmentation</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateSegmentationChart() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📊 Geographic Distribution</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateGeographicChart() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Customer Health & Satisfaction -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">❤️ Customer Health Score</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateHealthScoreChart() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⭐ Satisfaction Trends</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateSatisfactionChart() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔮 Churn Risk Analysis</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateChurnRiskChart() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Activity and Engagement -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔥 Customer Activity & Engagement</h3>' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Weekly Activity Trends</h4>' +
                generateActivityTrendsChart() +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Top Engaged Customers</h4>' +
                generateTopEngagedCustomers() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Predictive Analytics -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔮 Predictive Analytics & Insights</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generatePredictiveInsightsSection() +
                '</div>' +
                '</div>' +

                '<!-- Recent Activity Feed -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📅 Recent Customer Activity</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRecentActivityFeed() +
                '</div>' +
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
                case 'dashboard':
                    content.innerHTML = generateCustomerDashboardHTML();
                    break;
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
            // Open customer detail as a page, not a modal
            openCustomerProfilePage(customerId);
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
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 20px;">👤 Customer 360° Profiles</h3>' +
                '<p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Comprehensive customer profiles with contacts, interactions & custom fields</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="addCustomProfile()" class="btn" style="background: #f59e0b; color: white; padding: 8px 16px; border-radius: 8px; border: none;">➕ Add Profile</button>' +
                '<button onclick="bulkProfileActions()" class="btn" style="background: #6366f1; color: white; padding: 8px 16px; border-radius: 8px; border: none;">⚙️ Bulk Actions</button>' +
                '</div>' +
                '</div>' +

                '<!-- Profile Search and Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search profiles by name, company, role..." style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;" onkeyup="searchCustomerProfiles(this.value)">' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;" onchange="filterProfilesByType(this.value)">' +
                '<option value="">All Profile Types</option>' +
                '<option value="primary">Primary Contacts</option>' +
                '<option value="technical">Technical Contacts</option>' +
                '<option value="billing">Billing Contacts</option>' +
                '<option value="executive">Executive Contacts</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;" onchange="filterProfilesByActivity(this.value)">' +
                '<option value="">All Activity</option>' +
                '<option value="recent">Recent (7 days)</option>' +
                '<option value="active">Active (30 days)</option>' +
                '<option value="inactive">Inactive (90+ days)</option>' +
                '</select>' +
                '</div>' +

                '<!-- Customer Profile Cards -->' +
                '<div id="customerProfilesList" style="display: grid; gap: 20px;">' +
                generateCustomerProfileCards() +
                '</div>' +
                '</div>';
        }

        function generateCustomerProfileCards() {
            const customerProfiles = [
                {
                    id: 'microsoft',
                    company: 'Microsoft Corporation',
                    primaryContact: 'Satya Nadella',
                    totalContacts: 8,
                    recentActivity: '2 hours ago',
                    health: '98.2%',
                    segment: 'Enterprise',
                    logo: '🏢',
                    color: '#0078d4',
                    tags: ['Strategic', 'High-Value', 'Partnership']
                },
                {
                    id: 'salesforce',
                    company: 'Salesforce Inc',
                    primaryContact: 'Marc Benioff',
                    totalContacts: 6,
                    recentActivity: '1 day ago',
                    health: '96.7%',
                    segment: 'Enterprise',
                    logo: '⚡',
                    color: '#00a1e0',
                    tags: ['Strategic', 'Integration', 'API']
                },
                {
                    id: 'adobe',
                    company: 'Adobe Systems',
                    primaryContact: 'Shantanu Narayen',
                    totalContacts: 5,
                    recentActivity: '3 hours ago',
                    health: '94.1%',
                    segment: 'Enterprise',
                    logo: '🎨',
                    color: '#ff0000',
                    tags: ['Creative', 'High-Value', 'Expansion']
                },
                {
                    id: 'techstart',
                    company: 'TechStart Solutions',
                    primaryContact: 'Sarah Wilson',
                    totalContacts: 3,
                    recentActivity: '5 hours ago',
                    health: '87.3%',
                    segment: 'Mid-Market',
                    logo: '🚀',
                    color: '#10b981',
                    tags: ['Growing', 'SaaS', 'Potential']
                },
                {
                    id: 'acme',
                    company: 'Acme Corporation',
                    primaryContact: 'John Anderson',
                    totalContacts: 2,
                    recentActivity: '1 week ago',
                    health: '72.1%',
                    segment: 'SMB',
                    logo: '🏭',
                    color: '#f59e0b',
                    tags: ['At-Risk', 'Manufacturing', 'Traditional']
                }
            ];

            let html = '';
            customerProfiles.forEach(profile => {
                html += '<div class="customer-card" style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; transition: all 0.3s ease; cursor: pointer;" onclick="openCustomerProfilePage(&quot;' + profile.id + '&quot;)" onmouseover="this.style.transform=&quot;translateY(-4px)&quot;; this.style.boxShadow=&quot;0 8px 25px rgba(0,0,0,0.15)&quot;" onmouseout="this.style.transform=&quot;&quot;; this.style.boxShadow=&quot;&quot;">' +
                    '<!-- Profile Header -->' +
                    '<div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;">' +
                    '<div style="display: flex; align-items: center;">' +
                    '<div style="width: 56px; height: 56px; background: ' + profile.color + '; color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-right: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">' + profile.logo + '</div>' +
                    '<div>' +
                    '<h4 style="color: #1f2937; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">' + profile.company + '</h4>' +
                    '<p style="color: #64748b; margin: 0; font-size: 14px;">👤 ' + profile.primaryContact + ' • ' + profile.segment + ' Segment</p>' +
                    '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 16px; font-weight: 600; color: ' + (parseFloat(profile.health) > 90 ? '#059669' : parseFloat(profile.health) > 80 ? '#f59e0b' : '#dc2626') + '; margin-bottom: 4px;">' + profile.health + '</div>' +
                    '<div style="font-size: 12px; color: #64748b;">Health Score</div>' +
                    '</div>' +
                    '</div>' +

                    '<!-- Profile Stats -->' +
                    '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 16px; margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 12px;">' +
                    '<div style="text-align: center;">' +
                    '<div style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">' + profile.totalContacts + '</div>' +
                    '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 500;">Contacts</div>' +
                    '</div>' +
                    '<div style="text-align: center;">' +
                    '<div style="font-size: 20px; font-weight: 700; color: #6366f1; margin-bottom: 4px;">4.8</div>' +
                    '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 500;">Rating</div>' +
                    '</div>' +
                    '<div style="text-align: center;">' +
                    '<div style="font-size: 20px; font-weight: 700; color: #10b981; margin-bottom: 4px;">12</div>' +
                    '<div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 500;">Interactions</div>' +
                    '</div>' +
                    '</div>' +

                    '<!-- Profile Tags -->' +
                    '<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">';
                
                profile.tags.forEach(tag => {
                    const tagColor = tag === 'Strategic' ? '#6366f1' : tag === 'High-Value' ? '#059669' : tag === 'At-Risk' ? '#dc2626' : '#64748b';
                    html += '<span style="background: ' + tagColor + '20; color: ' + tagColor + '; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500;">' + tag + '</span>';
                });

                html += '</div>' +

                    '<!-- Profile Actions -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f3f4f6;">' +
                    '<div style="font-size: 12px; color: #64748b;">Last activity: ' + profile.recentActivity + '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="event.stopPropagation(); quickCallCustomer(&quot;' + profile.id + '&quot;)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">📞 Call</button>' +
                    '<button onclick="event.stopPropagation(); quickEmailCustomer(&quot;' + profile.id + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">📧 Email</button>' +
                    '<button onclick="event.stopPropagation(); viewProfileDetails(&quot;' + profile.id + '&quot;)" style="background: #6366f1; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">👁️ View</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });

            return html;
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

        // Customer Profile Management Functions
        function openCustomerProfilePage(customerId) {
            // Close any open modals first
            document.querySelectorAll('.modal').forEach(modal => modal.remove());
            
            // Navigate to customer profile page instead of modal
            currentView = 'customer-profile';
            currentCustomerId = customerId;
            
            // Update the page title
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = '🏢 Customer Profile';
            }
            
            // Replace dashboard content with customer profile
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardContent) {
                dashboardContent.innerHTML = generateDetailedCustomerProfilePageHTML(customerId);
                initializeCustomerProfilePage(customerId);
            }
        }

        function generateDetailedCustomerProfilePageHTML(customerId) {
            const customerData = getCustomerDataById(customerId);
            
            return '<div style="background: #f8fafc; padding: 0; margin: -20px;">' +
                '<!-- Breadcrumbs -->' +
                '<div style="background: white; padding: 16px 32px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;">' +
                '<nav style="display: flex; align-items: center; gap: 8px; font-size: 14px;">' +
                '<a href="#" onclick="showDashboard(); return false;" style="color: #6b7280; text-decoration: none; hover: color: #3b82f6;">Dashboard</a>' +
                '<span style="color: #9ca3af;">›</span>' +
                '<a href="#" onclick="showCustomersModal(); return false;" style="color: #6b7280; text-decoration: none;">Customers</a>' +
                '<span style="color: #9ca3af;">›</span>' +
                '<span style="color: #1f2937; font-weight: 500;">' + customerData.company + '</span>' +
                '</nav>' +
                '<button onclick="goBackToCustomers()" style="color: #6b7280; font-size: 14px; background: white; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; cursor: pointer;">← Back</button>' +
                '</div>' +
                
                '<!-- Customer Profile Header -->' +
                '<div style="background: linear-gradient(135deg, ' + customerData.color + ', ' + customerData.secondaryColor + '); color: white; padding: 32px; position: relative;">' +
                
                '<div style="display: flex; align-items: center; margin-bottom: 24px;">' +
                '<div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-right: 24px;">' + customerData.logo + '</div>' +
                '<div style="flex: 1;">' +
                '<h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 800;">' + customerData.company + '</h1>' +
                '<div style="display: flex; align-items: center; gap: 20px; opacity: 0.9;">' +
                '<span style="font-size: 16px;">📍 ' + customerData.location + '</span>' +
                '<span style="font-size: 16px;">🏢 ' + customerData.industry + '</span>' +
                '<span style="font-size: 16px;">👥 ' + customerData.employees + ' employees</span>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="font-size: 36px; font-weight: 800; margin-bottom: 4px;">' + customerData.health + '</div>' +
                '<div style="opacity: 0.9;">Health Score</div>' +
                '</div>' +
                '</div>' +

                '<!-- Key Metrics Row -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">' +
                '<div style="text-align: center; background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold;">' + customerData.arr + '</div>' +
                '<div style="opacity: 0.9; font-size: 14px;">Annual Revenue</div>' +
                '</div>' +
                '<div style="text-align: center; background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold;">' + customerData.totalContacts + '</div>' +
                '<div style="opacity: 0.9; font-size: 14px;">Total Contacts</div>' +
                '</div>' +
                '<div style="text-align: center; background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold;">' + customerData.activeCases + '</div>' +
                '<div style="opacity: 0.9; font-size: 14px;">Active Cases</div>' +
                '</div>' +
                '<div style="text-align: center; background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px;">' +
                '<div style="font-size: 24px; font-weight: bold;">' + customerData.lastActivity + '</div>' +
                '<div style="opacity: 0.9; font-size: 14px;">Last Activity</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Navigation Tabs -->' +
                '<div style="display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0 32px;">' +
                '<button class="profile-tab active" onclick="showProfileTab(&quot;overview&quot;, &quot;' + customerId + '&quot;)" data-tab="overview">📊 Overview</button>' +
                '<button class="profile-tab" onclick="showProfileTab(&quot;contacts&quot;, &quot;' + customerId + '&quot;)" data-tab="contacts">👥 Contacts (' + customerData.totalContacts + ')</button>' +
                '<button class="profile-tab" onclick="showProfileTab(&quot;interactions&quot;, &quot;' + customerId + '&quot;)" data-tab="interactions">💬 Interactions</button>' +
                '<button class="profile-tab" onclick="showProfileTab(&quot;cases&quot;, &quot;' + customerId + '&quot;)" data-tab="cases">📝 Cases (' + customerData.activeCases + ')</button>' +
                '<button class="profile-tab" onclick="showProfileTab(&quot;documents&quot;, &quot;' + customerId + '&quot;)" data-tab="documents">📁 Documents</button>' +
                '<button class="profile-tab" onclick="showProfileTab(&quot;analytics&quot;, &quot;' + customerId + '&quot;)" data-tab="analytics">📈 Analytics</button>' +
                '</div>' +

                '<!-- Tab Content Area -->' +
                '<div style="flex: 1; overflow-y: auto; padding: 32px;" id="profileTabContent">' +
                generateCustomerOverviewTab(customerData) +
                '</div>' +
                '</div>';
        }

        function getCustomerDataById(customerId) {
            const customerDatabase = {
                'microsoft': {
                    company: 'Microsoft Corporation',
                    logo: '🏢',
                    color: '#0078d4',
                    secondaryColor: '#106ebe',
                    location: 'Redmond, WA, USA',
                    industry: 'Technology & Software',
                    employees: '221,000+',
                    health: '98.2%',
                    arr: '$2.4M',
                    totalContacts: 8,
                    activeCases: 12,
                    lastActivity: '2 hours ago',
                    website: 'https://microsoft.com',
                    founded: '1975',
                    description: 'Multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.',
                    contacts: [
                        {
                            id: 'satya-nadella',
                            name: 'Satya Nadella',
                            title: 'CEO',
                            email: 'satya.nadella@microsoft.com',
                            phone: '+1 (425) 882-8080',
                            department: 'Executive',
                            role: 'Decision Maker',
                            contactType: 'primary',
                            lastContact: '2 hours ago',
                            interactions: 47,
                            avatar: 'SN',
                            status: 'active',
                            expertise: ['Strategic Planning', 'Cloud Computing', 'AI'],
                            preferredContact: 'Email',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/satyanadella'
                        },
                        {
                            id: 'brad-smith',
                            name: 'Brad Smith',
                            title: 'President & Chief Legal Officer',
                            email: 'brad.smith@microsoft.com',
                            phone: '+1 (425) 882-8081',
                            department: 'Legal',
                            role: 'Stakeholder',
                            contactType: 'executive',
                            lastContact: '1 day ago',
                            interactions: 23,
                            avatar: 'BS',
                            status: 'active',
                            expertise: ['Legal Affairs', 'Government Relations', 'Policy'],
                            preferredContact: 'Phone',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/bradsmith'
                        },
                        {
                            id: 'scott-guthrie',
                            name: 'Scott Guthrie',
                            title: 'Executive VP, Cloud + AI',
                            email: 'scott.guthrie@microsoft.com',
                            phone: '+1 (425) 882-8082',
                            department: 'Engineering',
                            role: 'Technical Lead',
                            contactType: 'technical',
                            lastContact: '3 hours ago',
                            interactions: 65,
                            avatar: 'SG',
                            status: 'active',
                            expertise: ['Azure', 'Cloud Architecture', 'AI/ML'],
                            preferredContact: 'Teams',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/scottgu'
                        },
                        {
                            id: 'amy-hood',
                            name: 'Amy Hood',
                            title: 'CFO',
                            email: 'amy.hood@microsoft.com',
                            phone: '+1 (425) 882-8083',
                            department: 'Finance',
                            role: 'Financial Lead',
                            contactType: 'billing',
                            lastContact: '1 week ago',
                            interactions: 18,
                            avatar: 'AH',
                            status: 'active',
                            expertise: ['Financial Planning', 'Budget Management', 'Strategy'],
                            preferredContact: 'Email',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/amyhood'
                        },
                        {
                            id: 'kathleen-hogan',
                            name: 'Kathleen Hogan',
                            title: 'Chief People Officer',
                            email: 'kathleen.hogan@microsoft.com',
                            phone: '+1 (425) 882-8084',
                            department: 'Human Resources',
                            role: 'Operations',
                            contactType: 'operations',
                            lastContact: '2 weeks ago',
                            interactions: 12,
                            avatar: 'KH',
                            status: 'active',
                            expertise: ['HR Strategy', 'Talent Management', 'Culture'],
                            preferredContact: 'Email',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/kathleenhogan'
                        }
                    ]
                },
                'salesforce': {
                    company: 'Salesforce Inc',
                    logo: '⚡',
                    color: '#00a1e0',
                    secondaryColor: '#0071c1',
                    location: 'San Francisco, CA, USA',
                    industry: 'Cloud Software & CRM',
                    employees: '73,000+',
                    health: '96.7%',
                    arr: '$1.85M',
                    totalContacts: 6,
                    activeCases: 8,
                    lastActivity: '1 day ago',
                    website: 'https://salesforce.com',
                    founded: '1999',
                    description: 'American cloud-based software company headquartered in San Francisco, California. It provides customer relationship management software and applications.',
                    contacts: [
                        {
                            id: 'marc-benioff',
                            name: 'Marc Benioff',
                            title: 'Chairman & CEO',
                            email: 'marc.benioff@salesforce.com',
                            phone: '+1 (415) 901-7000',
                            department: 'Executive',
                            role: 'Decision Maker',
                            contactType: 'primary',
                            lastContact: '1 day ago',
                            interactions: 34,
                            avatar: 'MB',
                            status: 'active',
                            expertise: ['CRM Strategy', 'Cloud Computing', 'Innovation'],
                            preferredContact: 'Phone',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/marcbenioff'
                        },
                        {
                            id: 'parker-harris',
                            name: 'Parker Harris',
                            title: 'Co-Founder & CTO',
                            email: 'parker.harris@salesforce.com',
                            phone: '+1 (415) 901-7001',
                            department: 'Engineering',
                            role: 'Technical Lead',
                            contactType: 'technical',
                            lastContact: '2 days ago',
                            interactions: 28,
                            avatar: 'PH',
                            status: 'active',
                            expertise: ['Platform Architecture', 'API Development', 'Integration'],
                            preferredContact: 'Slack',
                            timezone: 'PST',
                            socialLinkedIn: 'https://linkedin.com/in/parkerharris'
                        }
                    ]
                }
                // Adding default data for other customers with basic contact info
            };

            // Return specific customer data or default template
            return customerDatabase[customerId] || createDefaultCustomerData(customerId);
        }

        function createDefaultCustomerData(customerId) {
            const defaults = {
                'adobe': {
                    company: 'Adobe Systems',
                    logo: '🎨',
                    color: '#ff0000',
                    secondaryColor: '#cc0000',
                    location: 'San Jose, CA, USA',
                    industry: 'Creative Software',
                    totalContacts: 5
                },
                'techstart': {
                    company: 'TechStart Solutions', 
                    logo: '🚀',
                    color: '#10b981',
                    secondaryColor: '#059669',
                    location: 'Austin, TX, USA',
                    industry: 'SaaS',
                    totalContacts: 3
                },
                'acme': {
                    company: 'Acme Corporation',
                    logo: '🏭',
                    color: '#f59e0b',
                    secondaryColor: '#d97706',
                    location: 'Chicago, IL, USA',
                    industry: 'Manufacturing',
                    totalContacts: 2
                }
            };

            const defaultData = defaults[customerId] || defaults['acme'];
            return {
                ...defaultData,
                employees: '500+',
                health: '87.3%',
                arr: '$285K',
                activeCases: 4,
                lastActivity: '5 hours ago',
                website: 'https://example.com',
                founded: '2010',
                description: 'A growing company in the ' + defaultData.industry + ' sector.',
                contacts: [
                    {
                        id: 'default-contact',
                        name: 'John Smith',
                        title: 'CEO',
                        email: 'john@example.com',
                        phone: '+1 (555) 123-4567',
                        department: 'Executive',
                        role: 'Decision Maker',
                        contactType: 'primary',
                        lastContact: '1 day ago',
                        interactions: 15,
                        avatar: 'JS',
                        status: 'active'
                    }
                ]
            };
        }

        // Customer Profile Page Management Functions
        function initializeCustomerProfilePage(customerId) {
            showProfileTab('overview', customerId);
        }

        function showProfileTab(tabName, customerId) {
            // Remove active class from all tabs
            document.querySelectorAll('.profile-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            document.querySelector('.profile-tab[data-tab="' + tabName + '"]').classList.add('active');
            
            // Show corresponding content
            const content = document.getElementById('profileTabContent');
            const customerData = getCustomerDataById(customerId);
            
            switch(tabName) {
                case 'overview':
                    content.innerHTML = generateCustomerOverviewTab(customerData);
                    break;
                case 'contacts':
                    content.innerHTML = generateCustomerContactsTab(customerData);
                    break;
                case 'interactions':
                    content.innerHTML = generateCustomerInteractionsTab(customerData);
                    break;
                case 'cases':
                    content.innerHTML = generateCustomerCasesTab(customerData);
                    break;
                case 'documents':
                    content.innerHTML = generateCustomerDocumentsTab(customerData);
                    break;
                case 'analytics':
                    content.innerHTML = generateCustomerAnalyticsTab(customerData);
                    break;
            }
        }

        function generateCustomerOverviewTab(customerData) {
            return '<div style="max-width: 1200px;">' +
                '<!-- Company Information -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin-bottom: 16px;">Company Overview</h2>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">' + customerData.description + '</p>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">' +
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px; font-weight: 500;">FOUNDED</div>' +
                '<div style="font-weight: 600; color: #1f2937;">' + (customerData.founded || '2010') + '</div>' +
                '</div>' +
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px; font-weight: 500;">WEBSITE</div>' +
                '<div style="font-weight: 600; color: #3b82f6;"><a href="' + customerData.website + '" target="_blank">Visit Website</a></div>' +
                '</div>' +
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px; font-weight: 500;">INDUSTRY</div>' +
                '<div style="font-weight: 600; color: #1f2937;">' + customerData.industry + '</div>' +
                '</div>' +
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px; font-weight: 500;">SIZE</div>' +
                '<div style="font-weight: 600; color: #1f2937;">' + customerData.employees + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h2 style="color: #1f2937; margin-bottom: 16px;">Quick Actions</h2>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<div style="display: grid; gap: 12px;">' +
                '<button onclick="scheduleCustomerMeeting(&quot;' + customerData.company + '&quot;)" class="btn btn-primary" style="width: 100%; justify-content: center;">📅 Schedule Meeting</button>' +
                '<button onclick="createCustomerCase(&quot;' + customerData.company + '&quot;)" class="btn" style="width: 100%; background: #059669; color: white;">📝 Create Case</button>' +
                '<button onclick="sendCustomerEmail(&quot;' + customerData.company + '&quot;)" class="btn" style="width: 100%; background: #3b82f6; color: white;">📧 Send Email</button>' +
                '<button onclick="generateCustomerReport(&quot;' + customerData.company + '&quot;)" class="btn" style="width: 100%; background: #f59e0b; color: white;">📊 Generate Report</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Key Contacts Preview -->' +
                '<div style="margin-bottom: 32px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                '<h2 style="color: #1f2937; margin: 0;">Key Contacts</h2>' +
                '<button onclick="showProfileTab(&quot;contacts&quot;, &quot;' + customerData.company.toLowerCase().replace(/\s+/g, '') + '&quot;)" class="btn" style="background: #6366f1; color: white; font-size: 14px;">View All (' + customerData.totalContacts + ')</button>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">' +
                generateTopContactsPreview(customerData.contacts || []) +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateTopContactsPreview(contacts) {
            let html = '';
            const topContacts = contacts.slice(0, 3); // Show first 3 contacts
            
            topContacts.forEach(contact => {
                html += '<div class="contact-card" onclick="openContactDetail(&quot;' + contact.id + '&quot;)">' +
                    '<div style="display: flex; align-items: center; margin-bottom: 16px;">' +
                    '<div style="width: 48px; height: 48px; background: #6366f1; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 16px;">' + contact.avatar + '</div>' +
                    '<div style="flex: 1;">' +
                    '<h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px;">' + contact.name + '</h4>' +
                    '<p style="margin: 0; color: #6b7280; font-size: 14px;">' + contact.title + '</p>' +
                    '</div>' +
                    '<span class="contact-type-badge ' + contact.contactType + '">' + contact.contactType + '</span>' +
                    '</div>' +
                    '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">' +
                    '<div><span style="color: #6b7280;">📧</span> ' + contact.email.split('@')[0] + '@...</div>' +
                    '<div><span style="color: #6b7280;">📞</span> ' + contact.phone.substring(0, 8) + '...</div>' +
                    '<div><span style="color: #6b7280;">🏢</span> ' + contact.department + '</div>' +
                    '<div><span style="color: #6b7280;">💬</span> ' + contact.interactions + ' interactions</div>' +
                    '</div>' +
                    '</div>';
            });

            return html || '<div style="text-align: center; padding: 40px; color: #6b7280;">No contacts available</div>';
        }

        function generateCustomerContactsTab(customerData) {
            return '<div>' +
                '<!-- Contacts Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0;">👥 Customer Contacts</h2>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Complete contact directory for ' + customerData.company + '</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="addNewContact(&quot;' + customerData.company + '&quot;)" class="btn btn-primary">➕ Add Contact</button>' +
                '<button onclick="importContacts(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #f59e0b; color: white;">📥 Import</button>' +
                '</div>' +
                '</div>' +

                '<!-- Contact Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search contacts by name, title, department..." style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Departments</option>' +
                '<option value="executive">Executive</option>' +
                '<option value="engineering">Engineering</option>' +
                '<option value="finance">Finance</option>' +
                '<option value="legal">Legal</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Contact Types</option>' +
                '<option value="primary">Primary</option>' +
                '<option value="technical">Technical</option>' +
                '<option value="billing">Billing</option>' +
                '<option value="executive">Executive</option>' +
                '</select>' +
                '<button onclick="exportContactList(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #059669; color: white;">📊 Export</button>' +
                '</div>' +

                '<!-- Contacts List -->' +
                '<div style="display: grid; gap: 16px;">' +
                generateDetailedContactsList(customerData.contacts || []) +
                '</div>' +
                '</div>';
        }

        function generateDetailedContactsList(contacts) {
            if (!contacts.length) {
                return '<div style="text-align: center; padding: 60px 20px; color: #6b7280;">' +
                    '<div style="font-size: 48px; margin-bottom: 16px;">👥</div>' +
                    '<h3 style="color: #1f2937; margin-bottom: 8px;">No Contacts Found</h3>' +
                    '<p>Add contacts to start managing this customer relationship.</p>' +
                    '</div>';
            }

            let html = '';
            contacts.forEach(contact => {
                const statusColor = contact.status === 'active' ? '#10b981' : '#6b7280';
                const roleColor = contact.role === 'Decision Maker' ? '#dc2626' : contact.role === 'Technical Lead' ? '#3b82f6' : '#6b7280';

                html += '<div class="contact-card" onclick="openContactDetail(&quot;' + contact.id + '&quot;)">' +
                    '<!-- Contact Header -->' +
                    '<div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;">' +
                    '<div style="display: flex; align-items: center;">' +
                    '<div style="width: 56px; height: 56px; background: #6366f1; color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; margin-right: 20px;">' + contact.avatar + '</div>' +
                    '<div>' +
                    '<h3 style="margin: 0 0 6px 0; color: #1f2937; font-size: 20px; font-weight: 700;">' + contact.name + '</h3>' +
                    '<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 16px;">' + contact.title + '</p>' +
                    '<div style="display: flex; align-items: center; gap: 12px;">' +
                    '<span class="contact-type-badge ' + contact.contactType + '">' + contact.contactType + '</span>' +
                    '<span style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: ' + statusColor + ';"><span style="width: 6px; height: 6px; background: ' + statusColor + '; border-radius: 3px;"></span>' + contact.status + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 14px; font-weight: 600; color: ' + roleColor + '; margin-bottom: 4px;">' + contact.role + '</div>' +
                    '<div style="font-size: 12px; color: #6b7280;">Last: ' + contact.lastContact + '</div>' +
                    '</div>' +
                    '</div>' +

                    '<!-- Contact Details Grid -->' +
                    '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                    '<div>' +
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<span style="font-size: 16px;">📧</span>' +
                    '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">EMAIL</span>' +
                    '</div>' +
                    '<div style="color: #1f2937; font-weight: 500;">' + contact.email + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<span style="font-size: 16px;">📞</span>' +
                    '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">PHONE</span>' +
                    '</div>' +
                    '<div style="color: #1f2937; font-weight: 500;">' + contact.phone + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<span style="font-size: 16px;">🏢</span>' +
                    '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">DEPARTMENT</span>' +
                    '</div>' +
                    '<div style="color: #1f2937; font-weight: 500;">' + contact.department + '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<span style="font-size: 16px;">💬</span>' +
                    '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">INTERACTIONS</span>' +
                    '</div>' +
                    '<div style="color: #1f2937; font-weight: 600;">' + contact.interactions + ' total</div>' +
                    '</div>';

                if (contact.expertise && contact.expertise.length > 0) {
                    html += '<div>' +
                        '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<span style="font-size: 16px;">💡</span>' +
                        '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">EXPERTISE</span>' +
                        '</div>' +
                        '<div style="display: flex; flex-wrap: wrap; gap: 4px;">';
                    
                    contact.expertise.forEach(skill => {
                        html += '<span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500;">' + skill + '</span>';
                    });
                    
                    html += '</div>' +
                        '</div>';
                }

                if (contact.preferredContact) {
                    html += '<div>' +
                        '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<span style="font-size: 16px;">⭐</span>' +
                        '<span style="font-size: 12px; color: #6b7280; font-weight: 500;">PREFERRED</span>' +
                        '</div>' +
                        '<div style="color: #1f2937; font-weight: 500;">' + contact.preferredContact + '</div>' +
                        '</div>';
                }

                html += '</div>' +

                    '<!-- Contact Actions -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">' +
                    '<div style="display: flex; gap: 8px;">';

                if (contact.socialLinkedIn) {
                    html += '<a href="' + contact.socialLinkedIn + '" target="_blank" style="color: #0077b5; text-decoration: none; font-size: 12px;">🔗 LinkedIn</a>';
                }

                html += '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="event.stopPropagation(); callContact(&quot;' + contact.id + '&quot;, &quot;' + contact.phone + '&quot;)" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">📞 Call</button>' +
                    '<button onclick="event.stopPropagation(); emailContact(&quot;' + contact.id + '&quot;, &quot;' + contact.email + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">📧 Email</button>' +
                    '<button onclick="event.stopPropagation(); scheduleWithContact(&quot;' + contact.id + '&quot;)" style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">📅 Schedule</button>' +
                    '<button onclick="event.stopPropagation(); viewContactHistory(&quot;' + contact.id + '&quot;)" style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">📊 History</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });

            return html;
        }

        // Additional Tab Content Functions (Placeholder implementations)
        function generateCustomerInteractionsTab(customerData) {
            const interactions = getCustomerInteractions(customerData.company);
            
            return '<div>' +
                '<!-- Interactions Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0;">💬 Interaction Timeline</h2>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Complete communication history with ' + customerData.company + '</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="logNewInteraction(&quot;' + customerData.company + '&quot;)" class="btn btn-primary">➕ Log Interaction</button>' +
                '<button onclick="exportInteractions(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #059669; color: white;">📊 Export</button>' +
                '</div>' +
                '</div>' +

                '<!-- Interaction Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search interactions by content, participants..." style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Types</option>' +
                '<option value="email">📧 Emails</option>' +
                '<option value="call">📞 Calls</option>' +
                '<option value="meeting">📅 Meetings</option>' +
                '<option value="note">📝 Notes</option>' +
                '<option value="chat">💬 Chats</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Time</option>' +
                '<option value="today">Today</option>' +
                '<option value="week">This Week</option>' +
                '<option value="month">This Month</option>' +
                '<option value="quarter">This Quarter</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Participants</option>' +
                '<option value="john">John Doe</option>' +
                '<option value="sarah">Sarah Johnson</option>' +
                '<option value="michael">Michael Chen</option>' +
                '</select>' +
                '</div>' +

                '<!-- Interaction Stats -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">📧</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: #3b82f6;">127</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Email Exchanges</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">📞</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: #10b981;">48</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Phone Calls</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">📅</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: #f59e0b;">23</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Meetings</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">📝</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: #8b5cf6;">89</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Internal Notes</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center;">' +
                '<div style="font-size: 32px; margin-bottom: 8px;">💬</div>' +
                '<div style="font-size: 24px; font-weight: 700; color: #ec4899;">156</div>' +
                '<div style="color: #6b7280; font-size: 14px;">Chat Messages</div>' +
                '</div>' +
                '</div>' +

                '<!-- Interaction Timeline -->' +
                '<div style="position: relative;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">Recent Interactions</h3>' +
                generateInteractionTimeline(interactions) +
                '</div>' +
                '</div>';
        }

        function getCustomerInteractions(companyName) {
            // Generate comprehensive interaction history
            return [
                {
                    id: 'INT-001',
                    type: 'email',
                    icon: '📧',
                    color: '#3b82f6',
                    subject: 'Q1 2024 Business Review Meeting Follow-up',
                    content: 'Thank you for the productive meeting today. As discussed, we will proceed with the enterprise upgrade plan. I have attached the updated proposal with the custom pricing we agreed upon.',
                    participants: ['John Doe', 'Sarah Johnson'],
                    datetime: 'Today, 2:30 PM',
                    attachments: ['Q1_2024_Proposal.pdf', 'Pricing_Structure.xlsx'],
                    direction: 'outbound',
                    status: 'sent'
                },
                {
                    id: 'INT-002',
                    type: 'call',
                    icon: '📞',
                    color: '#10b981',
                    subject: 'Technical Support Call - API Integration',
                    content: 'Discussed API integration issues. Customer was experiencing timeout errors with batch processing. Provided workaround using pagination and increased rate limits temporarily.',
                    participants: ['Michael Chen', 'Tech Support Team'],
                    datetime: 'Today, 11:15 AM',
                    duration: '45 minutes',
                    direction: 'inbound',
                    outcome: 'Resolved'
                },
                {
                    id: 'INT-003',
                    type: 'meeting',
                    icon: '📅',
                    color: '#f59e0b',
                    subject: 'Quarterly Business Review - Q4 2023',
                    content: 'Reviewed Q4 performance metrics, discussed 2024 roadmap, and identified opportunities for expansion. Customer expressed interest in AI features and advanced analytics.',
                    participants: ['John Doe', 'Sarah Johnson', 'Lisa Anderson', 'Product Team'],
                    datetime: 'Yesterday, 3:00 PM',
                    duration: '90 minutes',
                    location: 'Conference Room A / Zoom',
                    followUp: 'Send updated roadmap by EOW'
                },
                {
                    id: 'INT-004',
                    type: 'note',
                    icon: '📝',
                    color: '#8b5cf6',
                    subject: 'Internal Note - Account Strategy',
                    content: 'Customer is evaluating competitor solutions. Need to schedule executive briefing to showcase our unique value proposition. Focus on integration capabilities and total cost of ownership.',
                    participants: ['Account Manager'],
                    datetime: '2 days ago, 9:00 AM',
                    priority: 'high',
                    private: true
                },
                {
                    id: 'INT-005',
                    type: 'chat',
                    icon: '💬',
                    color: '#ec4899',
                    subject: 'Live Chat Support Session',
                    content: 'Customer requested help with report generation. Walked through custom report builder and shared video tutorial. Customer satisfied with resolution.',
                    participants: ['Support Agent', 'Customer User'],
                    datetime: '3 days ago, 4:45 PM',
                    duration: '15 minutes',
                    satisfaction: '5/5'
                },
                {
                    id: 'INT-006',
                    type: 'email',
                    icon: '📧',
                    color: '#3b82f6',
                    subject: 'Contract Renewal Discussion',
                    content: 'Following up on our contract renewal for 2024. We are pleased to offer a 15% discount for early renewal along with additional user licenses at no extra cost.',
                    participants: ['Sales Team', 'Procurement Team'],
                    datetime: '1 week ago',
                    attachments: ['Renewal_Contract_2024.pdf'],
                    direction: 'outbound',
                    status: 'opened'
                }
            ];
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function generateInteractionTimeline(interactions) {
            let html = '<div style="position: relative; padding-left: 40px;">';
            
            // Timeline line
            html += '<div style="position: absolute; left: 16px; top: 0; bottom: 0; width: 2px; background: #e5e7eb;"></div>';
            
            interactions.forEach((interaction, index) => {
                html += '<div style="position: relative; margin-bottom: 32px;">' +
                    '<!-- Timeline Dot -->' +
                    '<div style="position: absolute; left: -28px; top: 8px; width: 12px; height: 12px; background: ' + interaction.color + '; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 1px #e5e7eb;"></div>' +
                    
                    '<!-- Interaction Card -->' +
                    '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s ease; cursor: pointer;" onclick="viewInteractionDetail(&quot;' + interaction.id + '&quot;)" onmouseover="this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;">' +
                    
                    '<!-- Header -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">' +
                    '<div style="display: flex; align-items: center; gap: 12px;">' +
                    '<span style="font-size: 24px;">' + interaction.icon + '</span>' +
                    '<div>' +
                    '<h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">' + escapeHtml(interaction.subject) + '</h4>' +
                    '<div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">' +
                    '<span style="color: #6b7280; font-size: 13px;">👥 ' + escapeHtml(interaction.participants.join(', ')) + '</span>' +
                    (interaction.duration ? '<span style="color: #6b7280; font-size: 13px;">⏱️ ' + interaction.duration + '</span>' : '') +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">' + interaction.datetime + '</div>' +
                    (interaction.direction ? '<span style="background: ' + (interaction.direction === 'inbound' ? '#dbeafe' : '#dcfce7') + '; color: ' + (interaction.direction === 'inbound' ? '#1d4ed8' : '#166534') + '; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">' + interaction.direction.toUpperCase() + '</span>' : '') +
                    '</div>' +
                    '</div>' +
                    
                    '<!-- Content -->' +
                    '<div style="color: #4b5563; line-height: 1.6; margin-bottom: 12px; font-size: 14px;">' + escapeHtml(interaction.content) + '</div>' +
                    
                    '<!-- Footer -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                    '<div style="display: flex; gap: 12px; flex-wrap: wrap;">';
                
                // Add attachments if present
                if (interaction.attachments) {
                    interaction.attachments.forEach(attachment => {
                        html += '<span style="background: #f3f4f6; color: #6b7280; padding: 4px 8px; border-radius: 6px; font-size: 12px;">📎 ' + attachment + '</span>';
                    });
                }
                
                // Add other metadata
                if (interaction.outcome) {
                    html += '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px;">✅ ' + interaction.outcome + '</span>';
                }
                
                if (interaction.followUp) {
                    html += '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 12px;">📌 ' + interaction.followUp + '</span>';
                }
                
                if (interaction.satisfaction) {
                    html += '<span style="background: #ede9fe; color: #6d28d9; padding: 4px 8px; border-radius: 6px; font-size: 12px;">⭐ ' + interaction.satisfaction + '</span>';
                }
                
                html += '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="event.stopPropagation(); replyToInteraction(&quot;' + interaction.id + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">↩️ Reply</button>' +
                    '<button onclick="event.stopPropagation(); addInteractionNote(&quot;' + interaction.id + '&quot;)" style="background: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📝 Note</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            return html;
        }

        function generateCustomerCasesTab(customerData) {
            const customerCases = getCustomerCases(customerData.company);
            
            return '<div>' +
                '<!-- Cases Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0;">📝 Customer Cases</h2>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Support cases and tickets for ' + customerData.company + '</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="createNewCase(&quot;' + customerData.company + '&quot;)" class="btn btn-primary">➕ Create Case</button>' +
                '<button onclick="exportCases(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #059669; color: white;">📊 Export</button>' +
                '</div>' +
                '</div>' +

                '<!-- Cases Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search cases by title, description, or case ID..." style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Priorities</option>' +
                '<option value="critical">Critical</option>' +
                '<option value="high">High</option>' +
                '<option value="medium">Medium</option>' +
                '<option value="low">Low</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Status</option>' +
                '<option value="open">Open</option>' +
                '<option value="in-progress">In Progress</option>' +
                '<option value="resolved">Resolved</option>' +
                '<option value="closed">Closed</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Categories</option>' +
                '<option value="technical">Technical</option>' +
                '<option value="billing">Billing</option>' +
                '<option value="general">General</option>' +
                '<option value="feature-request">Feature Request</option>' +
                '</select>' +
                '</div>' +

                '<!-- Cases List -->' +
                '<div style="display: grid; gap: 16px;">' +
                generateCustomerCasesList(customerCases) +
                '</div>' +
                '</div>';
        }

        function getCustomerCases(companyName) {
            // Generate realistic cases for the customer
            const caseTemplates = [
                {
                    id: 'CASE-2024-001',
                    title: 'API Integration Issues',
                    description: 'Customer experiencing timeout errors when integrating with our REST API endpoints.',
                    priority: 'high',
                    status: 'in-progress',
                    category: 'technical',
                    created: '2024-01-15',
                    updated: '2 hours ago',
                    assignedTo: 'Tech Team',
                    contactName: 'John Smith'
                },
                {
                    id: 'CASE-2024-002',
                    title: 'Billing Discrepancy - December Invoice',
                    description: 'Customer reported incorrect charges on December invoice for additional user licenses.',
                    priority: 'medium',
                    status: 'resolved',
                    category: 'billing',
                    created: '2024-01-10',
                    updated: '1 day ago',
                    assignedTo: 'Finance Team',
                    contactName: 'Sarah Johnson'
                },
                {
                    id: 'CASE-2024-003',
                    title: 'Feature Request - Advanced Reporting',
                    description: 'Request for custom dashboard with advanced analytics and export capabilities.',
                    priority: 'low',
                    status: 'open',
                    category: 'feature-request',
                    created: '2024-01-08',
                    updated: '3 days ago',
                    assignedTo: 'Product Team',
                    contactName: 'Michael Chen'
                },
                {
                    id: 'CASE-2024-004',
                    title: 'Performance Issues on Mobile App',
                    description: 'Slow loading times and crashes reported on iOS mobile application.',
                    priority: 'critical',
                    status: 'open',
                    category: 'technical',
                    created: '2024-01-12',
                    updated: '1 hour ago',
                    assignedTo: 'Mobile Team',
                    contactName: 'Lisa Anderson'
                }
            ];
            
            return caseTemplates;
        }

        function generateCustomerCasesList(cases) {
            if (!cases.length) {
                return '<div style="text-align: center; padding: 60px 20px; color: #6b7280;">' +
                    '<div style="font-size: 48px; margin-bottom: 16px;">📝</div>' +
                    '<h3 style="color: #1f2937; margin-bottom: 8px;">No Cases Found</h3>' +
                    '<p>No support cases or tickets found for this customer.</p>' +
                    '</div>';
            }

            let html = '';
            cases.forEach(caseItem => {
                const priorityColor = {
                    'critical': '#dc2626',
                    'high': '#f59e0b',
                    'medium': '#3b82f6',
                    'low': '#6b7280'
                }[caseItem.priority] || '#6b7280';

                const statusColor = {
                    'open': '#f59e0b',
                    'in-progress': '#3b82f6',
                    'resolved': '#10b981',
                    'closed': '#6b7280'
                }[caseItem.status] || '#6b7280';

                const categoryIcon = {
                    'technical': '🔧',
                    'billing': '💰',
                    'general': '💬',
                    'feature-request': '✨'
                }[caseItem.category] || '📝';

                html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: all 0.3s ease; cursor: pointer;" onclick="openCaseDetail(&quot;' + caseItem.id + '&quot;)">' +
                    '<!-- Case Header -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">' +
                    '<div style="flex: 1;">' +
                    '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">' +
                    '<h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">' + categoryIcon + ' ' + caseItem.title + '</h3>' +
                    '<span style="background: ' + priorityColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase;">' + caseItem.priority + '</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; gap: 16px; color: #6b7280; font-size: 14px;">' +
                    '<span><strong>Case ID:</strong> ' + caseItem.id + '</span>' +
                    '<span><strong>Created:</strong> ' + caseItem.created + '</span>' +
                    '<span><strong>Contact:</strong> ' + caseItem.contactName + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<span style="display: inline-block; background: ' + statusColor + '; color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; margin-bottom: 4px;">' + caseItem.status.toUpperCase() + '</span>' +
                    '<div style="color: #6b7280; font-size: 12px;">Updated: ' + caseItem.updated + '</div>' +
                    '</div>' +
                    '</div>' +

                    '<!-- Case Description -->' +
                    '<div style="margin-bottom: 16px;">' +
                    '<p style="color: #4b5563; line-height: 1.6; margin: 0;">' + caseItem.description + '</p>' +
                    '</div>' +

                    '<!-- Case Footer -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f3f4f6;">' +
                    '<div style="display: flex; align-items: center; gap: 12px;">' +
                    '<span style="background: #f3f4f6; color: #6b7280; padding: 4px 8px; border-radius: 6px; font-size: 12px;">' + caseItem.category + '</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">👤 ' + caseItem.assignedTo + '</span>' +
                    '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="event.stopPropagation(); updateCaseStatus(&quot;' + caseItem.id + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">📝 Update</button>' +
                    '<button onclick="event.stopPropagation(); addCaseComment(&quot;' + caseItem.id + '&quot;)" style="background: #059669; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">💬 Comment</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });

            return html;
        }

        function generateCustomerDocumentsTab(customerData) {
            const documents = getCustomerDocuments(customerData.company);
            
            return '<div>' +
                '<!-- Documents Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0;">📁 Document Repository</h2>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Contracts, proposals, and files for ' + customerData.company + '</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="uploadDocument(&quot;' + customerData.company + '&quot;)" class="btn btn-primary">⬆️ Upload Document</button>' +
                '<button onclick="createFolder(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #6366f1; color: white;">📁 New Folder</button>' +
                '<button onclick="exportDocuments(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #059669; color: white;">📥 Download All</button>' +
                '</div>' +
                '</div>' +

                '<!-- Document Search and Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search documents by name, type, content..." style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Categories</option>' +
                '<option value="contracts">📜 Contracts</option>' +
                '<option value="proposals">📋 Proposals</option>' +
                '<option value="invoices">💰 Invoices</option>' +
                '<option value="reports">📊 Reports</option>' +
                '<option value="presentations">🎯 Presentations</option>' +
                '<option value="technical">🔧 Technical Docs</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Time</option>' +
                '<option value="today">Today</option>' +
                '<option value="week">This Week</option>' +
                '<option value="month">This Month</option>' +
                '<option value="year">This Year</option>' +
                '</select>' +
                '<select style="padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px;">' +
                '<option value="">All Types</option>' +
                '<option value="pdf">PDF</option>' +
                '<option value="docx">Word</option>' +
                '<option value="xlsx">Excel</option>' +
                '<option value="pptx">PowerPoint</option>' +
                '</select>' +
                '</div>' +

                '<!-- Document Stats -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center;">' +
                '<div style="font-size: 24px; margin-bottom: 4px;">📄</div>' +
                '<div style="font-size: 20px; font-weight: 700; color: #1f2937;">47</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Total Documents</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center;">' +
                '<div style="font-size: 24px; margin-bottom: 4px;">💾</div>' +
                '<div style="font-size: 20px; font-weight: 700; color: #1f2937;">284 MB</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Storage Used</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center;">' +
                '<div style="font-size: 24px; margin-bottom: 4px;">📁</div>' +
                '<div style="font-size: 20px; font-weight: 700; color: #1f2937;">8</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Folders</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center;">' +
                '<div style="font-size: 24px; margin-bottom: 4px;">👥</div>' +
                '<div style="font-size: 20px; font-weight: 700; color: #1f2937;">5</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Shared Users</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center;">' +
                '<div style="font-size: 24px; margin-bottom: 4px;">🕐</div>' +
                '<div style="font-size: 20px; font-weight: 700; color: #1f2937;">2h ago</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Last Updated</div>' +
                '</div>' +
                '</div>' +

                '<!-- Folder Structure -->' +
                '<div style="display: grid; grid-template-columns: 250px 1fr; gap: 24px;">' +
                
                '<!-- Folder Tree -->' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: fit-content;">' +
                '<h4 style="color: #1f2937; margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">📂 FOLDERS</h4>' +
                generateFolderTree(customerData.company) +
                '</div>' +
                
                '<!-- Document Grid -->' +
                '<div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                '<h3 style="color: #1f2937; margin: 0;">📄 Documents</h3>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button onclick="toggleDocumentView()" style="background: #f3f4f6; border: none; padding: 8px; border-radius: 6px; cursor: pointer;">⚏</button>' +
                '<button onclick="sortDocuments(&quot;name&quot;)" style="background: #f3f4f6; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px;">↕ Sort</button>' +
                '</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">' +
                generateDocumentCards(documents) +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function getCustomerDocuments(companyName) {
            return [
                {
                    id: 'DOC-001',
                    name: 'Master Service Agreement 2024',
                    type: 'contract',
                    icon: '📜',
                    category: 'Contracts',
                    size: '2.4 MB',
                    format: 'PDF',
                    uploadedBy: 'Legal Team',
                    uploadedDate: 'Jan 15, 2024',
                    lastModified: '2 days ago',
                    version: 'v3.2',
                    status: 'active',
                    tags: ['Legal', 'Active', '2024'],
                    shared: ['John Doe', 'Sarah Johnson']
                },
                {
                    id: 'DOC-002',
                    name: 'Q1 2024 Business Proposal',
                    type: 'proposal',
                    icon: '📋',
                    category: 'Proposals',
                    size: '5.8 MB',
                    format: 'PPTX',
                    uploadedBy: 'Sales Team',
                    uploadedDate: 'Jan 10, 2024',
                    lastModified: '1 week ago',
                    version: 'v2.0',
                    status: 'pending',
                    tags: ['Sales', 'Q1', 'Pending'],
                    shared: ['Sales Team']
                },
                {
                    id: 'DOC-003',
                    name: 'December 2023 Invoice',
                    type: 'invoice',
                    icon: '💰',
                    category: 'Invoices',
                    size: '156 KB',
                    format: 'PDF',
                    uploadedBy: 'Finance',
                    uploadedDate: 'Dec 31, 2023',
                    lastModified: '2 weeks ago',
                    version: 'Final',
                    status: 'paid',
                    tags: ['Finance', 'Paid', 'December'],
                    shared: ['Finance Team']
                },
                {
                    id: 'DOC-004',
                    name: 'Technical Implementation Guide',
                    type: 'technical',
                    icon: '🔧',
                    category: 'Technical Docs',
                    size: '8.2 MB',
                    format: 'DOCX',
                    uploadedBy: 'Tech Team',
                    uploadedDate: 'Jan 8, 2024',
                    lastModified: '3 days ago',
                    version: 'v4.1',
                    status: 'current',
                    tags: ['Technical', 'API', 'Integration'],
                    shared: ['Tech Support', 'Customer']
                },
                {
                    id: 'DOC-005',
                    name: 'Annual Performance Report 2023',
                    type: 'report',
                    icon: '📊',
                    category: 'Reports',
                    size: '12.5 MB',
                    format: 'XLSX',
                    uploadedBy: 'Analytics',
                    uploadedDate: 'Jan 5, 2024',
                    lastModified: '1 week ago',
                    version: 'Final',
                    status: 'approved',
                    tags: ['Annual', 'Performance', '2023'],
                    shared: ['Executive Team']
                },
                {
                    id: 'DOC-006',
                    name: 'Product Roadmap Presentation',
                    type: 'presentation',
                    icon: '🎯',
                    category: 'Presentations',
                    size: '15.3 MB',
                    format: 'PPTX',
                    uploadedBy: 'Product Team',
                    uploadedDate: 'Jan 12, 2024',
                    lastModified: 'Yesterday',
                    version: 'v1.5',
                    status: 'draft',
                    tags: ['Product', 'Roadmap', '2024'],
                    shared: ['Product Team', 'Sales']
                }
            ];
        }

        function generateFolderTree(companyName) {
            return '<div style="font-size: 14px;">' +
                '<div style="padding: 8px 12px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;all&quot;)">' +
                '<span style="margin-right: 8px;">📁</span> All Documents (47)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;contracts&quot;)">' +
                '<span style="margin-right: 8px;">📜</span> Contracts (8)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;proposals&quot;)">' +
                '<span style="margin-right: 8px;">📋</span> Proposals (12)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;invoices&quot;)">' +
                '<span style="margin-right: 8px;">💰</span> Invoices (15)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;reports&quot;)">' +
                '<span style="margin-right: 8px;">📊</span> Reports (6)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;presentations&quot;)">' +
                '<span style="margin-right: 8px;">🎯</span> Presentations (4)' +
                '</div>' +
                '<div style="padding: 8px 12px 8px 24px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#f3f4f6&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;technical&quot;)">' +
                '<span style="margin-right: 8px;">🔧</span> Technical (2)' +
                '</div>' +
                '<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">' +
                '<div style="padding: 8px 12px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=&quot;#fee2e2&quot;" onmouseout="this.style.background=&quot;&quot;" onclick="openFolder(&quot;trash&quot;)">' +
                '<span style="margin-right: 8px;">🗑️</span> Trash (3)' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateDocumentCards(documents) {
            let html = '';
            
            documents.forEach(doc => {
                const statusColor = {
                    'active': '#10b981',
                    'pending': '#f59e0b',
                    'paid': '#3b82f6',
                    'current': '#10b981',
                    'approved': '#10b981',
                    'draft': '#6b7280'
                }[doc.status] || '#6b7280';
                
                html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s ease; cursor: pointer;" onclick="openDocument(&quot;' + doc.id + '&quot;)" onmouseover="this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;; this.style.transform=&quot;translateY(-2px)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;; this.style.transform=&quot;&quot;">' +
                    
                    '<!-- Document Header -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">' +
                    '<div style="display: flex; align-items: center; gap: 12px;">' +
                    '<div style="width: 48px; height: 48px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">' + doc.icon + '</div>' +
                    '<div style="flex: 1;">' +
                    '<h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 14px; font-weight: 600; line-height: 1.3;">' + escapeHtml(doc.name) + '</h4>' +
                    '<div style="display: flex; align-items: center; gap: 8px;">' +
                    '<span style="color: #6b7280; font-size: 12px;">' + doc.format + '</span>' +
                    '<span style="color: #9ca3af;">•</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + doc.size + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="position: relative;">' +
                    '<button onclick="event.stopPropagation(); showDocumentMenu(&quot;' + doc.id + '&quot;)" style="background: none; border: none; padding: 4px; cursor: pointer; color: #6b7280;">⋮</button>' +
                    '</div>' +
                    '</div>' +
                    
                    '<!-- Document Info -->' +
                    '<div style="margin-bottom: 12px;">' +
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<span style="background: ' + statusColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase;">' + doc.status + '</span>' +
                    '<span style="background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 6px; font-size: 11px;">' + doc.version + '</span>' +
                    '</div>' +
                    '<div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">📤 ' + doc.uploadedBy + ' • ' + doc.uploadedDate + '</div>' +
                    '<div style="color: #6b7280; font-size: 12px;">✏️ Modified ' + doc.lastModified + '</div>' +
                    '</div>' +
                    
                    '<!-- Document Tags -->' +
                    '<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">';
                
                doc.tags.forEach(tag => {
                    html += '<span style="background: #eff6ff; color: #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 500;">' + tag + '</span>';
                });
                
                html += '</div>' +
                    
                    '<!-- Document Actions -->' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f3f4f6;">' +
                    '<div style="display: flex; align-items: center; gap: 8px;">' +
                    '<div style="display: flex; align-items: center;">';
                
                // Show shared user avatars
                if (doc.shared && doc.shared.length > 0) {
                    doc.shared.slice(0, 3).forEach((user, index) => {
                        const initials = user.split(' ').map(n => n[0]).join('');
                        html += '<div style="width: 24px; height: 24px; background: #6366f1; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; margin-left: ' + (index > 0 ? '-8px' : '0') + '; border: 2px solid white; position: relative; z-index: ' + (3 - index) + ';" title="' + user + '">' + initials + '</div>';
                    });
                    if (doc.shared.length > 3) {
                        html += '<div style="width: 24px; height: 24px; background: #e5e7eb; color: #6b7280; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; margin-left: -8px; border: 2px solid white;">+' + (doc.shared.length - 3) + '</div>';
                    }
                }
                
                html += '</div>' +
                    '</div>' +
                    '<div style="display: flex; gap: 4px;">' +
                    '<button onclick="event.stopPropagation(); downloadDocument(&quot;' + doc.id + '&quot;)" style="background: none; border: none; padding: 4px 8px; cursor: pointer; color: #6b7280; font-size: 18px;" title="Download">⬇</button>' +
                    '<button onclick="event.stopPropagation(); shareDocument(&quot;' + doc.id + '&quot;)" style="background: none; border: none; padding: 4px 8px; cursor: pointer; color: #6b7280; font-size: 18px;" title="Share">↗</button>' +
                    '<button onclick="event.stopPropagation(); editDocument(&quot;' + doc.id + '&quot;)" style="background: none; border: none; padding: 4px 8px; cursor: pointer; color: #6b7280; font-size: 18px;" title="Edit">✏</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            return html || '<div style="text-align: center; padding: 60px; color: #6b7280;">No documents found</div>';
        }

        function generateCustomerAnalyticsTab(customerData) {
            const analytics = getCustomerAnalyticsData(customerData.company);
            
            return '<div>' +
                '<!-- Analytics Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">' +
                '<div>' +
                '<h2 style="color: #1f2937; margin: 0;">📈 Customer Analytics & Insights</h2>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Advanced performance metrics and predictive insights for ' + customerData.company + '</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="generateAnalyticsReport(&quot;' + customerData.company + '&quot;)" class="btn btn-primary">📊 Generate Report</button>' +
                '<button onclick="exportAnalytics(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #059669; color: white;">📥 Export Data</button>' +
                '<button onclick="scheduleAnalyticsReview(&quot;' + customerData.company + '&quot;)" class="btn" style="background: #8b5cf6; color: white;">📅 Schedule Review</button>' +
                '</div>' +
                '</div>' +

                '<!-- Key Performance Indicators -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🎯 Key Performance Indicators</h3>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">' +
                generateKPICards(analytics.kpis) +
                '</div>' +
                '</div>' +

                '<!-- Revenue Analytics -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">💰 Revenue Performance</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRevenueChart(analytics.revenue) +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📊 Revenue Breakdown</h3>' +
                '<div style="display: grid; gap: 16px;">' +
                generateRevenueMetrics(analytics.revenue) +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Engagement Analytics -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔥 Customer Engagement Trends</h3>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Interaction Frequency</h4>' +
                generateInteractionChart(analytics.engagement) +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Support Activity</h4>' +
                generateSupportChart(analytics.support) +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Health Score Analysis -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">❤️ Customer Health Analysis</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateHealthScoreAnalysis(analytics.health) +
                '</div>' +
                '</div>' +

                '<!-- Predictive Insights -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🔮 Predictive Insights & Recommendations</h3>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">' +
                generatePredictiveInsights(analytics.predictions) +
                '</div>' +
                '</div>' +

                '<!-- Risk Assessment -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚠️ Risk Assessment</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRiskAssessment(analytics.risks) +
                '</div>' +
                '</div>' +

                '<!-- Benchmarking -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📏 Industry Benchmarking</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateBenchmarkingAnalysis(analytics.benchmarks) +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function getCustomerAnalyticsData(companyName) {
            return {
                kpis: {
                    totalRevenue: { value: '$2.4M', trend: '+18%', status: 'up', period: 'YoY' },
                    monthlyRecurring: { value: '$195K', trend: '+12%', status: 'up', period: 'MoM' },
                    customerLifetime: { value: '$8.7M', trend: '+25%', status: 'up', period: 'Projected' },
                    churnRisk: { value: '12%', trend: '-5%', status: 'down', period: 'vs Industry' },
                    netPromoterScore: { value: '73', trend: '+8', status: 'up', period: 'Last Quarter' },
                    engagementScore: { value: '8.4/10', trend: '+0.6', status: 'up', period: 'This Month' }
                },
                revenue: {
                    monthly: [
                        { month: 'Jan', amount: 180000, growth: 15 },
                        { month: 'Feb', amount: 185000, growth: 18 },
                        { month: 'Mar', amount: 192000, growth: 22 },
                        { month: 'Apr', amount: 195000, growth: 12 },
                        { month: 'May', amount: 198000, growth: 8 },
                        { month: 'Jun', amount: 205000, growth: 14 }
                    ],
                    breakdown: {
                        subscription: { amount: 1950000, percentage: 81 },
                        professional: { amount: 320000, percentage: 13 },
                        addon: { amount: 130000, percentage: 6 }
                    },
                    forecast: { next_quarter: 625000, confidence: 87 }
                },
                engagement: {
                    weekly: [
                        { week: 'W1', interactions: 28, satisfaction: 8.5 },
                        { week: 'W2', interactions: 32, satisfaction: 8.8 },
                        { week: 'W3', interactions: 25, satisfaction: 8.2 },
                        { week: 'W4', interactions: 35, satisfaction: 9.1 }
                    ],
                    channels: {
                        email: { count: 127, satisfaction: 8.6 },
                        phone: { count: 48, satisfaction: 9.2 },
                        chat: { count: 156, satisfaction: 8.9 },
                        meetings: { count: 23, satisfaction: 9.4 }
                    }
                },
                support: {
                    tickets: { total: 45, resolved: 42, avg_time: '4.2 hours' },
                    severity: { critical: 2, high: 8, medium: 15, low: 20 },
                    satisfaction: { rating: 4.6, responses: 38 }
                },
                health: {
                    current: 94.2,
                    factors: [
                        { name: 'Product Usage', score: 96, weight: 30, status: 'excellent' },
                        { name: 'Payment History', score: 98, weight: 25, status: 'excellent' },
                        { name: 'Support Interactions', score: 89, weight: 20, status: 'good' },
                        { name: 'Feature Adoption', score: 92, weight: 15, status: 'good' },
                        { name: 'Engagement Level', score: 95, weight: 10, status: 'excellent' }
                    ],
                    trend: 'improving'
                },
                predictions: {
                    renewal_probability: { score: 94, confidence: 'high', factors: ['Strong usage', 'Timely payments', 'Positive feedback'] },
                    expansion_opportunity: { score: 78, value: '$450K', timeline: 'Q2 2024' },
                    churn_risk: { score: 6, factors: ['Declining usage in analytics module'], action: 'Schedule product review' }
                },
                risks: [
                    { type: 'payment', severity: 'low', description: 'Invoice payment delayed by 3 days', action: 'Monitor' },
                    { type: 'usage', severity: 'medium', description: 'Analytics module usage down 15%', action: 'Engage customer success' },
                    { type: 'competition', severity: 'low', description: 'Competitor mentioned in recent meeting', action: 'Value reinforcement call' }
                ],
                benchmarks: {
                    industry_avg: {
                        revenue_growth: 12,
                        nps: 45,
                        churn_rate: 18,
                        engagement: 6.2
                    },
                    customer_vs_avg: {
                        revenue_growth: '+6%',
                        nps: '+28',
                        churn_rate: '-6%',
                        engagement: '+2.2'
                    }
                }
            };
        }

        function generateKPICards(kpis) {
            let html = '';
            const kpiList = [
                { key: 'totalRevenue', title: 'Total Revenue', icon: '💰', color: '#10b981' },
                { key: 'monthlyRecurring', title: 'Monthly Recurring Revenue', icon: '🔄', color: '#3b82f6' },
                { key: 'customerLifetime', title: 'Customer Lifetime Value', icon: '💎', color: '#8b5cf6' },
                { key: 'churnRisk', title: 'Churn Risk', icon: '⚠️', color: '#f59e0b' },
                { key: 'netPromoterScore', title: 'Net Promoter Score', icon: '⭐', color: '#ec4899' },
                { key: 'engagementScore', title: 'Engagement Score', icon: '🔥', color: '#06b6d4' }
            ];

            kpiList.forEach(kpi => {
                const data = kpis[kpi.key];
                const trendColor = data.status === 'up' ? '#10b981' : data.status === 'down' ? '#dc2626' : '#6b7280';
                const trendIcon = data.status === 'up' ? '↗' : data.status === 'down' ? '↘' : '→';

                html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s ease;" onmouseover="this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">' +
                    '<div style="width: 48px; height: 48px; background: ' + kpi.color + '15; color: ' + kpi.color + '; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">' + kpi.icon + '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="color: ' + trendColor + '; font-size: 14px; font-weight: 600; margin-bottom: 2px;">' + trendIcon + ' ' + data.trend + '</div>' +
                    '<div style="color: #6b7280; font-size: 12px;">' + data.period + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">' + kpi.title + '</h4>' +
                    '<div style="font-size: 28px; font-weight: 800; color: #1f2937; margin-bottom: 4px;">' + data.value + '</div>' +
                    '</div>';
            });

            return html;
        }

        function generateRevenueChart(revenue) {
            let html = '<div style="margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                '<h4 style="margin: 0; color: #1f2937;">Monthly Revenue Trend</h4>' +
                '<div style="display: flex; gap: 16px; align-items: center;">' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #3b82f6; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Revenue</span></div>' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #10b981; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Growth</span></div>' +
                '</div>' +
                '</div>';

            // Simple chart visualization
            html += '<div style="display: flex; align-items: end; gap: 8px; height: 200px; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">';
            
            const maxRevenue = Math.max(...revenue.monthly.map(m => m.amount));
            revenue.monthly.forEach((month, index) => {
                const heightPercent = (month.amount / maxRevenue) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="width: 100%; background: linear-gradient(to top, #3b82f6, #60a5fa); height: ' + heightPercent + '%; border-radius: 4px 4px 0 0; position: relative; margin-bottom: 8px;">' +
                    '<div style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #6b7280; font-weight: 500;">$' + (month.amount/1000).toFixed(0) + 'K</div>' +
                    '</div>' +
                    '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">' + month.month + '</div>' +
                    '<div style="font-size: 11px; color: #10b981; font-weight: 600;">+' + month.growth + '%</div>' +
                    '</div>';
            });
            
            html += '</div></div>';
            return html;
        }

        function generateRevenueMetrics(revenue) {
            let html = '';
            
            // Revenue breakdown
            html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<h5 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px;">Revenue Sources</h5>';
            
            Object.entries(revenue.breakdown).forEach(([source, data]) => {
                const sourceNames = { subscription: 'Subscriptions', professional: 'Professional Services', addon: 'Add-ons' };
                html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                    '<div style="display: flex; align-items: center; gap: 8px;">' +
                    '<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 4px;"></div>' +
                    '<span style="font-size: 13px; color: #1f2937;">' + sourceNames[source] + '</span>' +
                    '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 13px; font-weight: 600; color: #1f2937;">$' + (data.amount/1000).toFixed(0) + 'K</div>' +
                    '<div style="font-size: 11px; color: #6b7280;">' + data.percentage + '%</div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '</div>';

            // Forecast
            html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<h5 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px;">Next Quarter Forecast</h5>' +
                '<div style="font-size: 24px; font-weight: 700; color: #10b981; margin-bottom: 4px;">$' + (revenue.forecast.next_quarter/1000).toFixed(0) + 'K</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Confidence: ' + revenue.forecast.confidence + '%</div>' +
                '</div>';

            return html;
        }

        function generateInteractionChart(engagement) {
            let html = '<div style="margin-bottom: 16px;">';
            
            // Weekly interaction bars
            html += '<div style="display: flex; align-items: end; gap: 12px; height: 120px; margin-bottom: 16px;">';
            const maxInteractions = Math.max(...engagement.weekly.map(w => w.interactions));
            
            engagement.weekly.forEach(week => {
                const heightPercent = (week.interactions / maxInteractions) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">' + week.interactions + '</div>' +
                    '<div style="width: 100%; background: #3b82f6; height: ' + heightPercent + '%; border-radius: 4px; margin-bottom: 4px;"></div>' +
                    '<div style="font-size: 12px; color: #6b7280;">' + week.week + '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            
            // Channel breakdown
            html += '<div style="font-size: 13px;">';
            Object.entries(engagement.channels).forEach(([channel, data]) => {
                const channelIcons = { email: '📧', phone: '📞', chat: '💬', meetings: '🤝' };
                html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
                    '<span>' + channelIcons[channel] + ' ' + channel.charAt(0).toUpperCase() + channel.slice(1) + '</span>' +
                    '<span style="color: #6b7280;">' + data.count + ' (' + data.satisfaction + '/10)</span>' +
                    '</div>';
            });
            html += '</div>';
            
            return html;
        }

        function generateSupportChart(support) {
            return '<div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">' +
                '<div style="text-align: center;">' +
                '<div style="font-size: 24px; font-weight: 700; color: #10b981;">' + support.tickets.resolved + '/' + support.tickets.total + '</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Tickets Resolved</div>' +
                '</div>' +
                '<div style="text-align: center;">' +
                '<div style="font-size: 24px; font-weight: 700; color: #3b82f6;">' + support.tickets.avg_time + '</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Avg Response Time</div>' +
                '</div>' +
                '</div>' +
                
                '<div style="margin-bottom: 16px;">' +
                '<div style="font-size: 13px; font-weight: 500; color: #1f2937; margin-bottom: 8px;">Ticket Severity</div>' +
                '<div style="display: flex; gap: 4px; height: 8px; border-radius: 4px; overflow: hidden;">' +
                '<div style="flex: ' + support.severity.critical + '; background: #dc2626;" title="Critical: ' + support.severity.critical + '"></div>' +
                '<div style="flex: ' + support.severity.high + '; background: #f59e0b;" title="High: ' + support.severity.high + '"></div>' +
                '<div style="flex: ' + support.severity.medium + '; background: #3b82f6;" title="Medium: ' + support.severity.medium + '"></div>' +
                '<div style="flex: ' + support.severity.low + '; background: #10b981;" title="Low: ' + support.severity.low + '"></div>' +
                '</div>' +
                '</div>' +
                
                '<div style="text-align: center;">' +
                '<div style="font-size: 20px; font-weight: 700; color: #f59e0b;">⭐ ' + support.satisfaction.rating + '/5</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Satisfaction (' + support.satisfaction.responses + ' responses)</div>' +
                '</div>' +
                '</div>';
        }

        function generateHealthScoreAnalysis(health) {
            let html = '<div style="display: grid; grid-template-columns: 200px 1fr; gap: 32px; align-items: center;">';
            
            // Health score circle
            const scorePercent = health.current;
            const scoreColor = scorePercent >= 90 ? '#10b981' : scorePercent >= 70 ? '#f59e0b' : '#dc2626';
            
            html += '<div style="position: relative; width: 160px; height: 160px; margin: 0 auto;">' +
                '<svg width="160" height="160" style="transform: rotate(-90deg);">' +
                '<circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" stroke-width="12"/>' +
                '<circle cx="80" cy="80" r="70" fill="none" stroke="' + scoreColor + '" stroke-width="12" stroke-dasharray="' + (scorePercent * 4.4) + ' 440" stroke-linecap="round"/>' +
                '</svg>' +
                '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">' +
                '<div style="font-size: 32px; font-weight: 800; color: ' + scoreColor + ';">' + scorePercent.toFixed(1) + '</div>' +
                '<div style="font-size: 14px; color: #6b7280;">Health Score</div>' +
                '</div>' +
                '</div>';
            
            // Health factors
            html += '<div>' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Health Factors</h4>' +
                '<div style="display: grid; gap: 12px;">';
            
            health.factors.forEach(factor => {
                const statusColor = factor.status === 'excellent' ? '#10b981' : factor.status === 'good' ? '#3b82f6' : '#f59e0b';
                html += '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                    '<div style="flex: 1;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">' +
                    '<span style="font-size: 14px; color: #1f2937;">' + factor.name + '</span>' +
                    '<span style="font-size: 14px; font-weight: 600; color: ' + statusColor + ';">' + factor.score + '/100</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; gap: 8px;">' +
                    '<div style="flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">' +
                    '<div style="width: ' + factor.score + '%; height: 100%; background: ' + statusColor + ';"></div>' +
                    '</div>' +
                    '<span style="font-size: 11px; color: #6b7280;">' + factor.weight + '%</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '</div></div></div>';
            return html;
        }

        function generatePredictiveInsights(predictions) {
            let html = '';
            
            // Renewal probability
            html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">' +
                '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">' +
                '<div style="width: 40px; height: 40px; background: #10b98115; color: #10b981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🔄</div>' +
                '<div>' +
                '<h4 style="margin: 0; color: #1f2937;">Renewal Probability</h4>' +
                '<div style="font-size: 12px; color: #6b7280;">Confidence: ' + predictions.renewal_probability.confidence + '</div>' +
                '</div>' +
                '</div>' +
                '<div style="font-size: 32px; font-weight: 800; color: #10b981; margin-bottom: 12px;">' + predictions.renewal_probability.score + '%</div>' +
                '<div style="margin-bottom: 12px;">' +
                '<div style="font-size: 13px; font-weight: 500; color: #1f2937; margin-bottom: 6px;">Key Factors:</div>';
            
            predictions.renewal_probability.factors.forEach(factor => {
                html += '<div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">• ' + factor + '</div>';
            });
            
            html += '</div></div>';
            
            // Expansion opportunity
            html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">' +
                '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">' +
                '<div style="width: 40px; height: 40px; background: #8b5cf615; color: #8b5cf6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">📈</div>' +
                '<div>' +
                '<h4 style="margin: 0; color: #1f2937;">Expansion Opportunity</h4>' +
                '<div style="font-size: 12px; color: #6b7280;">Timeline: ' + predictions.expansion_opportunity.timeline + '</div>' +
                '</div>' +
                '</div>' +
                '<div style="font-size: 32px; font-weight: 800; color: #8b5cf6; margin-bottom: 8px;">' + predictions.expansion_opportunity.value + '</div>' +
                '<div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">Potential Value</div>' +
                '<div style="font-size: 16px; font-weight: 600; color: #8b5cf6;">' + predictions.expansion_opportunity.score + '% likelihood</div>' +
                '</div>';
            
            return html;
        }

        function generateRiskAssessment(risks) {
            let html = '<div style="display: grid; gap: 16px;">';
            
            risks.forEach(risk => {
                const severityColor = {
                    'low': '#10b981',
                    'medium': '#f59e0b',
                    'high': '#dc2626',
                    'critical': '#7c2d12'
                }[risk.severity] || '#6b7280';
                
                const riskIcons = {
                    'payment': '💳',
                    'usage': '📊',
                    'competition': '🏆',
                    'support': '🛠️'
                };
                
                html += '<div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; border-left: 4px solid ' + severityColor + '; background: #f8fafc; border-radius: 0 8px 8px 0;">' +
                    '<div style="font-size: 24px;">' + (riskIcons[risk.type] || '⚠️') + '</div>' +
                    '<div style="flex: 1;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                    '<h5 style="margin: 0; color: #1f2937; text-transform: capitalize;">' + risk.type + ' Risk</h5>' +
                    '<span style="background: ' + severityColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: uppercase;">' + risk.severity + '</span>' +
                    '</div>' +
                    '<p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">' + risk.description + '</p>' +
                    '<div style="color: ' + severityColor + '; font-size: 13px; font-weight: 500;">Recommended Action: ' + risk.action + '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            return html;
        }

        function generateBenchmarkingAnalysis(benchmarks) {
            return '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">' +
                '<div>' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Industry Averages</h4>' +
                '<div style="display: grid; gap: 12px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px;">' +
                '<span style="color: #1f2937;">Revenue Growth</span>' +
                '<span style="font-weight: 600; color: #6b7280;">' + benchmarks.industry_avg.revenue_growth + '%</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px;">' +
                '<span style="color: #1f2937;">Net Promoter Score</span>' +
                '<span style="font-weight: 600; color: #6b7280;">' + benchmarks.industry_avg.nps + '</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px;">' +
                '<span style="color: #1f2937;">Churn Rate</span>' +
                '<span style="font-weight: 600; color: #6b7280;">' + benchmarks.industry_avg.churn_rate + '%</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px;">' +
                '<span style="color: #1f2937;">Engagement Score</span>' +
                '<span style="font-weight: 600; color: #6b7280;">' + benchmarks.industry_avg.engagement + '/10</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h4 style="margin: 0 0 16px 0; color: #1f2937;">Customer Performance</h4>' +
                '<div style="display: grid; gap: 12px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border: 1px solid #10b981;">' +
                '<span style="color: #1f2937;">Revenue Growth</span>' +
                '<span style="font-weight: 600; color: #10b981;">↗ ' + benchmarks.customer_vs_avg.revenue_growth + '</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border: 1px solid #10b981;">' +
                '<span style="color: #1f2937;">Net Promoter Score</span>' +
                '<span style="font-weight: 600; color: #10b981;">↗ ' + benchmarks.customer_vs_avg.nps + '</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border: 1px solid #10b981;">' +
                '<span style="color: #1f2937;">Churn Rate</span>' +
                '<span style="font-weight: 600; color: #10b981;">↘ ' + benchmarks.customer_vs_avg.churn_rate + '</span>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border: 1px solid #10b981;">' +
                '<span style="color: #1f2937;">Engagement Score</span>' +
                '<span style="font-weight: 600; color: #10b981;">↗ ' + benchmarks.customer_vs_avg.engagement + '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Customer Profile Action Functions
        function addCustomProfile() {
            showNotification('➕ Opening add customer profile form...', 'info');
        }

        function bulkProfileActions() {
            showNotification('⚙️ Opening bulk profile actions...', 'info');
        }

        function searchCustomerProfiles(searchTerm) {
            console.log('Searching customer profiles for: ' + searchTerm);
        }

        function filterProfilesByType(type) {
            showNotification('Filtering profiles by type: ' + (type || 'All'), 'info');
        }

        function filterProfilesByActivity(activity) {
            showNotification('Filtering profiles by activity: ' + (activity || 'All'), 'info');
        }

        function quickCallCustomer(customerId) {
            showNotification('📞 Initiating call to customer: ' + customerId, 'info');
        }

        function quickEmailCustomer(customerId) {
            showNotification('📧 Opening email composer for: ' + customerId, 'info');
        }

        function viewProfileDetails(customerId) {
            openCustomerProfilePage(customerId);
        }

        // Customer Actions Functions
        function scheduleCustomerMeeting(customerName) {
            showNotification('📅 Scheduling meeting with: ' + customerName, 'info');
        }

        function createCustomerCase(customerName) {
            showNotification('📝 Creating new case for: ' + customerName, 'info');
        }

        function sendCustomerEmail(customerName) {
            showNotification('📧 Opening email composer for: ' + customerName, 'info');
        }

        function generateCustomerReport(customerName) {
            showNotification('📊 Generating comprehensive report for: ' + customerName, 'success');
        }

        // Contact Management Functions
        function openContactDetail(contactId) {
            showNotification('👤 Opening detailed contact profile for: ' + contactId, 'info');
        }

        function addNewContact(customerName) {
            showNotification('➕ Adding new contact for: ' + customerName, 'info');
        }

        function importContacts(customerName) {
            showNotification('📥 Importing contacts for: ' + customerName, 'info');
        }

        function exportContactList(customerName) {
            showNotification('📊 Exporting contact list for: ' + customerName, 'success');
        }

        function callContact(contactId, phone) {
            showNotification('📞 Calling contact: ' + contactId + ' at ' + phone, 'info');
        }

        // Customer Dashboard Functions
        function generateCustomerKPICards() {
            const kpis = [
                { title: 'Total Revenue', value: '$47.2M', trend: '+18%', status: 'up', icon: '💰', color: '#10b981' },
                { title: 'Active Customers', value: '2,847', trend: '+12%', status: 'up', icon: '👥', color: '#3b82f6' },
                { title: 'Customer Lifetime Value', value: '$16.8K', trend: '+25%', status: 'up', icon: '💎', color: '#8b5cf6' },
                { title: 'Monthly Churn Rate', value: '3.2%', trend: '-1.5%', status: 'down', icon: '📉', color: '#f59e0b' },
                { title: 'Net Promoter Score', value: '68', trend: '+12', status: 'up', icon: '⭐', color: '#ec4899' },
                { title: 'Customer Satisfaction', value: '4.7/5', trend: '+0.3', status: 'up', icon: '😊', color: '#06b6d4' }
            ];
            
            let html = '';
            kpis.forEach(kpi => {
                const trendColor = kpi.status === 'up' ? '#10b981' : kpi.status === 'down' ? '#dc2626' : '#6b7280';
                const trendIcon = kpi.status === 'up' ? '↗' : kpi.status === 'down' ? '↘' : '→';
                
                html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s ease;" onmouseover="this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">' +
                    '<div style="font-size: 32px;">' + kpi.icon + '</div>' +
                    '<div style="text-align: right;">' +
                    '<div style="font-size: 28px; font-weight: 700; color: ' + kpi.color + '; margin-bottom: 4px;">' + kpi.value + '</div>' +
                    '<div style="display: flex; align-items: center; gap: 4px; justify-content: flex-end;">' +
                    '<span style="color: ' + trendColor + '; font-weight: 600; font-size: 14px;">' + trendIcon + ' ' + kpi.trend + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="color: #1f2937; font-weight: 600; font-size: 16px;">' + kpi.title + '</div>' +
                    '</div>';
            });
            
            return html;
        }

        function generateCustomerRevenueChart() {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const revenue = [3200, 3800, 4200, 4100, 4500, 4800, 5200, 4900, 5100, 5400, 5800, 6200];
            
            let html = '<div style="margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                '<h4 style="margin: 0; color: #1f2937;">Monthly Revenue Growth ($K)</h4>' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #10b981; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Revenue</span></div>' +
                '</div>';
            
            // Chart visualization
            html += '<div style="display: flex; align-items: end; gap: 8px; height: 200px; margin-bottom: 16px; padding: 0 8px;">';
            const maxRevenue = Math.max(...revenue);
            
            revenue.forEach((amount, index) => {
                const heightPercent = (amount / maxRevenue) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">$' + amount + 'K</div>' +
                    '<div style="width: 100%; height: ' + heightPercent + '%; background: linear-gradient(to top, #10b981, #34d399); border-radius: 2px 2px 0 0; transition: all 0.3s ease;" onmouseover="this.style.transform=&quot;scaleY(1.1)&quot;" onmouseout="this.style.transform=&quot;scaleY(1)&quot;"></div>' +
                    '<div style="font-size: 11px; color: #6b7280; margin-top: 8px; font-weight: 500;">' + months[index] + '</div>' +
                '</div>';
            });
            
            html += '</div>';
            
            // Summary stats
            html += '<div style="display: flex; justify-content: space-around; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #10b981;">$47.2M</div><div style="font-size: 12px; color: #6b7280;">Total Revenue</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #3b82f6;">+23%</div><div style="font-size: 12px; color: #6b7280;">Growth Rate</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #8b5cf6;">$3.9M</div><div style="font-size: 12px; color: #6b7280;">Average Monthly</div></div>' +
                '</div>';
            
            return html + '</div>';
        }

        function generateGrowthMetrics() {
            const metrics = [
                { label: 'New Customers', value: '+284', trend: '+18%', color: '#10b981' },
                { label: 'Customer Retention', value: '94.2%', trend: '+2.3%', color: '#3b82f6' },
                { label: 'Expansion Revenue', value: '$2.1M', trend: '+45%', color: '#8b5cf6' },
                { label: 'Average Deal Size', value: '$12.8K', trend: '+8%', color: '#f59e0b' }
            ];
            
            let html = '';
            metrics.forEach(metric => {
                html += '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                    '<span style="color: #6b7280; font-size: 14px;">' + metric.label + '</span>' +
                    '<span style="color: ' + metric.color + '; font-size: 12px; font-weight: 600;">' + metric.trend + '</span>' +
                    '</div>' +
                    '<div style="font-size: 24px; font-weight: 700; color: ' + metric.color + ';">' + metric.value + '</div>' +
                    '</div>';
            });
            
            return html;
        }

        function generateSegmentationChart() {
            const segments = [
                { name: 'Enterprise', count: 847, percentage: 30, color: '#10b981' },
                { name: 'Mid-Market', count: 1278, percentage: 45, color: '#3b82f6' },
                { name: 'SMB', count: 722, percentage: 25, color: '#f59e0b' }
            ];
            
            let html = '<div style="margin-bottom: 24px;">';
            
            // Segment bars
            segments.forEach(segment => {
                html += '<div style="margin-bottom: 16px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
                    '<span style="color: #1f2937; font-weight: 500;">' + segment.name + '</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + segment.count + ' customers</span>' +
                    '</div>' +
                    '<div style="width: 100%; height: 12px; background: #f3f4f6; border-radius: 6px; overflow: hidden;">' +
                    '<div style="width: ' + segment.percentage + '%; height: 100%; background: ' + segment.color + '; border-radius: 6px; transition: all 0.3s ease;"></div>' +
                    '</div>' +
                    '<div style="text-align: right; margin-top: 4px; color: ' + segment.color + '; font-weight: 600; font-size: 14px;">' + segment.percentage + '%</div>' +
                    '</div>';
            });
            
            // Summary stats
            html += '<div style="display: flex; justify-content: space-around; margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #10b981;">2,847</div><div style="font-size: 12px; color: #6b7280;">Total Customers</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #3b82f6;">$47.2M</div><div style="font-size: 12px; color: #6b7280;">Total Revenue</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #8b5cf6;">$16.8K</div><div style="font-size: 12px; color: #6b7280;">Avg Customer Value</div></div>' +
                '</div>';
            
            html += '</div>';
            
            return html;
        }

        function generateGeographicChart() {
            const regions = [
                { name: 'North America', customers: 1285, revenue: '$18.4M', color: '#10b981' },
                { name: 'Europe', customers: 892, revenue: '$12.8M', color: '#3b82f6' },
                { name: 'Asia Pacific', customers: 567, revenue: '$11.2M', color: '#f59e0b' },
                { name: 'Other', customers: 103, revenue: '$4.8M', color: '#6b7280' }
            ];
            
            let html = '';
            regions.forEach((region, index) => {
                const widthPercent = (region.customers / 1285) * 100;
                html += '<div style="margin-bottom: 16px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
                    '<span style="color: #1f2937; font-weight: 500;">' + region.name + '</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + region.customers + ' customers</span>' +
                    '</div>' +
                    '<div style="width: 100%; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">' +
                    '<div style="width: ' + widthPercent + '%; height: 100%; background: ' + region.color + '; border-radius: 4px; transition: all 0.3s ease;"></div>' +
                    '</div>' +
                    '<div style="text-align: right; margin-top: 4px; color: ' + region.color + '; font-weight: 600; font-size: 14px;">' + region.revenue + '</div>' +
                    '</div>';
            });
            
            return html;
        }

        function generateHealthScoreChart() {
            const healthScore = 87.3;
            const circumference = 2 * Math.PI * 45;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (healthScore / 100) * circumference;
            
            return '<div style="text-align: center;">' +
                '<div style="position: relative; width: 120px; height: 120px; margin: 0 auto 20px;">' +
                '<svg width="120" height="120" style="transform: rotate(-90deg);">' +
                '<circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"></circle>' +
                '<circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" stroke-width="8" stroke-dasharray="' + strokeDasharray + '" stroke-dashoffset="' + strokeDashoffset + '" stroke-linecap="round"></circle>' +
                '</svg>' +
                '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">' +
                '<div style="font-size: 24px; font-weight: 700; color: #10b981;">' + healthScore + '</div>' +
                '<div style="font-size: 12px; color: #6b7280;">Health Score</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: grid; gap: 8px; font-size: 12px;">' +
                '<div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">Excellent</span><span style="color: #10b981; font-weight: 600;">65%</span></div>' +
                '<div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">Good</span><span style="color: #3b82f6; font-weight: 600;">28%</span></div>' +
                '<div style="display: flex; justify-content: space-between;"><span style="color: #6b7280;">At Risk</span><span style="color: #f59e0b; font-weight: 600;">7%</span></div>' +
                '</div>' +
                '</div>';
        }

        function generateSatisfactionChart() {
            const satisfaction = [4.2, 4.3, 4.5, 4.4, 4.6, 4.7, 4.8, 4.7, 4.6, 4.8, 4.9, 4.7];
            const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
            
            let html = '<div style="display: flex; align-items: end; gap: 4px; height: 100px; margin-bottom: 16px;">';
            const maxSat = Math.max(...satisfaction);
            
            satisfaction.forEach((rating, index) => {
                const heightPercent = (rating / 5) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="width: 100%; height: ' + heightPercent + '%; background: linear-gradient(to top, #ec4899, #f472b6); border-radius: 2px;" title="' + rating + '/5"></div>' +
                    '<div style="font-size: 10px; color: #6b7280; margin-top: 4px;">' + months[index] + '</div>' +
                '</div>';
            });
            
            html += '</div>' +
                '<div style="text-align: center;">' +
                '<div style="font-size: 32px; font-weight: 700; color: #ec4899; margin-bottom: 4px;">4.7</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Average Rating</div>' +
                '<div style="color: #10b981; font-size: 12px; margin-top: 4px;">↗ +0.3 this quarter</div>' +
                '</div>';
            
            return html;
        }

        function generateChurnRiskChart() {
            const riskLevels = [
                { label: 'Low Risk', count: 2456, percentage: 86, color: '#10b981' },
                { label: 'Medium Risk', count: 284, percentage: 10, color: '#f59e0b' },
                { label: 'High Risk', count: 107, percentage: 4, color: '#dc2626' }
            ];
            
            let html = '';
            riskLevels.forEach(level => {
                html += '<div style="margin-bottom: 12px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">' +
                    '<span style="color: #1f2937; font-size: 12px; font-weight: 500;">' + level.label + '</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + level.count + '</span>' +
                    '</div>' +
                    '<div style="width: 100%; height: 6px; background: #f3f4f6; border-radius: 3px;">' +
                    '<div style="width: ' + level.percentage + '%; height: 100%; background: ' + level.color + '; border-radius: 3px;"></div>' +
                    '</div>' +
                    '</div>';
            });
            
            html += '<div style="margin-top: 16px; text-align: center;">' +
                '<div style="color: #10b981; font-size: 18px; font-weight: 600;">96%</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Retention Rate</div>' +
                '</div>';
            
            return html;
        }

        function generateActivityTrendsChart() {
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
            const activities = [
                { name: 'Emails', data: [245, 287, 312, 298, 334, 356], color: '#3b82f6' },
                { name: 'Calls', data: [89, 94, 102, 87, 115, 123], color: '#10b981' },
                { name: 'Meetings', data: [34, 42, 38, 45, 52, 48], color: '#f59e0b' }
            ];
            
            let html = '<div style="display: flex; align-items: end; gap: 12px; height: 150px; margin-bottom: 16px;">';
            
            weeks.forEach((week, weekIndex) => {
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; height: 100%;">';
                
                const totalWeekActivity = activities.reduce((sum, activity) => sum + activity.data[weekIndex], 0);
                const maxTotal = Math.max(...weeks.map((_, i) => activities.reduce((sum, activity) => sum + activity.data[i], 0)));
                
                activities.forEach(activity => {
                    const heightPercent = (activity.data[weekIndex] / maxTotal) * 100;
                    html += '<div style="width: 100%; height: ' + heightPercent + '%; background: ' + activity.color + '; border-radius: 2px;" title="' + activity.name + ': ' + activity.data[weekIndex] + '"></div>';
                });
                
                html += '<div style="font-size: 10px; color: #6b7280; margin-top: 8px; text-align: center;">W' + (weekIndex + 1) + '</div>';
                html += '</div>';
            });
            
            html += '</div>';
            
            // Legend
            html += '<div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 12px;">';
            activities.forEach(activity => {
                html += '<div style="display: flex; align-items: center; gap: 6px;">' +
                    '<div style="width: 12px; height: 3px; background: ' + activity.color + '; border-radius: 2px;"></div>' +
                    '<span style="font-size: 12px; color: #6b7280;">' + activity.name + '</span>' +
                    '</div>';
            });
            html += '</div>';
            
            return html;
        }

        function generateTopEngagedCustomers() {
            const customers = [
                { name: 'Microsoft Corp', score: 9.8, revenue: '$2.4M', color: '#10b981' },
                { name: 'Amazon Web Services', score: 9.6, revenue: '$1.8M', color: '#3b82f6' },
                { name: 'Google Cloud', score: 9.4, revenue: '$1.6M', color: '#8b5cf6' },
                { name: 'Salesforce Inc', score: 9.2, revenue: '$1.2M', color: '#f59e0b' },
                { name: 'Apple Inc', score: 9.0, revenue: '$980K', color: '#ec4899' }
            ];
            
            let html = '';
            customers.forEach((customer, index) => {
                html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: ' + (index % 2 === 0 ? '#f8fafc' : 'white') + '; border-radius: 8px; margin-bottom: 8px;">' +
                    '<div style="flex: 1;">' +
                    '<div style="color: #1f2937; font-weight: 600; font-size: 14px; margin-bottom: 2px;">' + customer.name + '</div>' +
                    '<div style="color: #6b7280; font-size: 12px;">' + customer.revenue + ' revenue</div>' +
                    '</div>' +
                    '<div style="text-align: center;">' +
                    '<div style="background: ' + customer.color + '; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">' + customer.score + '</div>' +
                    '</div>' +
                    '</div>';
            });
            
            return html;
        }

        function generatePredictiveInsightsSection() {
            return '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;">' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🔮 Renewal Predictions</h4>' +
                '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<div style="font-size: 18px; font-weight: 600; color: #059669; margin-bottom: 4px;">92.3%</div>' +
                '<div style="color: #065f46; font-size: 12px;">Likely to renew in Q1</div>' +
                '</div>' +
                '<div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px;">' +
                '<div style="font-size: 18px; font-weight: 600; color: #d97706; margin-bottom: 4px;">7.7%</div>' +
                '<div style="color: #92400e; font-size: 12px;">At risk of churn</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📈 Expansion Opportunities</h4>' +
                '<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 12px;">' +
                '<div style="font-size: 18px; font-weight: 600; color: #2563eb; margin-bottom: 4px;">$12.8M</div>' +
                '<div style="color: #1e40af; font-size: 12px;">Potential upsell revenue</div>' +
                '</div>' +
                '<div style="background: #f3e8ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px;">' +
                '<div style="font-size: 18px; font-weight: 600; color: #7c3aed; margin-bottom: 4px;">847</div>' +
                '<div style="color: #5b21b6; font-size: 12px;">Cross-sell candidates</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🎯 Recommended Actions</h4>' +
                '<div style="display: grid; gap: 8px;">' +
                '<div style="background: #f8fafc; border-left: 3px solid #10b981; padding: 12px; font-size: 12px;">' +
                '<strong>Schedule Reviews:</strong> 47 customers due for QBRs' +
                '</div>' +
                '<div style="background: #f8fafc; border-left: 3px solid #3b82f6; padding: 12px; font-size: 12px;">' +
                '<strong>Upsell Focus:</strong> 23 high-value expansion targets' +
                '</div>' +
                '<div style="background: #f8fafc; border-left: 3px solid #f59e0b; padding: 12px; font-size: 12px;">' +
                '<strong>Risk Mitigation:</strong> 12 accounts need attention' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateRecentActivityFeed() {
            const activities = [
                { type: 'new', customer: 'Tesla Inc', action: 'New enterprise account created', time: '2 hours ago', icon: '🎉', color: '#10b981' },
                { type: 'expansion', customer: 'Microsoft Corp', action: 'Expanded to Premium plan (+$50K ARR)', time: '4 hours ago', icon: '📈', color: '#3b82f6' },
                { type: 'meeting', customer: 'Amazon AWS', action: 'Quarterly business review completed', time: '6 hours ago', icon: '📅', color: '#8b5cf6' },
                { type: 'risk', customer: 'Shopify Inc', action: 'Health score dropped to 67 (was 82)', time: '8 hours ago', icon: '⚠️', color: '#f59e0b' },
                { type: 'support', customer: 'Google Cloud', action: '3 support tickets resolved', time: '12 hours ago', icon: '🎫', color: '#06b6d4' },
                { type: 'feedback', customer: 'Apple Inc', action: 'NPS survey completed (Score: 9)', time: '1 day ago', icon: '⭐', color: '#ec4899' }
            ];
            
            let html = '<div style="max-height: 300px; overflow-y: auto;">';
            activities.forEach((activity, index) => {
                html += '<div style="display: flex; align-items: center; gap: 16px; padding: 12px; border-bottom: 1px solid #f3f4f6;">' +
                    '<div style="font-size: 24px;">' + activity.icon + '</div>' +
                    '<div style="flex: 1;">' +
                    '<div style="color: #1f2937; font-weight: 600; margin-bottom: 2px;">' + activity.customer + '</div>' +
                    '<div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">' + activity.action + '</div>' +
                    '<div style="color: #9ca3af; font-size: 12px;">' + activity.time + '</div>' +
                    '</div>' +
                    '<div style="width: 4px; height: 40px; background: ' + activity.color + '; border-radius: 2px;"></div>' +
                    '</div>';
            });
            html += '</div>';
            
            return html;
        }

        // Dashboard Action Functions
        function refreshDashboard() {
            showNotification('🔄 Refreshing customer dashboard...', 'info');
        }

        function exportDashboard() {
            showNotification('📥 Exporting dashboard data...', 'success');
        }

        function scheduleDashboard() {
            showNotification('📅 Opening dashboard schedule settings...', 'info');
        }

        function emailContact(contactId, email) {
            showNotification('📧 Emailing contact: ' + contactId + ' at ' + email, 'info');
        }

        function scheduleWithContact(contactId) {
            showNotification('📅 Scheduling meeting with contact: ' + contactId, 'info');
        }

        function viewContactHistory(contactId) {
            showContactHistoryModal(contactId);
        }

        function showContactHistoryModal(contactId) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="width: 800px; max-height: 90vh; overflow-y: auto;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">📊 Contact Interaction History</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                generateContactHistoryContent(contactId) +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function generateContactHistoryContent(contactId) {
            return '<div>' +
                '<!-- Contact Overview -->' +
                '<div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">' +
                '<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">' +
                '<div style="width: 48px; height: 48px; background: #6366f1; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 600;">JD</div>' +
                '<div>' +
                '<h3 style="margin: 0; color: #1f2937;">John Doe</h3>' +
                '<p style="margin: 2px 0 0 0; color: #6b7280;">Senior Account Manager</p>' +
                '</div>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; font-size: 14px;">' +
                '<div style="text-align: center;"><div style="font-weight: 600; color: #059669;">47</div><div style="color: #6b7280;">Total Interactions</div></div>' +
                '<div style="text-align: center;"><div style="font-weight: 600; color: #3b82f6;">12</div><div style="color: #6b7280;">Emails</div></div>' +
                '<div style="text-align: center;"><div style="font-weight: 600; color: #f59e0b;">8</div><div style="color: #6b7280;">Calls</div></div>' +
                '<div style="text-align: center;"><div style="font-weight: 600; color: #8b5cf6;">5</div><div style="color: #6b7280;">Meetings</div></div>' +
                '</div>' +
                '</div>' +

                '<!-- Interaction Timeline -->' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">Recent Interactions</h3>' +
                '<div class="contact-timeline" style="position: relative;">' +
                
                '<!-- Timeline Item 1 -->' +
                '<div style="display: flex; margin-bottom: 24px; position: relative;">' +
                '<div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; position: relative; z-index: 1;">' +
                '<span style="color: white; font-size: 14px;">📧</span>' +
                '</div>' +
                '<div style="flex: 1; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="margin: 0; color: #1f2937; font-size: 16px;">Email Discussion</h4>' +
                '<span style="color: #6b7280; font-size: 12px;">Today, 2:30 PM</span>' +
                '</div>' +
                '<p style="color: #4b5563; margin-bottom: 8px;">Follow-up discussion about Q4 pricing structure and contract renewal terms.</p>' +
                '<div style="display: flex; gap: 8px;">' +
                '<span style="background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Contract</span>' +
                '<span style="background: #f3e8ff; color: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Pricing</span>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Timeline Item 2 -->' +
                '<div style="display: flex; margin-bottom: 24px; position: relative;">' +
                '<div style="width: 32px; height: 32px; background: #10b981; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; position: relative; z-index: 1;">' +
                '<span style="color: white; font-size: 14px;">📞</span>' +
                '</div>' +
                '<div style="flex: 1; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="margin: 0; color: #1f2937; font-size: 16px;">Phone Call - Issue Resolution</h4>' +
                '<span style="color: #6b7280; font-size: 12px;">Yesterday, 4:15 PM</span>' +
                '</div>' +
                '<p style="color: #4b5563; margin-bottom: 8px;">Technical support session regarding API integration issues. Problem resolved successfully.</p>' +
                '<div style="display: flex; gap: 8px;">' +
                '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Resolved</span>' +
                '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Technical</span>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Timeline Item 3 -->' +
                '<div style="display: flex; margin-bottom: 24px; position: relative;">' +
                '<div style="width: 32px; height: 32px; background: #f59e0b; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; position: relative; z-index: 1;">' +
                '<span style="color: white; font-size: 14px;">📅</span>' +
                '</div>' +
                '<div style="flex: 1; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="margin: 0; color: #1f2937; font-size: 16px;">Strategy Planning Meeting</h4>' +
                '<span style="color: #6b7280; font-size: 12px;">3 days ago, 10:00 AM</span>' +
                '</div>' +
                '<p style="color: #4b5563; margin-bottom: 8px;">Quarterly business review and strategic planning session for 2024 objectives.</p>' +
                '<div style="display: flex; gap: 8px;">' +
                '<span style="background: #fef2f2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Strategic</span>' +
                '<span style="background: #ede9fe; color: #7c2d12; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Planning</span>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Timeline Item 4 -->' +
                '<div style="display: flex; margin-bottom: 24px; position: relative;">' +
                '<div style="width: 32px; height: 32px; background: #8b5cf6; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; position: relative; z-index: 1;">' +
                '<span style="color: white; font-size: 14px;">📝</span>' +
                '</div>' +
                '<div style="flex: 1; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                '<h4 style="margin: 0; color: #1f2937; font-size: 16px;">Proposal Submission</h4>' +
                '<span style="color: #6b7280; font-size: 12px;">1 week ago</span>' +
                '</div>' +
                '<p style="color: #4b5563; margin-bottom: 8px;">Submitted comprehensive proposal for enterprise platform upgrade and customization services.</p>' +
                '<div style="display: flex; gap: 8px;">' +
                '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Proposal</span>' +
                '<span style="background: #ecfccb; color: #365314; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Enterprise</span>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '</div>' +

                '<!-- Action Buttons -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">' +
                '<div style="color: #6b7280; font-size: 14px;">Showing recent 4 of 47 interactions</div>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button onclick="exportContactHistory(&quot;' + contactId + '&quot;)" style="background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer;">📊 Export History</button>' +
                '<button onclick="scheduleWithContact(&quot;' + contactId + '&quot;)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer;">📅 Schedule Follow-up</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function exportContactHistory(contactId) {
            showNotification('📊 Exporting interaction history for contact: ' + contactId, 'success');
        }

        function openContactDetail(contactId) {
            showContactDetailModal(contactId);
        }

        function showContactDetailModal(contactId) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = 
                '<div class="modal-content" style="width: 900px; max-height: 95vh; overflow-y: auto;">' +
                '<div class="modal-header">' +
                '<h2 class="modal-title">👤 Contact Profile Details</h2>' +
                '<button class="close-btn" onclick="this.closest(&quot;.modal&quot;).remove()">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                generateContactDetailContent(contactId) +
                '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        function generateContactDetailContent(contactId) {
            return '<div>' +
                '<!-- Contact Profile Header -->' +
                '<div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 32px; margin: -20px -20px 24px -20px; border-radius: 0;">' +
                '<div style="display: flex; align-items: center; gap: 24px;">' +
                '<div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.3); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px;">JD</div>' +
                '<div>' +
                '<h1 style="margin: 0 0 8px 0; font-size: 28px;">John Doe</h1>' +
                '<p style="margin: 0 0 8px 0; font-size: 18px; opacity: 0.9;">Senior Account Manager</p>' +
                '<div style="display: flex; gap: 12px; align-items: center;">' +
                '<span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px;">Primary Contact</span>' +
                '<span style="display: flex; align-items: center; gap: 4px; font-size: 14px;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 4px;"></span>Active</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Contact Details Grid -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                
                '<!-- Left Column - Contact Information -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📋 Contact Information</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Email</div>' +
                '<div style="color: #1f2937; font-weight: 500; margin-bottom: 4px;">john.doe@microsoft.com</div>' +
                '<button onclick="emailContact(&quot;john-doe&quot;, &quot;john.doe@microsoft.com&quot;)" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">📧 Send Email</button>' +
                '</div>' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Phone</div>' +
                '<div style="color: #1f2937; font-weight: 500; margin-bottom: 4px;">+1 (425) 882-8080</div>' +
                '<button onclick="callContact(&quot;john-doe&quot;, &quot;+1 (425) 882-8080&quot;)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">📞 Call Now</button>' +
                '</div>' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Department</div>' +
                '<div style="color: #1f2937; font-weight: 500;">Executive</div>' +
                '</div>' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Role</div>' +
                '<div style="color: #1f2937; font-weight: 500;">Decision Maker</div>' +
                '</div>' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Preferred Contact</div>' +
                '<div style="color: #1f2937; font-weight: 500;">Email</div>' +
                '</div>' +
                
                '<div>' +
                '<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px; font-weight: 500; text-transform: uppercase;">Timezone</div>' +
                '<div style="color: #1f2937; font-weight: 500;">PST (UTC-8)</div>' +
                '</div>' +
                
                '</div>' +
                '</div>' +

                '<!-- Expertise & Skills -->' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">💡 Areas of Expertise</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">' +
                '<div style="display: flex; flex-wrap: wrap; gap: 8px;">' +
                '<span style="background: #dbeafe; color: #1d4ed8; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">Strategic Planning</span>' +
                '<span style="background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">Cloud Computing</span>' +
                '<span style="background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">AI & Machine Learning</span>' +
                '<span style="background: #f3e8ff; color: #7c3aed; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;">Product Management</span>' +
                '</div>' +
                '</div>' +

                '<!-- Social Links -->' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🔗 Social & Professional</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">' +
                '<div style="display: flex; gap: 12px;">' +
                '<a href="https://linkedin.com/in/johndoe" target="_blank" style="display: flex; align-items: center; gap: 8px; color: #0077b5; text-decoration: none; background: #f0f9ff; padding: 8px 16px; border-radius: 8px; border: 1px solid #0077b5;">💼 LinkedIn Profile</a>' +
                '<a href="https://twitter.com/johndoe" target="_blank" style="display: flex; align-items: center; gap: 8px; color: #1da1f2; text-decoration: none; background: #f0f9ff; padding: 8px 16px; border-radius: 8px; border: 1px solid #1da1f2;">🐦 Twitter</a>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Right Column - Quick Actions & Stats -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚡ Quick Actions</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">' +
                '<div style="display: grid; gap: 12px;">' +
                '<button onclick="scheduleWithContact(&quot;john-doe&quot;)" style="width: 100%; background: #6366f1; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">📅 Schedule Meeting</button>' +
                '<button onclick="createTaskForContact(&quot;john-doe&quot;)" style="width: 100%; background: #f59e0b; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">📝 Create Task</button>' +
                '<button onclick="addContactNote(&quot;john-doe&quot;)" style="width: 100%; background: #059669; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">📄 Add Note</button>' +
                '<button onclick="viewContactHistory(&quot;john-doe&quot;)" style="width: 100%; background: #8b5cf6; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">📊 View History</button>' +
                '</div>' +
                '</div>' +

                '<!-- Contact Statistics -->' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📈 Interaction Stats</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">' +
                '<div style="display: grid; gap: 16px;">' +
                
                '<div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="font-size: 24px; font-weight: 700; color: #3b82f6;">47</div>' +
                '<div style="font-size: 12px; color: #6b7280; font-weight: 500;">TOTAL INTERACTIONS</div>' +
                '</div>' +
                
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">' +
                '<div style="text-align: center; padding: 8px; background: #f0f9ff; border-radius: 6px;">' +
                '<div style="font-weight: 600; color: #3b82f6;">12</div><div style="color: #6b7280; font-size: 11px;">Emails</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 8px; background: #f0fdf4; border-radius: 6px;">' +
                '<div style="font-weight: 600; color: #10b981;">8</div><div style="color: #6b7280; font-size: 11px;">Calls</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 8px; background: #fef3c7; border-radius: 6px;">' +
                '<div style="font-weight: 600; color: #f59e0b;">5</div><div style="color: #6b7280; font-size: 11px;">Meetings</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 8px; background: #faf5ff; border-radius: 6px;">' +
                '<div style="font-weight: 600; color: #8b5cf6;">22</div><div style="color: #6b7280; font-size: 11px;">Other</div>' +
                '</div>' +
                '</div>' +
                
                '<div style="padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center;">' +
                'Last Contact: 2 hours ago' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Recent Activity Preview -->' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🕒 Recent Activity</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">' +
                '<div style="display: grid; gap: 12px; font-size: 13px;">' +
                '<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8fafc; border-radius: 6px;">' +
                '<span>📧</span><span style="color: #6b7280;">Email - Today 2:30 PM</span>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8fafc; border-radius: 6px;">' +
                '<span>📞</span><span style="color: #6b7280;">Call - Yesterday 4:15 PM</span>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8fafc; border-radius: 6px;">' +
                '<span>📅</span><span style="color: #6b7280;">Meeting - 3 days ago</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function createTaskForContact(contactId) {
            showNotification('📝 Creating task for contact: ' + contactId, 'info');
        }

        function addContactNote(contactId) {
            showNotification('📄 Adding note for contact: ' + contactId, 'info');
        }

        // Navigation Functions
        function goBackToCustomers() {
            // Return to customers page
            showCustomersPage();
        }

        // Case Management Functions
        function createNewCase(customerName) {
            showNotification('📝 Creating new case for: ' + customerName, 'info');
        }

        function exportCases(customerName) {
            showNotification('📊 Exporting cases for: ' + customerName, 'success');
        }

        function openCaseDetail(caseId) {
            showNotification('📋 Opening case details for: ' + caseId, 'info');
        }

        function updateCaseStatus(caseId) {
            showNotification('📝 Updating status for case: ' + caseId, 'info');
        }

        function addCaseComment(caseId) {
            showNotification('💬 Adding comment to case: ' + caseId, 'info');
        }

        // Interaction Management Functions
        function logNewInteraction(customerName) {
            showNotification('📝 Opening interaction log form for: ' + customerName, 'info');
        }

        function exportInteractions(customerName) {
            showNotification('📊 Exporting interaction history for: ' + customerName, 'success');
        }

        function viewInteractionDetail(interactionId) {
            showNotification('👁️ Opening interaction details: ' + interactionId, 'info');
        }

        function replyToInteraction(interactionId) {
            showNotification('↩️ Opening reply form for interaction: ' + interactionId, 'info');
        }

        function addInteractionNote(interactionId) {
            showNotification('📝 Adding note to interaction: ' + interactionId, 'info');
        }

        // Document Management Functions  
        function uploadDocument(customerName) {
            showNotification('⬆️ Opening document upload for: ' + customerName, 'info');
        }

        function createFolder(customerName) {
            showNotification('📁 Creating new folder for: ' + customerName, 'info');
        }

        function exportDocuments(customerName) {
            showNotification('📥 Downloading all documents for: ' + customerName, 'info');
        }

        function openFolder(folderType) {
            showNotification('📂 Opening folder: ' + folderType, 'info');
        }

        function toggleDocumentView() {
            showNotification('⚏ Toggling document view mode', 'info');
        }

        function sortDocuments(criteria) {
            showNotification('↕ Sorting documents by: ' + criteria, 'info');
        }

        function openDocument(documentId) {
            showNotification('📄 Opening document: ' + documentId, 'info');
        }

        function showDocumentMenu(documentId) {
            showNotification('⋮ Opening document menu for: ' + documentId, 'info');
        }

        function downloadDocument(documentId) {
            showNotification('⬇ Downloading document: ' + documentId, 'success');
        }

        function shareDocument(documentId) {
            showNotification('↗ Opening share dialog for document: ' + documentId, 'info');
        }

        function editDocument(documentId) {
            showNotification('✏ Opening document editor for: ' + documentId, 'info');
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

        // Enterprise Rule Engine System
        function showRuleEngineModal() {
            // Show rule engine as a page instead of modal
            showRuleEnginePage();
        }

        function showRuleEnginePage() {
            // Update page title
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = '🔧 Rule Engine';
            }
            
            // Replace dashboard content with rule engine page
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardContent) {
                dashboardContent.innerHTML = generateRuleEngineHTML();
                initializeRuleEngine();
            }
            
            currentView = 'ruleengine';
        }

        function generateRuleEngineHTML() {
            return '<div style="background: #f8fafc; margin: -20px; min-height: calc(100vh - 100px);">' +
                '<!-- Breadcrumbs -->' +
                '<div style="background: white; padding: 16px 32px; border-bottom: 1px solid #e5e7eb;">' +
                '<nav style="display: flex; align-items: center; gap: 8px; font-size: 14px;">' +
                '<a href="#" onclick="showDashboard(); return false;" style="color: #6b7280; text-decoration: none;">Dashboard</a>' +
                '<span style="color: #9ca3af;">›</span>' +
                '<span style="color: #1f2937; font-weight: 500;">Rule Engine</span>' +
                '</nav>' +
                '</div>' +
                
                '<!-- Page Header -->' +
                '<div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 32px;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h2 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🔧 Enterprise Rule Engine</h2>' +
                '<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Intelligent automation • Business logic • Customer & SLA integration</p>' +
                '</div>' +
                '<button onclick="showDashboard()" style="color: white; font-size: 14px; background: rgba(255,255,255,0.2); border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">← Back to Dashboard</button>' +
                '</div>' +
                '</div>' +

                '<!-- Rule Engine Tabs -->' +
                '<div style="display: flex; background: white; border-bottom: 1px solid #e2e8f0; padding: 0 32px;">' +
                '<button class="rule-tab active" onclick="showRuleTab(&quot;dashboard&quot;)" data-tab="dashboard">📊 Rule Dashboard</button>' +
                '<button class="rule-tab" onclick="showRuleTab(&quot;builder&quot;)" data-tab="builder">🔧 Rule Builder</button>' +
                '<button class="rule-tab" onclick="showRuleTab(&quot;library&quot;)" data-tab="library">📋 Rules Library</button>' +
                '<button class="rule-tab" onclick="showRuleTab(&quot;execution&quot;)" data-tab="execution">⚡ Execution Monitor</button>' +
                '<button class="rule-tab" onclick="showRuleTab(&quot;templates&quot;)" data-tab="templates">📄 Templates</button>' +
                '<button class="rule-tab" onclick="showRuleTab(&quot;analytics&quot;)" data-tab="analytics">📈 Analytics</button>' +
                '</div>' +

                '<!-- Tab Content Area -->' +
                '<div style="background: white; margin: 0 32px 32px 32px; padding: 32px; border-radius: 0 0 12px 12px; min-height: 500px;">' +
                '<div id="ruleTabContent">' +
                generateRuleDashboardHTML() +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateRuleDashboardHTML() {
            return '<div class="rule-dashboard">' +
                '<!-- Header with Quick Actions -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">📊 Rule Engine Dashboard</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">Monitor, manage, and optimize your automated business rules</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="createNewRule()" class="btn btn-primary">➕ Create Rule</button>' +
                '<button onclick="importRules()" class="btn" style="background: #059669; color: white;">📥 Import</button>' +
                '<button onclick="exportRules()" class="btn" style="background: #3b82f6; color: white;">📤 Export</button>' +
                '</div>' +
                '</div>' +

                '<!-- Key Metrics -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">' +
                '<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; border-radius: 12px;">' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">147</div>' +
                '<div style="font-size: 16px; opacity: 0.9;">Active Rules</div>' +
                '<div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">↗ +12 this month</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 24px; border-radius: 12px;">' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">2,847</div>' +
                '<div style="font-size: 16px; opacity: 0.9;">Executions Today</div>' +
                '<div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">↗ +18% vs yesterday</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 24px; border-radius: 12px;">' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">98.7%</div>' +
                '<div style="font-size: 16px; opacity: 0.9;">Success Rate</div>' +
                '<div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">↗ +0.3% improvement</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 24px; border-radius: 12px;">' +
                '<div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">3.2s</div>' +
                '<div style="font-size: 16px; opacity: 0.9;">Avg Response Time</div>' +
                '<div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">↘ -15% faster</div>' +
                '</div>' +
                '</div>' +

                '<!-- Rule Categories -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🎯 Active Rule Categories</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRuleCategoriesChart() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">⚡ Recent Executions</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRecentExecutionsWidget() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Customer & SLA Integration Overview -->' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">👥 Customer-Triggered Rules</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateCustomerRulesOverview() +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📋 SLA-Connected Rules</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateSLARulesOverview() +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Rule Performance Analytics -->' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">📈 Performance Analytics</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateRulePerformanceChart() +
                '</div>' +
                '</div>' +

                '<!-- Top Performing Rules -->' +
                '<div>' +
                '<h3 style="color: #1f2937; margin-bottom: 20px;">🏆 Top Performing Rules</h3>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                generateTopRulesTable() +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Rule Engine Helper Functions
        function generateRuleCategoriesChart() {
            const categories = [
                { name: 'Customer Lifecycle', count: 34, percentage: 23, color: '#10b981', executions: 1247 },
                { name: 'SLA Management', count: 28, percentage: 19, color: '#3b82f6', executions: 892 },
                { name: 'Case Routing', count: 25, percentage: 17, color: '#8b5cf6', executions: 1156 },
                { name: 'Escalation Rules', count: 22, percentage: 15, color: '#f59e0b', executions: 634 },
                { name: 'Notification Rules', count: 20, percentage: 14, color: '#ec4899', executions: 923 },
                { name: 'Data Validation', count: 18, percentage: 12, color: '#06b6d4', executions: 445 }
            ];
            
            let html = '';
            categories.forEach(category => {
                html += '<div style="margin-bottom: 16px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">' +
                    '<span style="color: #1f2937; font-weight: 600;">' + category.name + '</span>' +
                    '<div style="text-align: right;">' +
                    '<span style="color: ' + category.color + '; font-size: 14px; font-weight: 600;">' + category.count + ' rules</span>' +
                    '<div style="color: #6b7280; font-size: 12px;">' + category.executions + ' executions</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="width: 100%; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">' +
                    '<div style="width: ' + category.percentage + '%; height: 100%; background: ' + category.color + '; border-radius: 4px; transition: all 0.3s ease;"></div>' +
                    '</div>' +
                    '</div>';
            });
            
            return html;
        }

        function generateRecentExecutionsWidget() {
            const executions = [
                { rule: 'Auto-escalate High Priority Cases', status: 'success', time: '2m ago', customer: 'Microsoft Corp' },
                { rule: 'SLA Breach Notification', status: 'success', time: '5m ago', customer: 'Amazon AWS' },
                { rule: 'Customer Lifecycle Update', status: 'running', time: '8m ago', customer: 'Google Cloud' },
                { rule: 'Case Auto-assignment', status: 'success', time: '12m ago', customer: 'Apple Inc' },
                { rule: 'Priority Escalation', status: 'failed', time: '15m ago', customer: 'Tesla Inc' },
                { rule: 'SLA Reminder Alert', status: 'success', time: '18m ago', customer: 'Salesforce' }
            ];
            
            let html = '<div style="max-height: 300px; overflow-y: auto;">';
            executions.forEach(execution => {
                const statusColor = execution.status === 'success' ? '#10b981' : execution.status === 'failed' ? '#dc2626' : '#f59e0b';
                const statusIcon = execution.status === 'success' ? '✅' : execution.status === 'failed' ? '❌' : '🔄';
                
                html += '<div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #f3f4f6;">' +
                    '<div style="font-size: 16px;">' + statusIcon + '</div>' +
                    '<div style="flex: 1;">' +
                    '<div style="color: #1f2937; font-weight: 600; font-size: 14px; margin-bottom: 2px;">' + execution.rule + '</div>' +
                    '<div style="color: #6b7280; font-size: 12px;">' + execution.customer + ' • ' + execution.time + '</div>' +
                    '</div>' +
                    '<div style="background: ' + statusColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; text-transform: uppercase;">' + execution.status + '</div>' +
                    '</div>';
            });
            html += '</div>';
            
            return html;
        }

        function generateCustomerRulesOverview() {
            return '<div>' +
                '<div style="display: grid; gap: 16px; margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">' +
                '<div>' +
                '<div style="color: #065f46; font-weight: 600;">Onboarding Rules</div>' +
                '<div style="color: #6b7280; font-size: 12px;">New customer automation</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #10b981; font-weight: 700; font-size: 18px;">23</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">' +
                '<div>' +
                '<div style="color: #1e40af; font-weight: 600;">Engagement Rules</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Customer interaction triggers</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #3b82f6; font-weight: 700; font-size: 18px;">34</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">' +
                '<div>' +
                '<div style="color: #92400e; font-weight: 600;">Retention Rules</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Churn prevention automation</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #f59e0b; font-weight: 700; font-size: 18px;">18</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="color: #1f2937; font-weight: 600; margin-bottom: 4px;">Customer Integration Status</div>' +
                '<div style="color: #10b981; font-size: 24px; font-weight: 700;">Active</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Real-time customer data sync enabled</div>' +
                '</div>' +
                '</div>';
        }

        function generateSLARulesOverview() {
            return '<div>' +
                '<div style="display: grid; gap: 16px; margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">' +
                '<div>' +
                '<div style="color: #991b1b; font-weight: 600;">Breach Prevention</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Proactive SLA monitoring</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #dc2626; font-weight: 700; font-size: 18px;">15</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f3e8ff; border-radius: 8px; border-left: 4px solid #8b5cf6;">' +
                '<div>' +
                '<div style="color: #5b21b6; font-weight: 600;">Auto-escalation</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Priority-based routing</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #8b5cf6; font-weight: 700; font-size: 18px;">28</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #059669;">' +
                '<div>' +
                '<div style="color: #047857; font-weight: 600;">Performance Tracking</div>' +
                '<div style="color: #6b7280; font-size: 12px;">SLA compliance monitoring</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<div style="color: #059669; font-weight: 700; font-size: 18px;">42</div>' +
                '<div style="color: #6b7280; font-size: 12px;">active</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="color: #1f2937; font-weight: 600; margin-bottom: 4px;">SLA Integration Status</div>' +
                '<div style="color: #10b981; font-size: 24px; font-weight: 700;">Connected</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Live SLA monitoring and enforcement</div>' +
                '</div>' +
                '</div>';
        }

        function generateRulePerformanceChart() {
            const hours = Array.from({length: 24}, (_, i) => i + 'h');
            const executions = [45, 52, 38, 61, 74, 89, 125, 156, 189, 234, 267, 298, 312, 289, 245, 198, 165, 134, 112, 89, 67, 56, 48, 41];
            
            let html = '<div style="margin-bottom: 20px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                '<h4 style="margin: 0; color: #1f2937;">24-Hour Rule Execution Trends</h4>' +
                '<div style="display: flex; gap: 16px;">' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #6366f1; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Executions</span></div>' +
                '<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 3px; background: #10b981; border-radius: 2px;"></div><span style="font-size: 12px; color: #6b7280;">Success Rate</span></div>' +
                '</div>' +
                '</div>';
            
            // Chart visualization
            html += '<div style="display: flex; align-items: end; gap: 4px; height: 150px; margin-bottom: 16px; padding: 0 8px;">';
            const maxExecutions = Math.max(...executions);
            
            executions.forEach((count, index) => {
                const heightPercent = (count / maxExecutions) * 100;
                html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center;">' +
                    '<div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">' + count + '</div>' +
                    '<div style="width: 100%; height: ' + heightPercent + '%; background: linear-gradient(to top, #6366f1, #8b5cf6); border-radius: 2px 2px 0 0; transition: all 0.3s ease;" onmouseover="this.style.transform=&quot;scaleY(1.1)&quot;" onmouseout="this.style.transform=&quot;scaleY(1)&quot;"></div>' +
                    '<div style="font-size: 10px; color: #6b7280; margin-top: 8px; font-weight: 500;">' + hours[index] + '</div>' +
                    '</div>';
            });
            
            html += '</div>';
            
            // Summary stats
            html += '<div style="display: flex; justify-content: space-around; padding: 16px; background: #f8fafc; border-radius: 8px;">' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #6366f1;">4,247</div><div style="font-size: 12px; color: #6b7280;">Total Executions</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #10b981;">98.7%</div><div style="font-size: 12px; color: #6b7280;">Success Rate</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #8b5cf6;">177</div><div style="font-size: 12px; color: #6b7280;">Avg/Hour</div></div>' +
                '<div style="text-align: center;"><div style="font-size: 18px; font-weight: 600; color: #f59e0b;">3.2s</div><div style="font-size: 12px; color: #6b7280;">Avg Response</div></div>' +
                '</div>';
            
            return html + '</div>';
        }

        function generateTopRulesTable() {
            const rules = [
                { name: 'High Priority Case Auto-Escalation', category: 'SLA Management', executions: 456, success: 99.8, avgTime: '2.1s', impact: 'High' },
                { name: 'Customer Onboarding Workflow', category: 'Customer Lifecycle', executions: 389, success: 98.5, avgTime: '1.8s', impact: 'High' },
                { name: 'SLA Breach Prevention Alert', category: 'SLA Management', executions: 234, success: 99.1, avgTime: '1.5s', impact: 'Critical' },
                { name: 'Case Auto-Assignment by Skills', category: 'Case Routing', executions: 567, success: 97.9, avgTime: '3.4s', impact: 'Medium' },
                { name: 'Customer Satisfaction Follow-up', category: 'Customer Lifecycle', executions: 123, success: 96.7, avgTime: '2.8s', impact: 'Medium' }
            ];
            
            let html = '<div style="overflow-x: auto;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc; border-bottom: 2px solid #e5e7eb;">' +
                '<th style="text-align: left; padding: 12px; color: #374151; font-weight: 600;">Rule Name</th>' +
                '<th style="text-align: left; padding: 12px; color: #374151; font-weight: 600;">Category</th>' +
                '<th style="text-align: center; padding: 12px; color: #374151; font-weight: 600;">Executions</th>' +
                '<th style="text-align: center; padding: 12px; color: #374151; font-weight: 600;">Success Rate</th>' +
                '<th style="text-align: center; padding: 12px; color: #374151; font-weight: 600;">Avg Time</th>' +
                '<th style="text-align: center; padding: 12px; color: #374151; font-weight: 600;">Impact</th>' +
                '<th style="text-align: center; padding: 12px; color: #374151; font-weight: 600;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            
            rules.forEach((rule, index) => {
                const impactColor = rule.impact === 'Critical' ? '#dc2626' : rule.impact === 'High' ? '#f59e0b' : '#6b7280';
                html += '<tr style="border-bottom: 1px solid #f3f4f6; ' + (index % 2 === 0 ? 'background: #fafbfc;' : '') + '">' +
                    '<td style="padding: 12px; color: #1f2937; font-weight: 500;">' + rule.name + '</td>' +
                    '<td style="padding: 12px; color: #6b7280;">' + rule.category + '</td>' +
                    '<td style="padding: 12px; text-align: center; color: #1f2937; font-weight: 600;">' + rule.executions + '</td>' +
                    '<td style="padding: 12px; text-align: center; color: #10b981; font-weight: 600;">' + rule.success + '%</td>' +
                    '<td style="padding: 12px; text-align: center; color: #6b7280;">' + rule.avgTime + '</td>' +
                    '<td style="padding: 12px; text-align: center;"><span style="background: ' + impactColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">' + rule.impact.toUpperCase() + '</span></td>' +
                    '<td style="padding: 12px; text-align: center;">' +
                    '<button onclick="editRule(&quot;' + rule.name + '&quot;)" style="background: none; border: none; color: #6366f1; cursor: pointer; margin-right: 8px;">✏️</button>' +
                    '<button onclick="viewRuleDetails(&quot;' + rule.name + '&quot;)" style="background: none; border: none; color: #10b981; cursor: pointer;">📊</button>' +
                    '</td>' +
                    '</tr>';
            });
            
            html += '</tbody></table></div>';
            
            return html;
        }

        // Rule Engine Tab Management
        function showRuleTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.rule-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            document.querySelector('.rule-tab[data-tab="' + tabName + '"]').classList.add('active');
            
            // Show corresponding content
            const content = document.getElementById('ruleTabContent');
            
            switch(tabName) {
                case 'dashboard':
                    content.innerHTML = generateRuleDashboardHTML();
                    break;
                case 'builder':
                    content.innerHTML = generateRuleBuilderHTML();
                    break;
                case 'library':
                    content.innerHTML = generateRulesLibraryHTML();
                    break;
                case 'execution':
                    content.innerHTML = generateExecutionMonitorHTML();
                    break;
                case 'templates':
                    content.innerHTML = generateRuleTemplatesHTML();
                    break;
                case 'analytics':
                    content.innerHTML = generateRuleAnalyticsHTML();
                    break;
            }
        }

        // Additional Rule Engine Functions (full implementations)
        function generateRuleBuilderHTML() {
            return '<div class="rule-builder">' +
                '<!-- Builder Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">🔧 Visual Rule Builder</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">Create powerful automation rules with our intuitive drag-and-drop interface</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="saveRule()" class="btn btn-primary">💾 Save Rule</button>' +
                '<button onclick="testRule()" class="btn" style="background: #059669; color: white;">🧪 Test Rule</button>' +
                '<button onclick="clearBuilder()" class="btn" style="background: #dc2626; color: white;">🗑️ Clear</button>' +
                '</div>' +
                '</div>' +

                '<!-- Rule Builder Interface -->' +
                '<div style="display: grid; grid-template-columns: 300px 1fr 300px; gap: 24px;">' +
                
                '<!-- Left Panel: Components -->' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">📦 Rule Components</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">' +
                
                '<div style="margin-bottom: 20px;">' +
                '<h5 style="color: #6b7280; margin-bottom: 12px; font-size: 12px; text-transform: uppercase;">Triggers</h5>' +
                '<div class="draggable-component" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">📅</span> Time-based Trigger' +
                '</div>' +
                '<div class="draggable-component" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">👤</span> Customer Event' +
                '</div>' +
                '<div class="draggable-component" style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">📋</span> SLA Trigger' +
                '</div>' +
                '<div class="draggable-component" style="background: #f3e8ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">📧</span> Communication Trigger' +
                '</div>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<h5 style="color: #6b7280; margin-bottom: 12px; font-size: 12px; text-transform: uppercase;">Conditions</h5>' +
                '<div class="draggable-component" style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">🔍</span> If/Then Condition' +
                '</div>' +
                '<div class="draggable-component" style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">🔀</span> Switch/Case' +
                '</div>' +
                '<div class="draggable-component" style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">🔄</span> Loop/Iteration' +
                '</div>' +
                '</div>' +
                
                '<div>' +
                '<h5 style="color: #6b7280; margin-bottom: 12px; font-size: 12px; text-transform: uppercase;">Actions</h5>' +
                '<div class="draggable-component" style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">📤</span> Send Notification' +
                '</div>' +
                '<div class="draggable-component" style="background: #fdf4ff; border: 1px solid #e879f9; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">📝</span> Update Record' +
                '</div>' +
                '<div class="draggable-component" style="background: #fff7ed; border: 1px solid #fb923c; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: move;">' +
                '<span style="margin-right: 8px;">⚡</span> Escalate Case' +
                '</div>' +
                '<div class="draggable-component" style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 12px; cursor: move;">' +
                '<span style="margin-right: 8px;">🤖</span> Trigger Workflow' +
                '</div>' +
                '</div>' +
                
                '</div>' +
                '</div>' +
                
                '<!-- Center Panel: Canvas -->' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">🎨 Rule Canvas</h4>' +
                '<div style="background: white; border: 2px dashed #d1d5db; border-radius: 12px; min-height: 600px; padding: 24px; position: relative;">' +
                
                '<!-- Rule Name Input -->' +
                '<div style="margin-bottom: 24px;">' +
                '<input type="text" placeholder="Enter rule name..." style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 16px; font-weight: 600;" value="Customer Onboarding Automation">' +
                '</div>' +
                
                '<!-- Rule Flow Visualization -->' +
                '<div style="background: #f8fafc; border-radius: 12px; padding: 20px;">' +
                
                '<!-- Start Node -->' +
                '<div style="text-align: center; margin-bottom: 24px;">' +
                '<div style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600;">🚀 START</div>' +
                '</div>' +
                
                '<!-- Trigger Section -->' +
                '<div style="text-align: center; margin-bottom: 24px;">' +
                '<div style="width: 2px; height: 30px; background: #d1d5db; margin: 0 auto;"></div>' +
                '<div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; display: inline-block;">' +
                '<div style="color: #1e40af; font-weight: 600; margin-bottom: 8px;">📅 Trigger: New Customer Created</div>' +
                '<div style="color: #6b7280; font-size: 14px;">When a new customer is added to the system</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Condition Section -->' +
                '<div style="text-align: center; margin-bottom: 24px;">' +
                '<div style="width: 2px; height: 30px; background: #d1d5db; margin: 0 auto;"></div>' +
                '<div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 16px; display: inline-block;">' +
                '<div style="color: #065f46; font-weight: 600; margin-bottom: 8px;">🔍 Condition: Check Customer Type</div>' +
                '<div style="color: #6b7280; font-size: 14px;">IF customer.type = "Enterprise" THEN</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Actions Section -->' +
                '<div style="text-align: center; margin-bottom: 24px;">' +
                '<div style="width: 2px; height: 30px; background: #d1d5db; margin: 0 auto;"></div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">' +
                '<div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 12px;">' +
                '<div style="color: #92400e; font-weight: 600; margin-bottom: 4px;">📧 Send Email</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Welcome email to customer</div>' +
                '</div>' +
                '<div style="background: #f3e8ff; border: 2px solid #8b5cf6; border-radius: 12px; padding: 12px;">' +
                '<div style="color: #5b21b6; font-weight: 600; margin-bottom: 4px;">📝 Create Task</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Assign onboarding task</div>' +
                '</div>' +
                '<div style="background: #fee2e2; border: 2px solid #dc2626; border-radius: 12px; padding: 12px;">' +
                '<div style="color: #991b1b; font-weight: 600; margin-bottom: 4px;">📅 Schedule Call</div>' +
                '<div style="color: #6b7280; font-size: 12px;">Setup kickoff meeting</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- End Node -->' +
                '<div style="text-align: center;">' +
                '<div style="width: 2px; height: 30px; background: #d1d5db; margin: 0 auto;"></div>' +
                '<div style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600;">🏁 END</div>' +
                '</div>' +
                
                '</div>' +
                '</div>' +
                '</div>' +
                
                '<!-- Right Panel: Properties -->' +
                '<div>' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">⚙️ Rule Properties</h4>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px;">Rule Category</label>' +
                '<select style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">' +
                '<option>Customer Lifecycle</option>' +
                '<option>SLA Management</option>' +
                '<option>Case Routing</option>' +
                '<option>Escalation Rules</option>' +
                '</select>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px;">Priority</label>' +
                '<select style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">' +
                '<option>High</option>' +
                '<option>Medium</option>' +
                '<option>Low</option>' +
                '</select>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px;">Status</label>' +
                '<div style="display: flex; align-items: center; gap: 8px;">' +
                '<input type="checkbox" checked>' +
                '<span style="color: #10b981; font-weight: 600;">Active</span>' +
                '</div>' +
                '</div>' +
                
                '<div style="margin-bottom: 20px;">' +
                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px;">Execution Mode</label>' +
                '<div style="display: grid; gap: 8px;">' +
                '<label style="display: flex; align-items: center; gap: 8px;"><input type="radio" name="mode" checked> Automatic</label>' +
                '<label style="display: flex; align-items: center; gap: 8px;"><input type="radio" name="mode"> Manual Approval</label>' +
                '<label style="display: flex; align-items: center; gap: 8px;"><input type="radio" name="mode"> Scheduled</label>' +
                '</div>' +
                '</div>' +
                
                '<div>' +
                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px;">Description</label>' +
                '<textarea style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; resize: vertical;" rows="4" placeholder="Describe what this rule does...">Automatically triggers onboarding workflow when a new enterprise customer is created in the system.</textarea>' +
                '</div>' +
                
                '</div>' +
                '</div>' +
                
                '</div>' +
                '</div>';
        }

        function generateRulesLibraryHTML() {
            const rules = [
                { id: 'R001', name: 'High Priority Case Auto-Escalation', category: 'SLA Management', status: 'active', lastModified: '2024-01-15', executions: 456, success: 99.8, author: 'John Smith' },
                { id: 'R002', name: 'Customer Onboarding Workflow', category: 'Customer Lifecycle', status: 'active', lastModified: '2024-01-14', executions: 389, success: 98.5, author: 'Sarah Johnson' },
                { id: 'R003', name: 'SLA Breach Prevention Alert', category: 'SLA Management', status: 'active', lastModified: '2024-01-13', executions: 234, success: 99.1, author: 'Mike Chen' },
                { id: 'R004', name: 'Case Auto-Assignment by Skills', category: 'Case Routing', status: 'active', lastModified: '2024-01-12', executions: 567, success: 97.9, author: 'Emily Davis' },
                { id: 'R005', name: 'Customer Satisfaction Follow-up', category: 'Customer Lifecycle', status: 'inactive', lastModified: '2024-01-11', executions: 123, success: 96.7, author: 'David Wilson' },
                { id: 'R006', name: 'Payment Reminder Automation', category: 'Notification Rules', status: 'active', lastModified: '2024-01-10', executions: 789, success: 99.5, author: 'Lisa Anderson' },
                { id: 'R007', name: 'Churn Risk Detection', category: 'Customer Lifecycle', status: 'testing', lastModified: '2024-01-09', executions: 45, success: 94.2, author: 'Robert Brown' },
                { id: 'R008', name: 'Emergency Escalation Protocol', category: 'Escalation Rules', status: 'active', lastModified: '2024-01-08', executions: 89, success: 100, author: 'Jennifer Garcia' }
            ];
            
            return '<div class="rules-library">' +
                '<!-- Library Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">📋 Rules Library</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">Manage, organize, and monitor all your automation rules in one place</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="createNewRule()" class="btn btn-primary">➕ Create Rule</button>' +
                '<button onclick="importRules()" class="btn" style="background: #059669; color: white;">📥 Import</button>' +
                '<button onclick="exportSelectedRules()" class="btn" style="background: #3b82f6; color: white;">📤 Export</button>' +
                '</div>' +
                '</div>' +

                '<!-- Search and Filters -->' +
                '<div style="display: grid; grid-template-columns: 1fr auto auto auto auto; gap: 16px; margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">' +
                '<input type="text" placeholder="🔍 Search rules by name, category, or author..." style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<select style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<option>All Categories</option>' +
                '<option>Customer Lifecycle</option>' +
                '<option>SLA Management</option>' +
                '<option>Case Routing</option>' +
                '<option>Escalation Rules</option>' +
                '<option>Notification Rules</option>' +
                '</select>' +
                '<select style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<option>All Status</option>' +
                '<option>Active</option>' +
                '<option>Inactive</option>' +
                '<option>Testing</option>' +
                '<option>Draft</option>' +
                '</select>' +
                '<select style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">' +
                '<option>Sort by: Last Modified</option>' +
                '<option>Sort by: Name</option>' +
                '<option>Sort by: Executions</option>' +
                '<option>Sort by: Success Rate</option>' +
                '</select>' +
                '<button onclick="applyFilters()" class="btn" style="background: #6366f1; color: white;">Apply Filters</button>' +
                '</div>' +

                '<!-- Rules Table -->' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc; border-bottom: 2px solid #e5e7eb;">' +
                '<th style="padding: 16px; text-align: left;"><input type="checkbox" onclick="selectAllRules(this)"></th>' +
                '<th style="padding: 16px; text-align: left; color: #374151; font-weight: 600;">Rule ID</th>' +
                '<th style="padding: 16px; text-align: left; color: #374151; font-weight: 600;">Rule Name</th>' +
                '<th style="padding: 16px; text-align: left; color: #374151; font-weight: 600;">Category</th>' +
                '<th style="padding: 16px; text-align: center; color: #374151; font-weight: 600;">Status</th>' +
                '<th style="padding: 16px; text-align: center; color: #374151; font-weight: 600;">Executions</th>' +
                '<th style="padding: 16px; text-align: center; color: #374151; font-weight: 600;">Success Rate</th>' +
                '<th style="padding: 16px; text-align: left; color: #374151; font-weight: 600;">Author</th>' +
                '<th style="padding: 16px; text-align: left; color: #374151; font-weight: 600;">Last Modified</th>' +
                '<th style="padding: 16px; text-align: center; color: #374151; font-weight: 600;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                rules.map((rule, index) => {
                    const statusColor = rule.status === 'active' ? '#10b981' : rule.status === 'inactive' ? '#6b7280' : rule.status === 'testing' ? '#f59e0b' : '#3b82f6';
                    const statusBg = rule.status === 'active' ? '#f0fdf4' : rule.status === 'inactive' ? '#f3f4f6' : rule.status === 'testing' ? '#fef3c7' : '#eff6ff';
                    
                    return '<tr style="border-bottom: 1px solid #f3f4f6; ' + (index % 2 === 0 ? 'background: #fafbfc;' : '') + '">' +
                        '<td style="padding: 16px;"><input type="checkbox" value="' + rule.id + '"></td>' +
                        '<td style="padding: 16px; color: #6366f1; font-weight: 600;">' + rule.id + '</td>' +
                        '<td style="padding: 16px; color: #1f2937; font-weight: 500;">' + rule.name + '</td>' +
                        '<td style="padding: 16px; color: #6b7280;"><span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px;">' + rule.category + '</span></td>' +
                        '<td style="padding: 16px; text-align: center;">' +
                        '<span style="background: ' + statusBg + '; color: ' + statusColor + '; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">' + rule.status + '</span>' +
                        '</td>' +
                        '<td style="padding: 16px; text-align: center; color: #1f2937; font-weight: 600;">' + rule.executions + '</td>' +
                        '<td style="padding: 16px; text-align: center;">' +
                        '<span style="color: ' + (rule.success > 98 ? '#10b981' : rule.success > 95 ? '#f59e0b' : '#dc2626') + '; font-weight: 600;">' + rule.success + '%</span>' +
                        '</td>' +
                        '<td style="padding: 16px; color: #6b7280;">' + rule.author + '</td>' +
                        '<td style="padding: 16px; color: #6b7280;">' + rule.lastModified + '</td>' +
                        '<td style="padding: 16px; text-align: center;">' +
                        '<button onclick="editRule(&quot;' + rule.id + '&quot;)" style="background: none; border: none; color: #6366f1; cursor: pointer; margin-right: 8px;" title="Edit">✏️</button>' +
                        '<button onclick="duplicateRule(&quot;' + rule.id + '&quot;)" style="background: none; border: none; color: #8b5cf6; cursor: pointer; margin-right: 8px;" title="Duplicate">📋</button>' +
                        '<button onclick="toggleRuleStatus(&quot;' + rule.id + '&quot;)" style="background: none; border: none; color: ' + (rule.status === 'active' ? '#f59e0b' : '#10b981') + '; cursor: pointer; margin-right: 8px;" title="Toggle Status">' + (rule.status === 'active' ? '⏸️' : '▶️') + '</button>' +
                        '<button onclick="deleteRule(&quot;' + rule.id + '&quot;)" style="background: none; border: none; color: #dc2626; cursor: pointer;" title="Delete">🗑️</button>' +
                        '</td>' +
                        '</tr>';
                }).join('') +
                '</tbody>' +
                '</table>' +
                '</div>' +

                '<!-- Pagination -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">' +
                '<div style="color: #6b7280;">Showing 1-8 of 147 rules</div>' +
                '<div style="display: flex; gap: 8px;">' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">Previous</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #6366f1; border-radius: 6px; background: #6366f1; color: white;">1</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">2</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">3</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">...</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">19</button>' +
                '<button style="padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: white;">Next</button>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateExecutionMonitorHTML() {
            const liveExecutions = [
                { id: 'EX001', ruleName: 'Customer Onboarding Workflow', status: 'running', startTime: '2024-01-15 14:23:45', duration: '00:02:15', customer: 'Tesla Inc', progress: 65 },
                { id: 'EX002', ruleName: 'SLA Breach Prevention Alert', status: 'completed', startTime: '2024-01-15 14:22:30', duration: '00:00:45', customer: 'Microsoft Corp', progress: 100 },
                { id: 'EX003', ruleName: 'High Priority Case Auto-Escalation', status: 'failed', startTime: '2024-01-15 14:21:12', duration: '00:01:30', customer: 'Amazon AWS', progress: 85 },
                { id: 'EX004', ruleName: 'Payment Reminder Automation', status: 'queued', startTime: '2024-01-15 14:25:00', duration: '00:00:00', customer: 'Google Cloud', progress: 0 },
                { id: 'EX005', ruleName: 'Case Auto-Assignment by Skills', status: 'running', startTime: '2024-01-15 14:24:10', duration: '00:01:05', customer: 'Apple Inc', progress: 35 }
            ];

            return '<div class="execution-monitor">' +
                '<!-- Monitor Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">⚡ Real-time Execution Monitor</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">Monitor live rule executions, debug issues, and track performance in real-time</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px; align-items: center;">' +
                '<div style="display: flex; align-items: center; gap: 8px;">' +
                '<div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>' +
                '<span style="color: #6b7280; font-size: 14px;">Live monitoring active</span>' +
                '</div>' +
                '<button onclick="pauseMonitoring()" class="btn" style="background: #f59e0b; color: white;">⏸️ Pause</button>' +
                '<button onclick="refreshMonitor()" class="btn" style="background: #3b82f6; color: white;">🔄 Refresh</button>' +
                '</div>' +
                '</div>' +

                '<!-- Execution Statistics -->' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">' +
                '<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">2</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Currently Running</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">1</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">In Queue</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">34</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Completed Today</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">1</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Failed</div>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 20px; border-radius: 12px; text-align: center;">' +
                '<div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">97.2%</div>' +
                '<div style="font-size: 14px; opacity: 0.9;">Success Rate</div>' +
                '</div>' +
                '</div>' +

                '<!-- Live Execution Table -->' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 32px;">' +
                '<div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">' +
                '<h4 style="color: #1f2937; margin: 0;">🔴 Live Executions</h4>' +
                '</div>' +
                '<div style="overflow-x: auto;">' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc; border-bottom: 1px solid #e5e7eb;">' +
                '<th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Execution ID</th>' +
                '<th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Rule Name</th>' +
                '<th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">Status</th>' +
                '<th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Customer</th>' +
                '<th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">Progress</th>' +
                '<th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Start Time</th>' +
                '<th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Duration</th>' +
                '<th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                liveExecutions.map(execution => {
                    const statusColor = execution.status === 'completed' ? '#10b981' : execution.status === 'running' ? '#3b82f6' : execution.status === 'failed' ? '#dc2626' : '#6b7280';
                    const statusBg = execution.status === 'completed' ? '#f0fdf4' : execution.status === 'running' ? '#eff6ff' : execution.status === 'failed' ? '#fef2f2' : '#f3f4f6';
                    const statusIcon = execution.status === 'completed' ? '✅' : execution.status === 'running' ? '🔄' : execution.status === 'failed' ? '❌' : '⏱️';

                    return '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                        '<td style="padding: 12px; color: #6366f1; font-weight: 600;">' + execution.id + '</td>' +
                        '<td style="padding: 12px; color: #1f2937;">' + execution.ruleName + '</td>' +
                        '<td style="padding: 12px; text-align: center;">' +
                        '<span style="background: ' + statusBg + '; color: ' + statusColor + '; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">' +
                        statusIcon + ' ' + execution.status.toUpperCase() +
                        '</span>' +
                        '</td>' +
                        '<td style="padding: 12px; color: #6b7280;">' + execution.customer + '</td>' +
                        '<td style="padding: 12px; text-align: center;">' +
                        '<div style="display: flex; align-items: center; gap: 8px; justify-content: center;">' +
                        '<div style="width: 60px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">' +
                        '<div style="width: ' + execution.progress + '%; height: 100%; background: ' + statusColor + '; transition: width 0.3s ease;"></div>' +
                        '</div>' +
                        '<span style="font-size: 12px; color: #6b7280; font-weight: 600;">' + execution.progress + '%</span>' +
                        '</div>' +
                        '</td>' +
                        '<td style="padding: 12px; color: #6b7280; font-size: 12px;">' + execution.startTime + '</td>' +
                        '<td style="padding: 12px; color: #6b7280; font-size: 12px;">' + execution.duration + '</td>' +
                        '<td style="padding: 12px; text-align: center;">' +
                        '<button onclick="viewExecutionDetails(&quot;' + execution.id + '&quot;)" style="background: none; border: none; color: #6366f1; cursor: pointer; margin-right: 8px;" title="View Details">👁️</button>' +
                        (execution.status === 'running' ? '<button onclick="stopExecution(&quot;' + execution.id + '&quot;)" style="background: none; border: none; color: #dc2626; cursor: pointer;" title="Stop">⏹️</button>' : '') +
                        '</td>' +
                        '</tr>';
                }).join('') +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +

                '<!-- Execution Logs -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px;">' +
                '<div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">' +
                '<h4 style="color: #1f2937; margin: 0;">📋 Execution Logs</h4>' +
                '</div>' +
                '<div style="padding: 16px; background: #1f2937; color: #f8fafc; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto;">' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:45]</span> <span style="color: #3b82f6;">[INFO]</span> Rule "Customer Onboarding Workflow" started for Tesla Inc</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:46]</span> <span style="color: #3b82f6;">[INFO]</span> Condition check: customer.type = "Enterprise" → TRUE</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:47]</span> <span style="color: #3b82f6;">[INFO]</span> Executing action: Send Welcome Email</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:50]</span> <span style="color: #10b981;">[SUCCESS]</span> Email sent successfully to contact@tesla.com</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:51]</span> <span style="color: #3b82f6;">[INFO]</span> Executing action: Create Onboarding Task</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:52]</span> <span style="color: #10b981;">[SUCCESS]</span> Task "Tesla - Customer Onboarding" created</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:23:53]</span> <span style="color: #3b82f6;">[INFO]</span> Executing action: Schedule Kickoff Meeting</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:24:00]</span> <span style="color: #f59e0b;">[WARN]</span> Calendar API rate limit reached, retrying in 30s</div>' +
                '<div style="margin-bottom: 8px;"><span style="color: #10b981;">[14:24:30]</span> <span style="color: #3b82f6;">[INFO]</span> Retrying calendar operation...</div>' +
                '<div><span style="color: #10b981;">[14:24:35]</span> <span style="color: #3b82f6;">[INFO]</span> Processing... (65% complete)</div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 16px;">' +
                '<div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">' +
                '<h4 style="color: #1f2937; margin: 0;">⚡ Quick Actions</h4>' +
                '</div>' +
                '<div style="padding: 16px; display: grid; gap: 12px;">' +
                '<button onclick="pauseAllExecutions()" class="btn" style="background: #f59e0b; color: white; width: 100%;">⏸️ Pause All</button>' +
                '<button onclick="retryFailedExecutions()" class="btn" style="background: #dc2626; color: white; width: 100%;">🔄 Retry Failed</button>' +
                '<button onclick="clearCompletedExecutions()" class="btn" style="background: #6b7280; color: white; width: 100%;">🗑️ Clear Completed</button>' +
                '<button onclick="exportExecutionLogs()" class="btn" style="background: #059669; color: white; width: 100%;">📥 Export Logs</button>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px;">' +
                '<div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb;">' +
                '<h4 style="color: #1f2937; margin: 0;">📊 Performance</h4>' +
                '</div>' +
                '<div style="padding: 16px;">' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">CPU Usage</span>' +
                '<span style="color: #1f2937; font-weight: 600;">23%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 23%; height: 100%; background: #10b981; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Memory</span>' +
                '<span style="color: #1f2937; font-weight: 600;">67%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 67%; height: 100%; background: #f59e0b; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Queue Load</span>' +
                '<span style="color: #1f2937; font-weight: 600;">12%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 12%; height: 100%; background: #3b82f6; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        function generateExecutionMonitorHTML() {
            const executions = [
                { id: 'EXE001', rule: 'Customer Onboarding Automation', status: 'running', started: '14:32:15', duration: '00:02:43', progress: 75 },
                { id: 'EXE002', rule: 'SLA Breach Alert System', status: 'completed', started: '14:25:08', duration: '00:00:12', progress: 100 },
                { id: 'EXE003', rule: 'High Priority Escalation', status: 'failed', started: '14:20:33', duration: '00:01:05', progress: 45 },
                { id: 'EXE004', rule: 'Payment Reminder Workflow', status: 'completed', started: '14:15:20', duration: '00:00:08', progress: 100 },
                { id: 'EXE005', rule: 'Case Auto-Assignment', status: 'running', started: '14:30:12', duration: '00:04:23', progress: 60 }
            ];

            return '<div class="execution-monitor">' +
                '<!-- Monitor Header -->' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div>' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">⚡ Execution Monitor</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">Real-time monitoring of rule execution and performance metrics</p>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                '<button onclick="pauseMonitoring()" class="btn" style="background: #f59e0b; color: white;">⏸️ Pause Monitor</button>' +
                '<button onclick="clearLogs()" class="btn" style="background: #ef4444; color: white;">🗑️ Clear Logs</button>' +
                '<button onclick="exportLogs()" class="btn" style="background: #3b82f6; color: white;">📤 Export</button>' +
                '</div>' +
                '</div>' +

                '<!-- Status Overview -->' +
                '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">' +
                '<div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h4 style="color: #6b7280; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Running</h4>' +
                '<p style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 8px 0 0 0;">2</p>' +
                '</div>' +
                '<div style="background: #3b82f6; color: white; padding: 12px; border-radius: 50%; font-size: 20px;">⚡</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h4 style="color: #6b7280; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Completed</h4>' +
                '<p style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 8px 0 0 0;">2</p>' +
                '</div>' +
                '<div style="background: #059669; color: white; padding: 12px; border-radius: 50%; font-size: 20px;">✅</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h4 style="color: #6b7280; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Failed</h4>' +
                '<p style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 8px 0 0 0;">1</p>' +
                '</div>' +
                '<div style="background: #ef4444; color: white; padding: 12px; border-radius: 50%; font-size: 20px;">❌</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">' +
                '<div style="display: flex; align-items: center; justify-content: space-between;">' +
                '<div>' +
                '<h4 style="color: #6b7280; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Success Rate</h4>' +
                '<p style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 8px 0 0 0;">95.3%</p>' +
                '</div>' +
                '<div style="background: #059669; color: white; padding: 12px; border-radius: 50%; font-size: 20px;">📈</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<!-- Live Executions Table -->' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 32px;">' +
                '<div style="padding: 20px; border-bottom: 1px solid #e5e7eb; background: #f8fafc;">' +
                '<h4 style="color: #1f2937; margin: 0;">🔴 Live Executions</h4>' +
                '</div>' +
                '<table style="width: 100%; border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="background: #f8fafc;">' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Execution ID</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Rule Name</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Started</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Duration</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Progress</th>' +
                '<th style="text-align: left; padding: 16px; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                executions.map(exec => {
                    const statusColors = {
                        running: '#3b82f6',
                        completed: '#059669',
                        failed: '#ef4444',
                        paused: '#f59e0b'
                    };
                    const statusIcons = {
                        running: '⚡',
                        completed: '✅',
                        failed: '❌',
                        paused: '⏸️'
                    };
                    return '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                        '<td style="padding: 16px; color: #1f2937; font-weight: 500;">' + exec.id + '</td>' +
                        '<td style="padding: 16px; color: #1f2937;">' + exec.rule + '</td>' +
                        '<td style="padding: 16px;">' +
                        '<span style="background: ' + statusColors[exec.status] + '; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">' +
                        statusIcons[exec.status] + ' ' + exec.status.toUpperCase() +
                        '</span></td>' +
                        '<td style="padding: 16px; color: #6b7280;">' + exec.started + '</td>' +
                        '<td style="padding: 16px; color: #6b7280;">' + exec.duration + '</td>' +
                        '<td style="padding: 16px;">' +
                        '<div style="display: flex; align-items: center; gap: 8px;">' +
                        '<div style="width: 60px; height: 6px; background: #e5e7eb; border-radius: 3px;">' +
                        '<div style="width: ' + exec.progress + '%; height: 100%; background: ' + statusColors[exec.status] + '; border-radius: 3px;"></div>' +
                        '</div>' +
                        '<span style="color: #6b7280; font-size: 12px;">' + exec.progress + '%</span>' +
                        '</div>' +
                        '</td>' +
                        '<td style="padding: 16px;">' +
                        '<div style="display: flex; gap: 8px;">' +
                        '<button onclick="viewExecutionLogs(&quot;' + exec.id + '&quot;)" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">📋 Logs</button>' +
                        (exec.status === 'running' ? 
                            '<button onclick="stopExecution(&quot;' + exec.id + '&quot;)" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">⏹️ Stop</button>' :
                            '<button onclick="restartExecution(&quot;' + exec.id + '&quot;)" style="padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">🔄 Restart</button>'
                        ) +
                        '</div>' +
                        '</td>' +
                        '</tr>';
                }).join('') +
                '</tbody>' +
                '</table>' +
                '</div>' +

                '<!-- Performance Metrics -->' +
                '<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #1f2937; margin: 0 0 16px 0;">📊 Performance Trends</h4>' +
                '<div style="text-align: center; padding: 40px; color: #6b7280;">' +
                '<div style="font-size: 48px; margin-bottom: 16px;">📈</div>' +
                '<p>Performance analytics visualization coming soon...</p>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #1f2937; margin: 0 0 16px 0;">💻 System Resources</h4>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">CPU Usage</span>' +
                '<span style="color: #1f2937; font-weight: 600;">23%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 23%; height: 100%; background: #3b82f6; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Memory</span>' +
                '<span style="color: #1f2937; font-weight: 600;">45%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 45%; height: 100%; background: #f59e0b; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="color: #6b7280; font-size: 14px;">Queue Load</span>' +
                '<span style="color: #1f2937; font-weight: 600;">8%</span>' +
                '</div>' +
                '<div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px;">' +
                '<div style="width: 8%; height: 100%; background: #059669; border-radius: 4px;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }


        // Rule Engine Action Functions
        function createNewRule() {
            showNotification('🔧 Opening rule builder...', 'info');
        }

        function importRules() {
            showNotification('📥 Rule import functionality coming soon...', 'info');
        }

        function exportRules() {
            showNotification('📤 Exporting rule configurations...', 'success');
        }

        function editRule(ruleName) {
            showNotification('✏️ Editing rule: ' + ruleName, 'info');
        }

        function viewRuleDetails(ruleName) {
            showNotification('📊 Viewing analytics for: ' + ruleName, 'info');
        }

        function initializeRuleEngine() {
            // Initialize rule engine specific functionality
            console.log('Rule Engine initialized');
        }

        // Additional Rule Engine Modal Functions
        function showRulesLibraryModal() {
            showRuleEnginePage();
            // Switch to Rules Library tab
            setTimeout(() => {
                showRuleTab('library');
            }, 100);
        }

        function showRuleExecutionModal() {
            showRuleEnginePage();
            // Switch to Execution Monitor tab
            setTimeout(() => {
                showRuleTab('monitor');
            }, 100);
        }

        function showAutomationModal() {
            showNotification('🤖 Automation Hub - workflow automation center coming soon', 'info');
        }

        // Complete Template and Analytics implementations
        function generateRuleTemplatesHTML() {
            const templates = [
                { id: 'TPL001', name: 'Customer Onboarding Automation', category: 'Customer Lifecycle', description: 'Automatically welcome new customers and set up their accounts', uses: 45, rating: 4.8 },
                { id: 'TPL002', name: 'SLA Breach Alert System', category: 'SLA Management', description: 'Monitor SLA compliance and send alerts when thresholds are exceeded', uses: 67, rating: 4.9 },
                { id: 'TPL003', name: 'High Priority Case Escalation', category: 'Escalation Rules', description: 'Automatically escalate urgent cases to senior team members', uses: 89, rating: 4.7 },
                { id: 'TPL004', name: 'Payment Reminder Workflow', category: 'Notification Rules', description: 'Send automated payment reminders based on invoice due dates', uses: 23, rating: 4.6 },
                { id: 'TPL005', name: 'Churn Risk Detection', category: 'Customer Lifecycle', description: 'Identify customers at risk of churning and trigger retention actions', uses: 34, rating: 4.5 },
                { id: 'TPL006', name: 'Case Auto-Assignment', category: 'Case Routing', description: 'Automatically assign cases to agents based on skills and workload', uses: 78, rating: 4.8 }
            ];

            return '<div class="rule-templates">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">' +
                '<div><h3 style="color: #1f2937; margin: 0; font-size: 24px;">📄 Rule Templates</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Pre-built automation templates for common business scenarios</p></div>' +
                '<button onclick="createCustomTemplate()" class="btn btn-primary">➕ Create Template</button>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">' +
                templates.map(template => 
                    '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; transition: all 0.3s ease;" onmouseover="this.style.boxShadow=&quot;0 4px 12px rgba(0,0,0,0.1)&quot;" onmouseout="this.style.boxShadow=&quot;&quot;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">' +
                    '<h4 style="color: #1f2937; margin: 0;">' + template.name + '</h4>' +
                    '<span style="background: #f0fdf4; color: #059669; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">' + template.category + '</span>' +
                    '</div>' +
                    '<p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">' + template.description + '</p>' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                    '<div style="display: flex; align-items: center; gap: 16px;">' +
                    '<span style="color: #6b7280; font-size: 12px;">' + template.uses + ' uses</span>' +
                    '<div style="display: flex; align-items: center; gap: 4px;">' +
                    '<span style="color: #f59e0b;">⭐</span>' +
                    '<span style="color: #6b7280; font-size: 12px;">' + template.rating + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div style="display: flex; gap: 8px;">' +
                    '<button onclick="useTemplate(&quot;' + template.id + '&quot;)" class="btn btn-primary" style="flex: 1;">Use Template</button>' +
                    '<button onclick="previewTemplate(&quot;' + template.id + '&quot;)" class="btn" style="background: #6b7280; color: white;">👁️ Preview</button>' +
                    '</div>' +
                    '</div>'
                ).join('') +
                '</div></div>';
        }

        function generateRuleAnalyticsHTML() {
            return '<div class="rule-analytics">' +
                '<div style="margin-bottom: 32px;">' +
                '<h3 style="color: #1f2937; margin: 0; font-size: 24px;">📈 Advanced Rule Analytics</h3>' +
                '<p style="color: #6b7280; margin: 4px 0 0 0;">Deep insights into rule performance and business impact</p>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">Performance Trends</h4>' +
                '<div style="height: 200px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">Performance chart placeholder</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">Resource Utilization</h4>' +
                '<div style="height: 200px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">Resource usage chart placeholder</div>' +
                '</div>' +
                '</div>' +
                '<div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">' +
                '<h4 style="color: #1f2937; margin-bottom: 16px;">Business Impact Analysis</h4>' +
                '<p style="color: #6b7280;">Advanced analytics features coming soon...</p>' +
                '</div>' +
                '</div>';
        }

        // Rule Engine Action Functions
        function saveRule() {
            showNotification('💾 Rule saved successfully!', 'success');
        }

        function testRule() {
            showNotification('🧪 Testing rule execution...', 'info');
            setTimeout(() => {
                showNotification('✅ Rule test completed successfully!', 'success');
            }, 2000);
        }

        function clearBuilder() {
            showNotification('🗑️ Rule builder cleared', 'info');
        }

        function exportSelectedRules() {
            showNotification('📤 Exporting selected rules...', 'success');
        }

        function applyFilters() {
            showNotification('🔍 Applying filters...', 'info');
        }

        function selectAllRules(checkbox) {
            const checkboxes = document.querySelectorAll('input[type="checkbox"][value^="R"]');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
        }

        function duplicateRule(ruleId) {
            showNotification('📋 Duplicating rule: ' + ruleId, 'info');
        }

        function toggleRuleStatus(ruleId) {
            showNotification('⚡ Toggling rule status: ' + ruleId, 'info');
        }

        function deleteRule(ruleId) {
            if(confirm('Are you sure you want to delete rule ' + ruleId + '?')) {
                showNotification('🗑️ Rule ' + ruleId + ' deleted', 'success');
            }
        }

        function pauseMonitoring() {
            showNotification('⏸️ Monitoring paused', 'info');
        }

        function refreshMonitor() {
            showNotification('🔄 Monitor refreshed', 'info');
        }

        function viewExecutionDetails(executionId) {
            showNotification('👁️ Viewing details for: ' + executionId, 'info');
        }

        function stopExecution(executionId) {
            showNotification('⏹️ Stopping execution: ' + executionId, 'info');
        }

        function pauseAllExecutions() {
            showNotification('⏸️ All executions paused', 'info');
        }

        function retryFailedExecutions() {
            showNotification('🔄 Retrying failed executions...', 'info');
        }

        function clearCompletedExecutions() {
            showNotification('🗑️ Completed executions cleared', 'info');
        }

        function exportExecutionLogs() {
            showNotification('📥 Exporting execution logs...', 'success');
        }

        function createCustomTemplate() {
            showNotification('➕ Creating custom template...', 'info');
        }

        function useTemplate(templateId) {
            showNotification('📄 Using template: ' + templateId, 'success');
        }

        function previewTemplate(templateId) {
            showNotification('👁️ Previewing template: ' + templateId, 'info');
        }

        // Additional execution monitor functions
        function viewExecutionLogs(executionId) {
            showNotification('📋 Viewing logs for execution: ' + executionId, 'info');
        }

        function restartExecution(executionId) {
            showNotification('🔄 Restarting execution: ' + executionId, 'info');
        }

        function clearLogs() {
            showNotification('🗑️ Execution logs cleared', 'info');
        }

        function exportLogs() {
            showNotification('📤 Exporting execution logs...', 'success');
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
            
            // Admin authentication
            if (email === 'admin@example.com' && password === 'admin123') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Login successful',
                    user: {
                        id: 1,
                        name: 'Admin User',
                        email: 'admin@example.com',
                        role: 'admin',
                        department: 'Management'
                    },
                    token: 'demo-token-12345'
                }));
                return;
            }
            
            // Team member authentication
            const teamMembers = [
                { email: 'team@example.com', password: 'team123', id: 2, name: 'Sarah Johnson', role: 'team_member', department: 'Customer Support', specialization: 'Technical Issues', level: 'Senior' },
                { email: 'agent1@example.com', password: 'agent123', id: 3, name: 'Michael Chen', role: 'team_member', department: 'Customer Support', specialization: 'Billing & Account', level: 'Junior' },
                { email: 'agent2@example.com', password: 'agent123', id: 4, name: 'Emily Rodriguez', role: 'team_member', department: 'Customer Support', specialization: 'General Inquiry', level: 'Senior' },
                { email: 'agent3@example.com', password: 'agent123', id: 5, name: 'David Kim', role: 'team_member', department: 'Customer Support', specialization: 'Escalations', level: 'Lead' },
                { email: 'agent4@example.com', password: 'agent123', id: 6, name: 'Lisa Anderson', role: 'team_member', department: 'Customer Support', specialization: 'Enterprise Accounts', level: 'Senior' }
            ];
            
            const teamMember = teamMembers.find(member => member.email === email && member.password === password);
            if (teamMember) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Login successful',
                    user: teamMember,
                    token: 'demo-token-' + teamMember.id
                }));
                return;
            }
            
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid credentials' }));
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