import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, BookOpen, Code, FileCheck, ShoppingBag, 
  Plus, Edit, Trash2, Search, Check, RefreshCw, Star, Flame, Lock, 
  Eye, CheckCircle2, AlertCircle, ArrowLeft, BarChart3, Database
} from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { WORD_TRANSLATIONS } from '../data/vocabularyData';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'words' | 'courses' | 'tests' | 'rewards'
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage state managers for real live CRUD
  const [usersList, setUsersList] = useState([]);
  const [wordsList, setWordsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [testsList, setTestsList] = useState([]);
  const [rewardsList, setRewardsList] = useState([]);

  // Modals & Form State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'user' | 'word' | 'course' | 'test' | 'reward'
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({});

  // 1. Initial Data Load & Storage Re-hydration
  useEffect(() => {
    // USERS
    const savedUsers = localStorage.getItem('vithai_all_registered_users');
    if (savedUsers) {
      try { setUsersList(JSON.parse(savedUsers)); } catch (e) {}
    } else {
      const defaultUsers = [
        { id: 'usr_sabari', name: 'Sabari', email: 'sabari@vithai.edu', xp: 1450, streak: 14, avatar: '🎓', isAdmin: false },
        { id: 'usr_admin', name: 'VithAI Super Admin', email: 'admin@vithai.edu', xp: 5000, streak: 30, avatar: '👑', isAdmin: true },
        { id: 'usr_priya', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', xp: 2280, streak: 15, avatar: '🦊', isAdmin: false },
        { id: 'usr_alex', name: 'Alex Chen', email: 'alex.chen@gmail.com', xp: 3400, streak: 21, avatar: '👨‍💻', isAdmin: false }
      ];
      setUsersList(defaultUsers);
      localStorage.setItem('vithai_all_registered_users', JSON.stringify(defaultUsers));
    }

    // WORDS
    const savedWords = localStorage.getItem('vithai_admin_words');
    if (savedWords) {
      try { setWordsList(JSON.parse(savedWords)); } catch (e) {}
    } else {
      const wordEntries = Object.entries(WORD_TRANSLATIONS || {}).slice(0, 15).map(([wKey, wVal]) => ({
        id: 'w_' + wKey.toLowerCase(),
        word: wKey,
        category: 'Everyday',
        meaning: wVal?.ta?.meaning || 'மேம்படுத்துதல்',
        phonetic: `/${wKey.toLowerCase()}/`,
        explanation: wVal?.ta?.explanation || 'ஒரு திறனை அல்லது நிலையை சிறப்பாக மாற்றுவது.'
      }));
      setWordsList(wordEntries);
      localStorage.setItem('vithai_admin_words', JSON.stringify(wordEntries));
    }

    // COURSES
    const savedCourses = localStorage.getItem('vithai_admin_courses');
    if (savedCourses) {
      try { setCoursesList(JSON.parse(savedCourses)); } catch (e) {}
    } else {
      const defaultCourses = [
        { id: 'c_py', title: 'CodeLoop Python Basics', category: 'Programming', level: 'Beginner', lessonsCount: 30, status: 'Active' },
        { id: 'c_cpp', title: 'CodeLoop C++ & Data Structures', category: 'Programming', level: 'Advanced', lessonsCount: 25, status: 'Active' },
        { id: 'c_eng', title: 'English Everyday Foundations', category: 'Language', level: 'Intermediate', lessonsCount: 60, status: 'Active' },
        { id: 'c_js', title: 'CodeLoop Fullstack JavaScript', category: 'Programming', level: 'Intermediate', lessonsCount: 20, status: 'Active' }
      ];
      setCoursesList(defaultCourses);
      localStorage.setItem('vithai_admin_courses', JSON.stringify(defaultCourses));
    }

    // TESTS
    const savedTests = localStorage.getItem('vithai_admin_tests');
    if (savedTests) {
      try { setTestsList(JSON.parse(savedTests)); } catch (e) {}
    } else {
      const defaultTests = [
        { id: 't_1', question: 'What is the native meaning of "Improve"?', category: 'Vocabulary', answer: 'மேம்படுத்துதல்' },
        { id: 't_2', question: 'In Python, what key is used to store data in key-value pairs?', category: 'Python', answer: 'Dictionary' },
        { id: 't_3', question: 'Which keyword creates a constant variable in C++?', category: 'C++', answer: 'const' }
      ];
      setTestsList(defaultTests);
      localStorage.setItem('vithai_admin_tests', JSON.stringify(defaultTests));
    }

    // REWARDS
    const savedRewards = localStorage.getItem('vithai_admin_rewards');
    if (savedRewards) {
      try { setRewardsList(JSON.parse(savedRewards)); } catch (e) {}
    } else {
      const defaultRewards = [
        { id: 'r_gold', name: 'Golden Avatar Frame', price: 500, type: 'Frame', icon: '👑' },
        { id: 'r_boost', name: '2x XP Booster (24h)', price: 300, type: 'Booster', icon: '⚡' },
        { id: 'r_fire', name: 'Flame Master Badge', price: 800, type: 'Badge', icon: '🔥' }
      ];
      setRewardsList(defaultRewards);
      localStorage.setItem('vithai_admin_rewards', JSON.stringify(defaultRewards));
    }
  }, []);

  // Save changes helper
  const syncStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Restrict Non-Admin Access
  if (!user?.isAdmin && !user?.email?.toLowerCase().includes('admin')) {
    return (
      <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column">
        <Header />
        <Navbar />
        <main className="container max-w-lg py-5 my-auto text-center">
          <div className="card border-0 rounded-5 shadow-lg p-4 p-md-5">
            <div className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="fw-black text-dark dark:text-white mb-2">Admin Access Restricted</h3>
            <p className="small text-muted mb-4">
              The Admin Control Panel is restricted. Please log in with admin credentials (e.g. <code>admin@vithai.edu</code>) to manage the website.
            </p>
            <Link to="/login" className="btn btn-indigo rounded-4 py-2.5 px-4 fw-bold d-inline-flex align-items-center gap-2 shadow-sm">
              Sign In as Admin <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- CRUD HANDLERS ---

  // Open Modal for Create or Edit
  const openFormModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      if (type === 'user') setFormData({ name: '', email: '', xp: 100, streak: 1, avatar: '🎓', isAdmin: false });
      if (type === 'word') setFormData({ word: '', category: 'Everyday', meaning: '', phonetic: '', explanation: '' });
      if (type === 'course') setFormData({ title: '', category: 'Programming', level: 'Beginner', lessonsCount: 20, status: 'Active' });
      if (type === 'test') setFormData({ question: '', category: 'Vocabulary', answer: '' });
      if (type === 'reward') setFormData({ name: '', price: 200, type: 'Frame', icon: '🎁' });
    }
    setShowModal(true);
  };

  // Submit Save/Update
  const handleFormSave = (e) => {
    e.preventDefault();
    if (modalType === 'user') {
      let updated;
      if (editingItem) {
        updated = usersList.map(u => u.id === editingItem.id ? { ...u, ...formData } : u);
      } else {
        const newItem = { ...formData, id: 'usr_' + Date.now() };
        updated = [newItem, ...usersList];
      }
      setUsersList(updated);
      syncStorage('vithai_all_registered_users', updated);
    }

    if (modalType === 'word') {
      let updated;
      if (editingItem) {
        updated = wordsList.map(w => w.id === editingItem.id ? { ...w, ...formData } : w);
      } else {
        const newItem = { ...formData, id: 'w_' + Date.now() };
        updated = [newItem, ...wordsList];
      }
      setWordsList(updated);
      syncStorage('vithai_admin_words', updated);
    }

    if (modalType === 'course') {
      let updated;
      if (editingItem) {
        updated = coursesList.map(c => c.id === editingItem.id ? { ...c, ...formData } : c);
      } else {
        const newItem = { ...formData, id: 'c_' + Date.now() };
        updated = [newItem, ...coursesList];
      }
      setCoursesList(updated);
      syncStorage('vithai_admin_courses', updated);
    }

    if (modalType === 'test') {
      let updated;
      if (editingItem) {
        updated = testsList.map(t => t.id === editingItem.id ? { ...t, ...formData } : t);
      } else {
        const newItem = { ...formData, id: 't_' + Date.now() };
        updated = [newItem, ...testsList];
      }
      setTestsList(updated);
      syncStorage('vithai_admin_tests', updated);
    }

    if (modalType === 'reward') {
      let updated;
      if (editingItem) {
        updated = rewardsList.map(r => r.id === editingItem.id ? { ...r, ...formData } : r);
      } else {
        const newItem = { ...formData, id: 'r_' + Date.now() };
        updated = [newItem, ...rewardsList];
      }
      setRewardsList(updated);
      syncStorage('vithai_admin_rewards', updated);
    }

    setShowModal(false);
  };

  // Delete Handler
  const handleDelete = (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (type === 'user') {
      const updated = usersList.filter(u => u.id !== id);
      setUsersList(updated);
      syncStorage('vithai_all_registered_users', updated);
    }
    if (type === 'word') {
      const updated = wordsList.filter(w => w.id !== id);
      setWordsList(updated);
      syncStorage('vithai_admin_words', updated);
    }
    if (type === 'course') {
      const updated = coursesList.filter(c => c.id !== id);
      setCoursesList(updated);
      syncStorage('vithai_admin_courses', updated);
    }
    if (type === 'test') {
      const updated = testsList.filter(t => t.id !== id);
      setTestsList(updated);
      syncStorage('vithai_admin_tests', updated);
    }
    if (type === 'reward') {
      const updated = rewardsList.filter(r => r.id !== id);
      setRewardsList(updated);
      syncStorage('vithai_admin_rewards', updated);
    }
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container-fluid px-3 px-md-5 py-4 flex-grow-1">
        
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark font-mono px-3 py-1 fw-bold fs-6">SUPER ADMIN</span>
              <h2 className="fw-black text-dark dark:text-white mb-0">VithAI Master Control Panel</h2>
            </div>
            <p className="small text-muted mb-0 mt-1">
              Complete CRUD Control over Registered Users, Vocabulary Suite, Courses, Tests, & Rewards.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => openFormModal(activeTab.slice(0, -1))}
              className="btn btn-indigo rounded-4 px-4 py-2.5 fw-bold d-flex align-items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New {activeTab.slice(0, -1).toUpperCase()}
            </button>
          </div>
        </div>

        {/* Global Statistics Counter Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 rounded-4 p-3 bg-white dark:bg-dark shadow-sm border-start border-4 border-indigo">
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small fw-bold uppercase">Registered Users</span>
                <Users className="w-5 h-5 text-indigo" />
              </div>
              <h3 className="fw-black text-dark dark:text-white mt-2 mb-0">{usersList.length}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 rounded-4 p-3 bg-white dark:bg-dark shadow-sm border-start border-4 border-success">
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small fw-bold uppercase">Vocabulary Words</span>
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <h3 className="fw-black text-dark dark:text-white mt-2 mb-0">{wordsList.length}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 rounded-4 p-3 bg-white dark:bg-dark shadow-sm border-start border-4 border-purple">
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small fw-bold uppercase">Active Courses</span>
                <Code className="w-5 h-5 text-purple" />
              </div>
              <h3 className="fw-black text-dark dark:text-white mt-2 mb-0">{coursesList.length}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 rounded-4 p-3 bg-white dark:bg-dark shadow-sm border-start border-4 border-warning">
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small fw-bold uppercase">Store Rewards</span>
                <ShoppingBag className="w-5 h-5 text-warning" />
              </div>
              <h3 className="fw-black text-dark dark:text-white mt-2 mb-0">{rewardsList.length}</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="card border-0 rounded-5 shadow-sm p-2 mb-4 bg-white dark:bg-dark">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-1 overflow-x-auto p-1">
              {[
                { id: 'users', label: 'Registered Users', icon: Users },
                { id: 'words', label: 'Vocabulary Words', icon: BookOpen },
                { id: 'courses', label: 'Courses & Code', icon: Code },
                { id: 'tests', label: 'Mock Test Questions', icon: FileCheck },
                { id: 'rewards', label: 'Rewards Store', icon: ShoppingBag }
              ].map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setSearchQuery(''); }}
                    className={`btn btn-sm rounded-4 px-3 py-2 fw-bold d-flex align-items-center gap-2 border-0 ${
                      isActive ? 'btn-indigo text-white shadow-sm' : 'text-muted hover:bg-light'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Live Filter Search Bar */}
            <div className="input-group" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-light border-0 rounded-start-4">
                <Search className="w-4 h-4 text-muted" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="form-control form-control-sm border-0 bg-light rounded-end-4"
              />
            </div>
          </div>
        </div>

        {/* --- MAIN DATA TABLES --- */}

        {/* 1. USERS TABLE */}
        {activeTab === 'users' && (
          <div className="card border-0 rounded-5 shadow-sm p-4 bg-white dark:bg-dark">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Platform User Accounts ({usersList.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>XP Earned</th>
                    <th>Streak</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {usersList
                    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(u => (
                      <tr key={u.id}>
                        <td className="fw-bold d-flex align-items-center gap-2">
                          <span className="fs-5">{u.avatar || '🎓'}</span> {u.name}
                        </td>
                        <td className="text-muted">{u.email}</td>
                        <td className="fw-bold text-indigo"><Star className="w-3.5 h-3.5 fill-indigo me-1" />{u.xp || 0} XP</td>
                        <td className="fw-bold text-warning"><Flame className="w-3.5 h-3.5 fill-warning me-1" />{u.streak || 0} Days</td>
                        <td>
                          {u.isAdmin ? (
                            <span className="badge bg-warning text-dark fw-bold">ADMIN 👑</span>
                          ) : (
                            <span className="badge bg-indigo-subtle-custom text-indigo">LEARNER</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button onClick={() => openFormModal('user', u)} className="btn btn-sm btn-light border rounded-3 me-1 text-primary">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete('user', u.id)} className="btn btn-sm btn-light border rounded-3 text-danger">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. WORDS TABLE */}
        {activeTab === 'words' && (
          <div className="card border-0 rounded-5 shadow-sm p-4 bg-white dark:bg-dark">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Vocabulary Dictionary Database ({wordsList.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>Word</th>
                    <th>Category</th>
                    <th>Tamil Meaning</th>
                    <th>Phonetic</th>
                    <th>Native Explanation</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {wordsList
                    .filter(w => w.word.toLowerCase().includes(searchQuery.toLowerCase()) || w.meaning.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(w => (
                      <tr key={w.id}>
                        <td className="fw-bold text-indigo fs-6">{w.word}</td>
                        <td><span className="badge bg-light text-dark border">{w.category}</span></td>
                        <td className="fw-bold text-dark">{w.meaning}</td>
                        <td className="font-monospace text-muted">{w.phonetic}</td>
                        <td className="text-muted text-truncate max-w-xs">{w.explanation}</td>
                        <td className="text-end">
                          <button onClick={() => openFormModal('word', w)} className="btn btn-sm btn-light border rounded-3 me-1 text-primary">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete('word', w.id)} className="btn btn-sm btn-light border rounded-3 text-danger">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. COURSES TABLE */}
        {activeTab === 'courses' && (
          <div className="card border-0 rounded-5 shadow-sm p-4 bg-white dark:bg-dark">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Active Curriculum Tracks ({coursesList.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>Track Title</th>
                    <th>Category</th>
                    <th>Difficulty Level</th>
                    <th>Lessons Count</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {coursesList
                    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(c => (
                      <tr key={c.id}>
                        <td className="fw-bold text-dark">{c.title}</td>
                        <td><span className="badge bg-indigo-subtle-custom text-indigo">{c.category}</span></td>
                        <td><span className="badge bg-light text-dark border">{c.level}</span></td>
                        <td className="fw-bold">{c.lessonsCount} Lessons</td>
                        <td><span className="badge bg-success">Active</span></td>
                        <td className="text-end">
                          <button onClick={() => openFormModal('course', c)} className="btn btn-sm btn-light border rounded-3 me-1 text-primary">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete('course', c.id)} className="btn btn-sm btn-light border rounded-3 text-danger">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. TESTS TABLE */}
        {activeTab === 'tests' && (
          <div className="card border-0 rounded-5 shadow-sm p-4 bg-white dark:bg-dark">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Mock Test Question Bank ({testsList.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Answer Key</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {testsList
                    .filter(t => t.question.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(t => (
                      <tr key={t.id}>
                        <td className="fw-bold text-dark">{t.question}</td>
                        <td><span className="badge bg-purple-subtle text-purple border">{t.category}</span></td>
                        <td className="fw-bold text-success">{t.answer}</td>
                        <td className="text-end">
                          <button onClick={() => openFormModal('test', t)} className="btn btn-sm btn-light border rounded-3 me-1 text-primary">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete('test', t.id)} className="btn btn-sm btn-light border rounded-3 text-danger">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. REWARDS TABLE */}
        {activeTab === 'rewards' && (
          <div className="card border-0 rounded-5 shadow-sm p-4 bg-white dark:bg-dark">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">XP Store Rewards & Badges ({rewardsList.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>Reward Name</th>
                    <th>Type</th>
                    <th>Coin Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {rewardsList
                    .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold text-dark"><span className="fs-5 me-2">{r.icon}</span>{r.name}</td>
                        <td><span className="badge bg-light text-dark border">{r.type}</span></td>
                        <td className="fw-bold text-warning">{r.price} Coins</td>
                        <td className="text-end">
                          <button onClick={() => openFormModal('reward', r)} className="btn btn-sm btn-light border rounded-3 me-1 text-primary">
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete('reward', r.id)} className="btn btn-sm btn-light border rounded-3 text-danger">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- UNIVERSAL DYNAMIC CRUD MODAL --- */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1070 }}>
          <div className="card border-0 rounded-5 shadow-lg w-100 overflow-hidden" style={{ maxWidth: '540px' }}>
            <div className="card-header bg-indigo text-white p-3 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0">
                {editingItem ? 'Edit' : 'Add New'} {modalType.toUpperCase()}
              </h5>
              <button onClick={() => setShowModal(false)} className="btn-close btn-close-white shadow-none"></button>
            </div>
            
            <form onSubmit={handleFormSave} className="card-body p-4 d-flex flex-column gap-3">
              
              {/* USER FORM */}
              {modalType === 'user' && (
                <>
                  <div>
                    <label className="form-label fw-bold small mb-1">Full Name</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div>
                    <label className="form-label fw-bold small mb-1">Email Address</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">XP</label>
                      <input type="number" value={formData.xp || 0} onChange={e => setFormData({ ...formData, xp: Number(e.target.value) })} className="form-control rounded-3" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Streak Days</label>
                      <input type="number" value={formData.streak || 0} onChange={e => setFormData({ ...formData, streak: Number(e.target.value) })} className="form-control rounded-3" />
                    </div>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" checked={!!formData.isAdmin} onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })} className="form-check-input" id="adminCheck" />
                    <label className="form-check-label fw-bold small" htmlFor="adminCheck">Grant Admin Access Privileges 👑</label>
                  </div>
                </>
              )}

              {/* WORD FORM */}
              {modalType === 'word' && (
                <>
                  <div>
                    <label className="form-label fw-bold small mb-1">English Word</label>
                    <input type="text" value={formData.word || ''} onChange={e => setFormData({ ...formData, word: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Category</label>
                      <select value={formData.category || 'Everyday'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select rounded-3">
                        <option value="Everyday">Everyday</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Business">Business</option>
                        <option value="Tech & Code">Tech & Code</option>
                        <option value="Idioms">Idioms</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Tamil Meaning</label>
                      <input type="text" value={formData.meaning || ''} onChange={e => setFormData({ ...formData, meaning: e.target.value })} className="form-control rounded-3" required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-bold small mb-1">Phonetic</label>
                    <input type="text" value={formData.phonetic || ''} onChange={e => setFormData({ ...formData, phonetic: e.target.value })} className="form-control rounded-3" placeholder="/word/" />
                  </div>
                  <div>
                    <label className="form-label fw-bold small mb-1">Tamil Explanation</label>
                    <textarea value={formData.explanation || ''} onChange={e => setFormData({ ...formData, explanation: e.target.value })} className="form-control rounded-3" rows="2" required></textarea>
                  </div>
                </>
              )}

              {/* COURSE FORM */}
              {modalType === 'course' && (
                <>
                  <div>
                    <label className="form-label fw-bold small mb-1">Track Title</label>
                    <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Category</label>
                      <select value={formData.category || 'Programming'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-select rounded-3">
                        <option value="Programming">Programming</option>
                        <option value="Language">Language</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Level</label>
                      <input type="text" value={formData.level || 'Beginner'} onChange={e => setFormData({ ...formData, level: e.target.value })} className="form-control rounded-3" />
                    </div>
                  </div>
                </>
              )}

              {/* TEST FORM */}
              {modalType === 'test' && (
                <>
                  <div>
                    <label className="form-label fw-bold small mb-1">Question Text</label>
                    <input type="text" value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div>
                    <label className="form-label fw-bold small mb-1">Correct Answer</label>
                    <input type="text" value={formData.answer || ''} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="form-control rounded-3" required />
                  </div>
                </>
              )}

              {/* REWARD FORM */}
              {modalType === 'reward' && (
                <>
                  <div>
                    <label className="form-label fw-bold small mb-1">Reward Name</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-control rounded-3" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Icon Emoji</label>
                      <input type="text" value={formData.icon || '🎁'} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="form-control rounded-3" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small mb-1">Coin Price</label>
                      <input type="number" value={formData.price || 100} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="form-control rounded-3" />
                    </div>
                  </div>
                </>
              )}

              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-light rounded-3 fw-bold">Cancel</button>
                <button type="submit" className="btn btn-indigo rounded-3 fw-bold px-4">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
