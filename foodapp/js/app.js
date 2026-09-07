/**
 * Food Tracking App - Main JavaScript
 * =====================================
 * Handles all frontend functionality including:
 * - Theme management
 * - LocalStorage persistence
 * - Food logging
 * - Habit tracking
 * - Exercise plans
 * - Charts
 * - UI interactions
 */

// ============================================
// App State & Configuration
// ============================================

const APP_STATE = {
  currentUser: null,
  foods: [],
  habits: {
    water: { current: 0, target: 8 },
    steps: { current: 0, target: 10000 },
    sleep: { current: 0, target: 8 },
    fruits: { current: 0, target: 5 }
  },
  exercises: {},
  goals: {
    calories: 2000,
    water: 8,
    steps: 10000
  },
  achievements: [],
  streaks: {
    current: 0,
    longest: 0,
    lastLogged: null
  },
  settings: {
    theme: 'light',
    notifications: true,
    soundEffects: false
  }
};

// Sample food database for quick add
const FOOD_DATABASE = [
  { name: 'Apple', calories: 95, protein: 0.5, fat: 0.3, carbs: 25, sugar: 19 },
  { name: 'Banana', calories: 105, protein: 1.3, fat: 0.4, carbs: 27, sugar: 14 },
  { name: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, sugar: 0 },
  { name: 'Rice (cooked)', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, sugar: 0.1 },
  { name: 'Broccoli', calories: 55, protein: 3.7, fat: 0.6, carbs: 11, sugar: 2.2 },
  { name: 'Salmon', calories: 208, protein: 20, fat: 13, carbs: 0, sugar: 0 },
  { name: 'Egg', calories: 70, protein: 6, fat: 5, carbs: 0.6, sugar: 0.6 },
  { name: 'Oatmeal', calories: 150, protein: 5, fat: 2.5, carbs: 27, sugar: 1 },
  { name: 'Yogurt', calories: 100, protein: 10, fat: 0, carbs: 6, sugar: 6 },
  { name: 'Almonds', calories: 160, protein: 6, fat: 14, carbs: 6, sugar: 1 },
  { name: 'Spinach', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, sugar: 0.4 },
  { name: 'Avocado', calories: 160, protein: 2, fat: 15, carbs: 9, sugar: 0.7 },
  { name: 'Sweet Potato', calories: 112, protein: 2, fat: 0.1, carbs: 26, sugar: 5 },
  { name: 'Greek Yogurt', calories: 130, protein: 15, fat: 4, carbs: 8, sugar: 7 },
  { name: 'Quinoa', calories: 120, protein: 4.4, fat: 1.9, carbs: 21, sugar: 0 }
];

// Exercise plan data
const EXERCISE_PLAN = {
  monday: [
    { name: 'Morning Jog', duration: '30 min', type: 'cardio' },
    { name: 'Push-ups', duration: '3 sets x 15', type: 'strength' },
    { name: 'Squats', duration: '3 sets x 20', type: 'strength' }
  ],
  tuesday: [
    { name: 'Yoga Flow', duration: '45 min', type: 'flexibility' },
    { name: 'Plank', duration: '3 sets x 1 min', type: 'core' }
  ],
  wednesday: [
    { name: 'HIIT Workout', duration: '25 min', type: 'cardio' },
    { name: 'Lunges', duration: '3 sets x 15 each', type: 'strength' },
    { name: 'Dumbbell Rows', duration: '3 sets x 12', type: 'strength' }
  ],
  thursday: [
    { name: 'Swimming', duration: '40 min', type: 'cardio' },
    { name: 'Stretching', duration: '15 min', type: 'flexibility' }
  ],
  friday: [
    { name: 'Cycling', duration: '45 min', type: 'cardio' },
    { name: 'Burpees', duration: '3 sets x 10', type: 'strength' },
    { name: 'Mountain Climbers', duration: '3 sets x 30', type: 'core' }
  ],
  saturday: [
    { name: 'Full Body Workout', duration: '60 min', type: 'strength' },
    { name: 'Jump Rope', duration: '10 min', type: 'cardio' }
  ],
  sunday: [
    { name: 'Rest Day', duration: 'Active recovery', type: 'rest' },
    { name: 'Light Walking', duration: '20 min', type: 'cardio' },
    { name: 'Meditation', duration: '15 min', type: 'mindfulness' }
  ]
};

// Achievements data
const ACHIEVEMENTS_DATA = [
  { id: 'first_log', name: 'First Steps', description: 'Log your first food entry', icon: 'utensils' },
  { id: 'streak_3', name: '3-Day Streak', description: 'Log food for 3 consecutive days', icon: 'flame' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Log food for 7 consecutive days', icon: 'star' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Log food for 30 consecutive days', icon: 'crown' },
  { id: 'water_goal', name: 'Hydration Hero', description: 'Meet your daily water goal', icon: 'droplet' },
  { id: 'steps_goal', name: 'Step Champion', description: 'Reach 10,000 steps in a day', icon: 'footprints' },
  { id: 'healthy_week', name: 'Healthy Week', description: 'Stay under calorie goal for 7 days', icon: 'heart' },
  { id: 'exercise_complete', name: 'Workout Warrior', description: 'Complete all exercises for a day', icon: 'dumbbell' }
];

// ============================================
// Storage Utilities
// ============================================

const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }
};

// ============================================
// Theme Management
// ============================================

const ThemeManager = {
  init() {
    const savedTheme = Storage.get('theme', 'light');
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('theme', theme);
    APP_STATE.settings.theme = theme;
  },

  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
};

// ============================================
// Toast Notifications
// ============================================

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', title = '', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
      success: this.getSuccessIcon(),
      error: this.getErrorIcon(),
      warning: this.getWarningIcon(),
      info: this.getInfoIcon()
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type]}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message, title = 'Success') {
    this.show(message, 'success', title);
  },

  error(message, title = 'Error') {
    this.show(message, 'error', title);
  },

  warning(message, title = 'Warning') {
    this.show(message, 'warning', title);
  },

  info(message, title = 'Info') {
    this.show(message, 'info', title);
  },

  getSuccessIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>`;
  },

  getErrorIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M15 9l-6 6M9 9l6 6"/>
    </svg>`;
  },

  getWarningIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <path d="M12 9v4M12 17h.01"/>
    </svg>`;
  },

  getInfoIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>`;
  }
};

// ============================================
// Modal Management
// ============================================

const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// ============================================
// Form Validation
// ============================================

const Validation = {
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validateRequired(value) {
    return value && value.trim().length > 0;
  },

  validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  },

  validatePassword(password) {
    return password.length >= 6;
  },

  showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorEl = formGroup.querySelector('.form-error');
    
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      formGroup.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    input.classList.add('error');
  },

  clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.form-error');
    if (errorEl) {
      errorEl.remove();
    }
    input.classList.remove('error');
  },

  clearAllErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }
};

// ============================================
// User Management
// ============================================

const UserManager = {
  register(userData) {
    const users = Storage.get('users', []);
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.set('users', users);
    
    return { success: true, user: newUser };
  },

  login(email, password) {
    const users = Storage.get('users', []);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      APP_STATE.currentUser = user;
      Storage.set('currentUser', user);
      return { success: true, user };
    }

    return { success: false, message: 'Invalid email or password' };
  },

  logout() {
    APP_STATE.currentUser = null;
    Storage.remove('currentUser');
  },

  getCurrentUser() {
    if (!APP_STATE.currentUser) {
      APP_STATE.currentUser = Storage.get('currentUser');
    }
    return APP_STATE.currentUser;
  },

  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };

    const users = Storage.get('users', []);
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      Storage.set('users', users);
      Storage.set('currentUser', users[index]);
      APP_STATE.currentUser = users[index];
      return { success: true, user: users[index] };
    }

    return { success: false, message: 'User not found' };
  }
};

// ============================================
// Food Management
// ============================================

const FoodManager = {
  getAll() {
    return Storage.get('foods', []);
  },

  getByDate(date) {
    const foods = this.getAll();
    return foods.filter(f => f.date === date);
  },

  getByDateRange(startDate, endDate) {
    const foods = this.getAll();
    return foods.filter(f => f.date >= startDate && f.date <= endDate);
  },

  add(foodData) {
    const foods = this.getAll();
    const newFood = {
      id: Date.now().toString(),
      ...foodData,
      date: foodData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    foods.push(newFood);
    Storage.set('foods', foods);
    
    this.updateStreak();
    this.checkAchievements();
    
    return { success: true, food: newFood };
  },

  update(id, updates) {
    const foods = this.getAll();
    const index = foods.findIndex(f => f.id === id);

    if (index !== -1) {
      foods[index] = { ...foods[index], ...updates };
      Storage.set('foods', foods);
      return { success: true, food: foods[index] };
    }

    return { success: false, message: 'Food not found' };
  },

  delete(id) {
    const foods = this.getAll();
    const filtered = foods.filter(f => f.id !== id);
    Storage.set('foods', filtered);
    return { success: true };
  },

  search(query) {
    const foods = this.getAll();
    const lowerQuery = query.toLowerCase();
    return foods.filter(f => 
      f.name.toLowerCase().includes(lowerQuery)
    );
  },

  getDailyTotals(date = new Date().toISOString().split('T')[0]) {
    const foods = this.getByDate(date);
    return foods.reduce((totals, food) => ({
      calories: totals.calories + (parseFloat(food.calories) || 0),
      protein: totals.protein + (parseFloat(food.protein) || 0),
      fat: totals.fat + (parseFloat(food.fat) || 0),
      carbs: totals.carbs + (parseFloat(food.carbs) || 0),
      sugar: totals.sugar + (parseFloat(food.sugar) || 0)
    }), { calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0 });
  },

  updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastLogged = Storage.get('lastLoggedDate');
    let streaks = Storage.get('streaks', { current: 0, longest: 0 });

    if (lastLogged) {
      const lastDate = new Date(lastLogged);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streaks.current++;
      } else if (diffDays > 1) {
        streaks.current = 1;
      }
    } else {
      streaks.current = 1;
    }

    if (streaks.current > streaks.longest) {
      streaks.longest = streaks.current;
    }

    Storage.set('streaks', streaks);
    Storage.set('lastLoggedDate', today);
    APP_STATE.streaks = streaks;
  },

  checkAchievements() {
    const foods = this.getAll();
    const streaks = Storage.get('streaks', { current: 0, longest: 0 });
    let achievements = Storage.get('achievements', []);

    // First log
    if (foods.length === 1 && !achievements.includes('first_log')) {
      achievements.push('first_log');
    }

    // Streak achievements
    if (streaks.current >= 3 && !achievements.includes('streak_3')) {
      achievements.push('streak_3');
    }
    if (streaks.current >= 7 && !achievements.includes('streak_7')) {
      achievements.push('streak_7');
    }
    if (streaks.current >= 30 && !achievements.includes('streak_30')) {
      achievements.push('streak_30');
    }

    Storage.set('achievements', achievements);
    APP_STATE.achievements = achievements;
  },

  getFoodDatabase() {
    return FOOD_DATABASE;
  }
};

// ============================================
// Habit Tracking
// ============================================

const HabitManager = {
  init() {
    const savedHabits = Storage.get('habits');
    if (savedHabits) {
      APP_STATE.habits = savedHabits;
    } else {
      Storage.set('habits', APP_STATE.habits);
    }
  },

  getAll() {
    return Storage.get('habits', APP_STATE.habits);
  },

  update(habitType, value) {
    const habits = this.getAll();
    habits[habitType].current = Math.max(0, value);
    Storage.set('habits', habits);
    APP_STATE.habits = habits;
    
    // Check water achievement
    if (habitType === 'water' && habits.water.current >= habits.water.target) {
      let achievements = Storage.get('achievements', []);
      if (!achievements.includes('water_goal')) {
        achievements.push('water_goal');
        Storage.set('achievements', achievements);
        APP_STATE.achievements = achievements;
      }
    }
    
    // Check steps achievement
    if (habitType === 'steps' && habits.steps.current >= habits.steps.target) {
      let achievements = Storage.get('achievements', []);
      if (!achievements.includes('steps_goal')) {
        achievements.push('steps_goal');
        Storage.set('achievements', achievements);
        APP_STATE.achievements = achievements;
      }
    }
    
    return habits;
  },

  increment(habitType, amount = 1) {
    const habits = this.getAll();
    const newValue = habits[habitType].current + amount;
    return this.update(habitType, newValue);
  },

  decrement(habitType, amount = 1) {
    const habits = this.getAll();
    const newValue = habits[habitType].current - amount;
    return this.update(habitType, newValue);
  },

  setTarget(habitType, target) {
    const habits = this.getAll();
    habits[habitType].target = target;
    Storage.set('habits', habits);
    APP_STATE.habits = habits;
    return habits;
  },

  resetDaily() {
    const habits = this.getAll();
    Object.keys(habits).forEach(key => {
      habits[key].current = 0;
    });
    Storage.set('habits', habits);
    APP_STATE.habits = habits;
    return habits;
  }
};

// ============================================
// Exercise Management
// ============================================

const ExerciseManager = {
  getPlan() {
    return EXERCISE_PLAN;
  },

  getCompleted() {
    return Storage.get('exercises', {});
  },

  toggleExercise(day, exerciseIndex) {
    const exercises = this.getCompleted();
    const key = `${day}-${exerciseIndex}`;
    
    if (exercises[key]) {
      delete exercises[key];
    } else {
      exercises[key] = true;
    }
    
    Storage.set('exercises', exercises);
    
    // Check if all exercises for the day are completed
    const dayExercises = EXERCISE_PLAN[day];
    const allCompleted = dayExercises.every((_, idx) => exercises[`${day}-${idx}`]);
    
    if (allCompleted) {
      let achievements = Storage.get('achievements', []);
      if (!achievements.includes('exercise_complete')) {
        achievements.push('exercise_complete');
        Storage.set('achievements', achievements);
        APP_STATE.achievements = achievements;
      }
    }
    
    return exercises;
  },

  isCompleted(day, exerciseIndex) {
    const exercises = this.getCompleted();
    return !!exercises[`${day}-${exerciseIndex}`];
  },

  getDayProgress(day) {
    const dayExercises = EXERCISE_PLAN[day];
    const exercises = this.getCompleted();
    const completed = dayExercises.filter((_, idx) => exercises[`${day}-${idx}`]).length;
    return {
      completed,
      total: dayExercises.length,
      percentage: (completed / dayExercises.length) * 100
    };
  }
};

// ============================================
// Goals Management
// ============================================

const GoalsManager = {
  getAll() {
    return Storage.get('goals', APP_STATE.goals);
  },

  update(updates) {
    const goals = { ...this.getAll(), ...updates };
    Storage.set('goals', goals);
    APP_STATE.goals = goals;
    return goals;
  },

  setCalories(calories) {
    return this.update({ calories: parseInt(calories) });
  },

  setWater(water) {
    HabitManager.setTarget('water', parseInt(water));
    return this.update({ water: parseInt(water) });
  },

  setSteps(steps) {
    HabitManager.setTarget('steps', parseInt(steps));
    return this.update({ steps: parseInt(steps) });
  }
};

// ============================================
// Achievements Management
// ============================================

const AchievementsManager = {
  getAll() {
    return ACHIEVEMENTS_DATA;
  },

  getUnlocked() {
    return Storage.get('achievements', []);
  },

  getStatus() {
    const unlocked = this.getUnlocked();
    return ACHIEVEMENTS_DATA.map(achievement => ({
      ...achievement,
      unlocked: unlocked.includes(achievement.id)
    }));
  }
};

// ============================================
// Chart Helpers
// ============================================

const ChartHelpers = {
  getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  },

  getWeeklyCaloriesData() {
    const dates = this.getLast7Days();
    const data = dates.map(date => {
      const totals = FoodManager.getDailyTotals(date);
      return totals.calories;
    });
    
    const labels = dates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return { labels, data };
  },

  getMacroDistribution() {
    const today = new Date().toISOString().split('T')[0];
    const totals = FoodManager.getDailyTotals(today);
    
    return {
      labels: ['Protein', 'Fat', 'Carbs'],
      data: [totals.protein, totals.fat, totals.carbs],
      colors: ['#22c55e', '#f59e0b', '#3b82f6']
    };
  },

  getMonthlyData() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const labels = [];
    const data = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const totals = FoodManager.getDailyTotals(date);
      labels.push(i);
      data.push(totals.calories);
    }
    
    return { labels, data };
  }
};

// ============================================
// UI Helpers
// ============================================

const UI = {
  formatNumber(num, decimals = 0) {
    return Number(num).toFixed(decimals);
  },

  formatDate(date, options = {}) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', options);
  },

  createCircularProgress(percentage, size = 120) {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#22c55e"/>
            <stop offset="100%" style="stop-color:#16a34a"/>
          </linearGradient>
        </defs>
        <circle class="circular-progress-bg" cx="50" cy="50" r="${radius}"/>
        <circle class="circular-progress-fill" cx="50" cy="50" r="${radius}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      </svg>
    `;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// ============================================
// Mobile Navigation
// ============================================

const MobileNav = {
  init() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
      });

      // Close when clicking a link
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('active');
        });
      });
    }
  }
};

// ============================================
// Search & Filter
// ============================================

const SearchFilter = {
  init(inputSelector, listSelector, itemSelector, searchFields) {
    const input = document.querySelector(inputSelector);
    const list = document.querySelector(listSelector);
    
    if (!input || !list) return;

    input.addEventListener('input', UI.debounce((e) => {
      const query = e.target.value.toLowerCase();
      const items = list.querySelectorAll(itemSelector);

      items.forEach(item => {
        const text = searchFields
          .map(field => item.querySelector(field)?.textContent?.toLowerCase() || '')
          .join(' ');
        
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }, 300));
  }
};

// ============================================
// Calendar
// ============================================

const Calendar = {
  currentDate: new Date(),
  selectedDate: new Date().toISOString().split('T')[0],

  init(containerId, onSelect) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.onSelect = onSelect;
    this.render();
    this.attachEvents();
  },

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = `
      <div class="calendar">
        <div class="calendar-header">
          <button class="btn btn-ghost btn-sm" id="prevMonth">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div class="calendar-title">${monthNames[month]} ${year}</div>
          <button class="btn btn-ghost btn-sm" id="nextMonth">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
        <div class="calendar-grid">
          ${dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
    `;
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      html += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
    }
    
    // Current month days
    const today = new Date().toISOString().split('T')[0];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = date === today;
      const isSelected = date === this.selectedDate;
      const hasData = this.hasDataForDate(date);
      
      let className = 'calendar-day';
      if (isToday) className += ' today';
      if (isSelected) className += ' selected';
      
      let dots = '';
      if (hasData) {
        dots = '<div class="calendar-day-dots">';
        if (hasData.food) dots += '<span class="calendar-dot food"></span>';
        if (hasData.exercise) dots += '<span class="calendar-dot exercise"></span>';
        if (hasData.habit) dots += '<span class="calendar-dot habit"></span>';
        dots += '</div>';
      }
      
      html += `
        <div class="${className}" data-date="${date}">
          <span class="calendar-day-number">${day}</span>
          ${dots}
        </div>
      `;
    }
    
    // Next month days
    const remainingCells = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
      html += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
    }
    
    html += '</div></div>';
    this.container.innerHTML = html;
  },

  hasDataForDate(date) {
    const foods = FoodManager.getByDate(date);
    const exercises = Storage.get('exercises', {});
    const habits = Storage.get('habits', {});
    
    return {
      food: foods.length > 0,
      exercise: Object.keys(exercises).some(key => key.startsWith(date)),
      habit: Object.values(habits).some(h => h.current > 0)
    };
  },

  attachEvents() {
    const prevBtn = this.container.querySelector('#prevMonth');
    const nextBtn = this.container.querySelector('#nextMonth');
    const days = this.container.querySelectorAll('.calendar-day:not(.other-month)');

    prevBtn?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
      this.attachEvents();
    });

    nextBtn?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
      this.attachEvents();
    });

    days.forEach(day => {
      day.addEventListener('click', () => {
        const date = day.dataset.date;
        this.selectedDate = date;
        this.render();
        this.attachEvents();
        if (this.onSelect) this.onSelect(date);
      });
    });
  },

  getSelectedDate() {
    return this.selectedDate;
  }
};

// ============================================
// Animation Utilities
// ============================================

const Animation = {
  // Add animation class and remove after duration
  animate(element, animation, duration = 400) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;
    
    element.classList.add(animation);
    element.style.animationFillMode = 'forwards';
    
    setTimeout(() => {
      element.classList.remove(animation);
      element.style.animationFillMode = '';
    }, duration);
  },

  // Stagger animations for multiple elements
  stagger(selector, animation, staggerDelay = 100, initialDelay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      setTimeout(() => {
        this.animate(el, animation);
      }, initialDelay + (index * staggerDelay));
    });
  },

  // Fade in element
  fadeIn(element, duration = 400) {
    this.animate(element, 'animate-fade-in', duration);
  },

  // Fade in up element
  fadeInUp(element, duration = 500) {
    this.animate(element, 'animate-fade-in-up', duration);
  },

  // Fade in scale element
  fadeInScale(element, duration = 400) {
    this.animate(element, 'animate-fade-in-scale', duration);
  },

  // Bounce element
  bounce(element, duration = 600) {
    this.animate(element, 'animate-bounce', duration);
  },

  // Pulse element
  pulse(element) {
    this.animate(element, 'animate-pulse', 2000);
  },

  // Shake element (for errors)
  shake(element) {
    this.animate(element, 'animate-shake', 500);
  },

  // Float animation (continuous)
  float(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add('animate-float');
    }
  },

  // Glow animation (continuous)
  glow(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add('animate-glow');
    }
  },

  // Stop animation
  stop(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = '';
    }
  },

  // Scroll reveal - animate elements when they come into view
  reveal(selector, options = {}) {
    const {
      threshold = 0.1,
      rootMargin = '0px',
      animation = 'animate-fade-in-up',
      once = true
    } = options;

    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animation);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove(animation);
        }
      });
    }, { threshold, rootMargin });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  },

  // Add ripple effect to button click
  addRipple(button) {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  },

  // Page transition
  pageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-primary, #fff);
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    
    // Fade out
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        if (callback) callback();
        // Fade in
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }, 300);
    });
  },

  // Initialize common animations
  init() {
    // Add ripple to all buttons
    document.querySelectorAll('.btn').forEach(btn => {
      this.addRipple(btn);
    });

    // Animate cards on load
    this.stagger('.card', 'animate-fade-in-up', 100, 200);

    // Animate summary cards
    this.stagger('.summary-card', 'animate-fade-in-scale', 150, 400);

    // Initialize reveal animations
    this.reveal('.reveal', { threshold: 0.2 });
  }
};

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  ThemeManager.init();
  
  // Initialize mobile navigation
  MobileNav.init();
  
  // Initialize habits
  HabitManager.init();
  
  // Initialize animations
  Animation.init();
  
  // Check auth state and redirect if needed
  const currentUser = UserManager.getCurrentUser();
  const publicPages = ['index.html', 'register.html', 'onboarding.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (!currentUser && !publicPages.includes(currentPage)) {
    window.location.href = 'index.html';
    return;
  }
});

// ============================================
// Export for global access
// ============================================
window.App = {
  Storage,
  ThemeManager,
  Toast,
  Modal,
  Validation,
  UserManager,
  FoodManager,
  HabitManager,
  ExerciseManager,
  GoalsManager,
  AchievementsManager,
  ChartHelpers,
  UI,
  Calendar,
  SearchFilter,
  Animation,
  FOOD_DATABASE,
  EXERCISE_PLAN,
  ACHIEVEMENTS_DATA,
  APP_STATE
};
