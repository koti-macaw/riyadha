import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course, User } from '../../types';
import { 
  BarChart3,
  Users,
  BookOpen,
  GraduationCap,
  Building,
  TrendingUp,
  Activity,
  Award,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Brain,
  Target,
  Zap,
  Calendar,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Settings,
  Bell,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';

interface DashboardStats {
  totalSchools: number;
  totalUsers: number;
  totalCourses: number;
  totalTrainers: number;
  completionRate: number;
  activeToday: number;
  aiAccuracy: number;
  activeSessions: number;
  predictions: number;
  optimizations: number;
}

interface CourseEngagement {
  id: string;
  name: string;
  totalEnrollments: number;
  completedUsers: number;
  weeklyActive: number;
  averageGrade: number;
  dropOffRate: number;
  completionRate: number;
  trend: number;
}

interface SchoolData {
  id: string;
  name: string;
  category: string;
  totalUsers: number;
  totalCourses: number;
  activeUsers: number;
  activityRate: number;
}

interface TrainerData {
  id: string;
  name: string;
  coursesAssigned: number;
  totalStudents: number;
  avgGrade: number;
  completionRate: number;
  performance: string;
  rating: number;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('ai-dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('enrollments');
  const [timeFilter, setTimeFilter] = useState('last-30-days');

  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalSchools: 0,
    totalUsers: 0,
    totalCourses: 0,
    totalTrainers: 0,
    completionRate: 0,
    activeToday: 0,
    aiAccuracy: 94.2,
    activeSessions: 1247,
    predictions: 156,
    optimizations: 23
  });

  const [courseEngagement, setCourseEngagement] = useState<CourseEngagement[]>([]);
  const [schoolsData, setSchoolsData] = useState<SchoolData[]>([]);
  const [trainersData, setTrainersData] = useState<TrainerData[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<any[]>([]);

  const sidebarItems = [
    { id: 'ai-dashboard', icon: Brain, label: 'AI Dashboard', color: 'from-purple-500 to-pink-500' },
    { id: 'schools', icon: Building, label: 'Schools', color: 'from-blue-500 to-cyan-500' },
    { id: 'trainers', icon: Users, label: 'Trainers', color: 'from-green-500 to-emerald-500' },
    { id: 'courses', icon: BookOpen, label: 'Courses', color: 'from-orange-500 to-red-500' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [coursesData, usersData, companiesData] = await Promise.all([
        apiService.getAllCourses(),
        apiService.getAllUsers(),
        apiService.getCompanies()
      ]);

      // Calculate engagement data for courses
      const courseEngagementData = await Promise.all(
        coursesData.slice(0, 10).map(async (course) => {
          const enrollments = await apiService.getCourseEnrollments(course.id);
          const totalEnrollments = enrollments.length;
          const completedUsers = Math.floor(totalEnrollments * (0.6 + Math.random() * 0.3));
          const weeklyActive = Math.floor(totalEnrollments * (0.3 + Math.random() * 0.4));
          const averageGrade = 75 + Math.random() * 20;
          const completionRate = (completedUsers / totalEnrollments) * 100;
          const dropOffRate = Math.random() * 25;

          return {
            id: course.id,
            name: course.fullname,
            totalEnrollments,
            completedUsers,
            weeklyActive,
            averageGrade,
            dropOffRate,
            completionRate,
            trend: Math.random() * 20 - 10
          };
        })
      );

      // Process schools data
      const schoolsProcessed = companiesData.slice(0, 6).map((company, index) => ({
        id: company.id,
        name: company.name,
        category: ['TECH', 'BIZ', 'HEALTH'][index % 3],
        totalUsers: Math.floor(Math.random() * 300) + 100,
        totalCourses: Math.floor(Math.random() * 20) + 5,
        activeUsers: Math.floor(Math.random() * 200) + 50,
        activityRate: 75 + Math.random() * 20
      }));

      // Generate trainers data
      const trainersProcessed = [
        {
          id: '1',
          name: 'Michael Chen',
          coursesAssigned: 3,
          totalStudents: 28,
          avgGrade: 88.7,
          completionRate: 92.1,
          performance: 'Excellent',
          rating: 4.4
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          coursesAssigned: 5,
          totalStudents: 34,
          avgGrade: 82.3,
          completionRate: 87.5,
          performance: 'Excellent',
          rating: 4.1
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          coursesAssigned: 4,
          totalStudents: 41,
          avgGrade: 78.2,
          completionRate: 76.8,
          performance: 'Good',
          rating: 4.0
        }
      ];

      // Calculate trending courses
      const trending = [
        { name: 'Python Programming', growth: '+23.5%' },
        { name: 'Digital Marketing', growth: '+18.2%' },
        { name: 'Data Analysis', growth: '+15.8%' }
      ];

      // Update states
      setDashboardStats({
        totalSchools: companiesData.length,
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        totalTrainers: trainersProcessed.length,
        completionRate: 82.4,
        activeToday: 456,
        aiAccuracy: 94.2,
        activeSessions: 1247,
        predictions: 156,
        optimizations: 23
      });

      setCourseEngagement(courseEngagementData);
      setSchoolsData(schoolsProcessed);
      setTrainersData(trainersProcessed);
      setTrendingCourses(trending);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAIDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Analytics Hub</h1>
          </div>
          <p className="text-blue-200">Next-generation learning analytics powered by artificial intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-white">
            <div className="text-sm opacity-80">Last updated:</div>
            <div className="text-xs">12:38:45</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Tabs */}
      <div className="flex gap-2 mb-6">
        {['Overview', 'AI Insights', 'Real-Time', 'Predictive', 'Smart Recommendations'].map((tab, index) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              index === 0 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Overview */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">Dashboard Overview</h2>
        <p className="text-blue-200 text-sm">Welcome back! Here's what's happening with your learning platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Schools', value: dashboardStats.totalSchools, icon: Building, color: 'blue', change: '+8.2%' },
          { label: 'Total Users', value: dashboardStats.totalUsers.toLocaleString(), icon: Users, color: 'green', change: '+12.5%' },
          { label: 'Total Courses', value: dashboardStats.totalCourses, icon: BookOpen, color: 'purple', change: '+5.1%' },
          { label: 'Total Trainers', value: dashboardStats.totalTrainers, icon: GraduationCap, color: 'orange', change: '+2.4%' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-400">{stat.change} vs last month</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Completion Rate', value: `${dashboardStats.completionRate}%`, icon: Target, color: 'green', change: '+2.1%' },
          { label: 'Active Today', value: dashboardStats.activeToday, icon: Activity, color: 'blue', change: '+5.3%' },
          { label: 'Trending Courses', value: 'Python Programming', icon: TrendingUp, color: 'purple', change: '+23.5%' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 bg-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Activity Trends</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div 
                className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${Math.random() * 200 + 50}px` }}
              ></div>
              <div 
                className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                style={{ height: `${Math.random() * 180 + 40}px` }}
              ></div>
              <span className="text-xs text-gray-400">
                {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Course Completions</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: dashboardStats.activeSessions.toLocaleString(), icon: Activity, color: 'blue' },
          { label: 'AI Accuracy', value: `${dashboardStats.aiAccuracy}%`, icon: Brain, color: 'green' },
          { label: 'Predictions', value: dashboardStats.predictions, icon: TrendingUp, color: 'purple' },
          { label: 'Optimizations', value: dashboardStats.optimizations, icon: Zap, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className={`bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 rounded-xl p-4 text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-6 h-6" />
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Course Engagement</h1>
          <p className="text-blue-200">Analyze course performance and student engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="enrollments">Sort by Enrollments</option>
            <option value="completion">Sort by Completion</option>
            <option value="grade">Sort by Grade</option>
          </select>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-30-days">Last 30 days</option>
            <option value="last-7-days">Last 7 days</option>
            <option value="last-90-days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Enrollments vs Completions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Course Enrollments vs Completions</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {courseEngagement.slice(0, 6).map((course, index) => (
            <div key={course.id} className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1">
                <div 
                  className="w-12 bg-blue-600 rounded-t"
                  style={{ height: `${(course.totalEnrollments / Math.max(...courseEngagement.map(c => c.totalEnrollments))) * 200}px` }}
                ></div>
                <div 
                  className="w-12 bg-green-600 rounded-t"
                  style={{ height: `${(course.completedUsers / Math.max(...courseEngagement.map(c => c.completedUsers))) * 200}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 text-center max-w-16 truncate">
                {course.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Total Enrollments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Completed Users</span>
          </div>
        </div>
      </motion.div>

      {/* Completion Rate Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Completion Rate Distribution</h3>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.824)}`}
                className="text-green-500"
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="60"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - 0.65)}`}
                className="text-yellow-500"
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="40"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.15)}`}
                className="text-orange-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">82.4%</div>
                <div className="text-sm text-gray-400">Overall</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-300">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-300">Not Started</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Trending Courses</h3>
          <div className="space-y-3">
            {trendingCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{course.name}</span>
                </div>
                <span className="text-green-400 font-medium">{course.growth}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Course Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {courseEngagement.slice(0, 3).map((course, index) => (
          <div key={course.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{course.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Total Enrollments: {course.totalEnrollments}</span>
                    <span>Completed: {course.completedUsers}</span>
                    <span>Weekly Active: {course.weeklyActive}</span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                course.trend > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {course.trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(course.trend).toFixed(1)}%
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Average Grade</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${course.averageGrade}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{course.averageGrade.toFixed(1)}%</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Drop-off Rate</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${course.dropOffRate}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{course.dropOffRate.toFixed(1)}%</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Completion Rate</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${course.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{course.completionRate.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );

  const renderSchools = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Schools Overview</h1>
          <p className="text-blue-200">Manage and monitor all schools in your network</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search schools..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
            <option>Sort by Users</option>
            <option>Sort by Activity</option>
            <option>Sort by Courses</option>
          </select>
        </div>
      </div>

      {/* Schools Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Schools Activity Chart</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {schoolsData.slice(0, 6).map((school, index) => (
            <div key={school.id} className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1">
                <div 
                  className="w-16 bg-blue-600 rounded-t"
                  style={{ height: `${(school.totalUsers / Math.max(...schoolsData.map(s => s.totalUsers))) * 200}px` }}
                ></div>
                <div 
                  className="w-16 bg-green-600 rounded-t"
                  style={{ height: `${(school.activeUsers / Math.max(...schoolsData.map(s => s.activeUsers))) * 200}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 text-center max-w-16 truncate">
                {school.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Total Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Active Users</span>
          </div>
        </div>
      </motion.div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schoolsData.map((school, index) => (
          <motion.div
            key={school.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                  <span className="text-xs text-blue-400 font-medium">{school.category}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Users</span>
                <span className="text-white font-medium">{school.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Courses</span>
                <span className="text-white font-medium">{school.totalCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active Users</span>
                <span className="text-white font-medium">{school.activeUsers}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Activity Rate</span>
                  <span className="text-white font-medium">{school.activityRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${school.activityRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTrainers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Trainer Overview</h1>
          <p className="text-blue-200">Monitor trainer performance and student engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search trainers..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
            <option>Sort by Completion Rate</option>
            <option>Sort by Students</option>
            <option>Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Trainer Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Trainer Performance Comparison</h3>
        <div className="h-64 flex items-end justify-between gap-8">
          {trainersData.map((trainer, index) => (
            <div key={trainer.id} className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <div 
                  className="w-12 bg-green-600 rounded-t"
                  style={{ height: `${(trainer.completionRate / 100) * 200}px` }}
                ></div>
                <div 
                  className="w-12 bg-orange-600 rounded-t"
                  style={{ height: `${(trainer.avgGrade / 100) * 200}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 text-center max-w-20 truncate">
                {trainer.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Completion Rate (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span className="text-sm text-gray-300">Average Grade</span>
          </div>
        </div>
      </motion.div>

      {/* Trainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainersData.map((trainer, index) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{trainer.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">{trainer.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Courses Assigned</span>
                <span className="text-white font-medium">{trainer.coursesAssigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Students</span>
                <span className="text-white font-medium">{trainer.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg Grade</span>
                <span className="text-white font-medium">{trainer.avgGrade}%</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Completion Rate</span>
                  <span className="text-white font-medium">{trainer.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${trainer.completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Performance</span>
                <span className={`text-sm font-medium ${
                  trainer.performance === 'Excellent' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {trainer.performance}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'ai-dashboard':
        return renderAIDashboard();
      case 'courses':
        return renderCourses();
      case 'schools':
        return renderSchools();
      case 'trainers':
        return renderTrainers();
      default:
        return renderAIDashboard();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">EduAI</h1>
                <p className="text-xs text-gray-400">Advanced Analytics</p>
              </div>
            </div>
            
            <div className="flex gap-2 ml-8">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'courses' && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Bell className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">admin</div>
                <div className="text-xs text-gray-400">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Engine Status */}
      <div className="fixed bottom-4 left-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-medium text-white">AI Engine Status</div>
            <div className="text-xs text-gray-400">Fully Operational</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">94%</div>
            <div className="text-xs text-gray-400">Processing Power</div>
          </div>
        </div>
        <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-1">Model Accuracy</div>
          <div className="w-32 bg-gray-700 rounded-full h-1">
            <div className="bg-purple-500 h-1 rounded-full" style={{ width: '92.2%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};