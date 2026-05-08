/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Fragment } from 'react';
import { 
  Home, 
  PlusCircle, 
  Settings, 
  Copy, 
  FolderOpen, 
  Smartphone,
  Search, 
  MapPin,
  Lock,
  Map as MapIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  LogOut,
  Moon,
  Sun,
  User,
  ShieldCheck,
  Zap,
  Database,
  MessageSquare,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface AppInstance {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  version: string;
  size: string;
  isClone: boolean;
  status: 'active' | 'suspended' | 'cloning';
  lastUsed?: string;
  cloneCount?: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}

// --- Mock Data ---
const MOCK_APPS: AppInstance[] = [
  { id: 'we2012', name: 'Winning Eleven 2012', packageName: 'kr.konami.we2012', icon: '⚽', version: '1.0.1', size: '156MB', isClone: false, status: 'active', cloneCount: 0 },
  { id: '1', name: 'WhatsApp', packageName: 'com.whatsapp', icon: '🟢', version: '2.23.1', size: '42MB', isClone: false, status: 'active', cloneCount: 2 },
  { id: '2', name: 'Telegram', packageName: 'org.telegram.messenger', icon: '🔵', version: '9.5.3', size: '68MB', isClone: false, status: 'active', cloneCount: 1 },
  { id: '3', name: 'Instagram', packageName: 'com.instagram.android', icon: '📸', version: '272.0', size: '54MB', isClone: false, status: 'active', cloneCount: 0 },
  { id: '4', name: 'Facebook', packageName: 'com.facebook.katana', icon: '📘', version: '405.0', size: '89MB', isClone: false, status: 'active', cloneCount: 0 },
  { id: '5', name: 'TikTok', packageName: 'com.zhiliaoapp.musically', icon: '🎵', version: '28.1.3', size: '112MB', isClone: false, status: 'active', cloneCount: 0 },
];

const MOCK_CLONES: AppInstance[] = [
  { id: 'c1', name: 'WhatsApp Work', packageName: 'com.whatsapp.clone.1', icon: '🟢', version: '2.23.1', size: '42MB', isClone: true, status: 'active', lastUsed: '2 mins ago' },
  { id: 'c2', name: 'WhatsApp Private', packageName: 'com.whatsapp.clone.2', icon: '🟢', version: '2.23.1', size: '42MB', isClone: true, status: 'active', lastUsed: '1 hour ago' },
  { id: 'c3', name: 'Telegram Stealth', packageName: 'org.telegram.clone.1', icon: '🔵', version: '9.5.3', size: '68MB', isClone: true, status: 'suspended', lastUsed: 'Yesterday' },
];

// --- Translations ---
const translations: any = {
  en: {
    home: "Home",
    cloner: "Cloner",
    root: "Root",
    browser: "Browser",
    settings: "Settings",
    premium_required: "Premium Required",
    virtual_gps: "Virtual GPS",
    gps_desc: "Mock coordinates for all apps",
    admin_panel: "Control Center",
    grant_premium: "Grant Premium",
    grant_admin: "Grant Admin",
    support_link: "Support Link",
    language: "Language",
    theme: "Dark Mode",
    spoof_active: "GPS SPOOF ACTIVE: LOCKED",
    select_location: "Select Virtual Location",
    apply_fix: "APPLY GPS FIX",
    search_placeholder: "Search city or location...",
    premium_members_only: "Premium members only",
    grant_btn: "GRANT",
    save_btn: "SAVE",
    active: "ACTIVE",
    ready: "READY",
    admin: "Admin Tools",
    apps_count: "3 Apps Cloned",
    add: "Add",
    back: "Back",
    apply_gps: "APPLY GPS FIX",
    root_engine: "Root & Privilege Engine",
    virtual_root: "Virtual Root",
    root_desc: "SuperUser emulation for clones",
    magisk_hide: "Magisk Hide",
    magisk_desc: "Bypass root detection systems",
    preferences: "System Preferences",
    storage_isolation: "Storage Isolation",
    storage_desc: "Redirecting /Android/obb and /data paths",
    file_mapping: "Virtual File Mapping",
    active_mounts: "Active Virtual Mounts",
    path_redirect: "Redirected to .virtualo",
    clear_cache: "Clear Virtual Cache",
    premium_functions: "Premium Functions",
    manage_premium: "Manage Premium Users",
    manage_admins: "Manage Admin Cluster",
    user_list: "Authorized Users",
    no_users: "No users in this segment",
    delete_confirm: "Are you sure?",
    contact_support_premium: "Contact support to activate premium features",
    factory_reset: "Factory Reset",
    reset_desc: "Wipe all clones and system data",
    reset_confirm: "CRITICAL: This will delete ALL cloned apps and settings. Proceed?",
    delete_clone: "Delete Clone",
    gps_active: "Location Spoofing Active",
    root_active: "Root Privileges Active"
  },
  uz: {
    home: "Asosiy",
    cloner: "Kloner",
    root: "Root",
    browser: "Brauzer",
    settings: "Sozlamalar",
    premium_required: "Premium kerak",
    virtual_gps: "Virtual GPS",
    gps_desc: "Barcha ilovalar uchun soxta koordinatalar",
    admin_panel: "Boshqaruv paneli",
    grant_premium: "Premium berish",
    grant_admin: "Admin berish",
    support_link: "Support kanali",
    language: "Til",
    theme: "Tungi rejim",
    spoof_active: "GPS SPOOF FAOL: QULFLANDI",
    select_location: "Virtual joylashuvni tanlang",
    apply_fix: "GPS FIXNI QO'LLASH",
    search_placeholder: "Shahar yoki manzilni qidiring...",
    premium_members_only: "Faqat premium a'zolar uchun",
    grant_btn: "BERISH",
    save_btn: "SAQLASH",
    active: "FAOL",
    ready: "TAYYOR",
    admin: "Admin Asboblar",
    apps_count: "3 ta ilova klonlandi",
    add: "Qo'shish",
    back: "Orqaga",
    apply_gps: "GPS FIXNI QO'LLASH",
    root_engine: "Root va Imtiyozlar Dvigateli",
    virtual_root: "Virtual Root",
    root_desc: "Klonlar uchun SuperUser emulyatsiyasi",
    magisk_hide: "Magisk Hide",
    magisk_desc: "Root aniqlash tizimlaridan o'tish",
    preferences: "Tizim sozlamalari",
    storage_isolation: "Xotira Izolyatsiyasi",
    storage_desc: "/Android/obb va /data yo'llarini yo'naltirish",
    file_mapping: "Fayl Tizimi Xaritasi",
    active_mounts: "Faol Virtual Bog'lanishlar",
    path_redirect: ".virtualo ichiga yo'naltirildi",
    clear_cache: "Virtual Keshlarni Tozalash",
    premium_functions: "Premium Funksiyalar",
    manage_premium: "Premium Foydalanuvchilar",
    manage_admins: "Adminlar Boshqaruvi",
    user_list: "Ruxsat etilganlar",
    no_users: "Ushbu bo'limda foydalanuvchilar yo'q",
    delete_confirm: "Ishonchingiz komilmi?",
    contact_support_premium: "Premium funksiyalarni yoqish uchun supportga murojaat qiling",
    factory_reset: "Zavod sozlamalariga qaytarish",
    reset_desc: "Barcha klonlar va tizim ma'lumotlarini o'chirish",
    reset_confirm: "MUHIM: Bu barcha klonlangan ilovalar va sozlamalarni o'chiradi. Davom etasizmi?",
    delete_clone: "Klonni o'chirish",
    gps_active: "GPS Spoofing Yoqilgan",
    root_active: "Root Imtiyozlari Yoqilgan"
  },
  ru: {
    home: "Главная",
    cloner: "Клонер",
    root: "Root",
    browser: "Браузер",
    settings: "Настройки",
    premium_required: "Нужен Premium",
    virtual_gps: "Виртуальный GPS",
    gps_desc: "Настройка координат для всех приложений",
    admin_panel: "Панель управления",
    grant_premium: "Дать Premium",
    grant_admin: "Дать Админ",
    support_link: "Ссылка на поддержку",
    language: "Язык",
    theme: "Темная тема",
    spoof_active: "GPS SPOOF АКТИВЕН: ЗАБЛОКИРОВАН",
    select_location: "Выберите локацию",
    apply_fix: "ПРИМЕНИТЬ GPS FIX",
    search_placeholder: "Поиск города или места...",
    premium_members_only: "Только для Premium пользователей",
    grant_btn: "ДАТЬ",
    save_btn: "СОХРАНИТЬ",
    active: "АКТИВНО",
    ready: "ГОТОВО",
    admin: "Админ Инструменты",
    apps_count: "3 Приложения клонировано",
    add: "Добавить",
    back: "Назад",
    apply_gps: "ПРИМЕНИТЬ GPS FIX",
    root_engine: "Root и Привилегии",
    virtual_root: "Виртуальный Root",
    root_desc: "Эмуляция SuperUser для клонов",
    magisk_hide: "Magisk Hide",
    magisk_desc: "Обход систем обнаружения Root",
    preferences: "Системные настройки",
    storage_isolation: "Изоляция Памяти",
    storage_desc: "Перенаправление /Android/obb и /data",
    file_mapping: "Карта Файловой Системы",
    active_mounts: "Активные Виртуальные Пути",
    path_redirect: "Перенаправлено в .virtualo",
    clear_cache: "Очистить Виртуальный Кэш",
    premium_functions: "Premium Функции",
    manage_premium: "Premium Пользователи",
    manage_admins: "Управление Админами",
    user_list: "Список Пользователей",
    no_users: "Нет пользователей в этом разделе",
    delete_confirm: "Вы уверены?",
    contact_support_premium: "Свяжитесь с поддержкой для активации Premium функций",
    factory_reset: "Сброс данных",
    reset_desc: "Удалить все клоны и системные данные",
    reset_confirm: "КРИТИЧНО: Это удалит ВСЕ клонированные приложения и настройки. Продолжить?",
    delete_clone: "Удалить клон",
    gps_active: "Location Spoofing Активен",
    root_active: "Root Привилегии Активны"
  }
};

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'add' | 'settings' | 'premium' | 'admin'>('home');
  const [addSubTab, setAddSubTab] = useState<'installed' | 'folders'>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppInstance | null>(null);
  const [cloningProgress, setCloningProgress] = useState(0);

  // Theme persistence: Default to Day (false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('virtualo_theme');
    return saved ? JSON.parse(saved) : false; 
  });

  const [isRootActive, setIsRootActive] = useState(() => {
    return localStorage.getItem('virtualo_root_active') === 'true';
  });

  const [isGpsActive, setIsGpsActive] = useState(() => {
    return localStorage.getItem('virtualo_gps_active') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('virtualo_root_active', String(isRootActive));
  }, [isRootActive]);

  useEffect(() => {
    localStorage.setItem('virtualo_gps_active', String(isGpsActive));
  }, [isGpsActive]);

  const deleteClone = (id: string) => {
    if (confirm(t.delete_confirm)) {
      setClonedApps(prev => prev.filter(app => app.id !== id));
    }
  };

  const factoryReset = () => {
    if (confirm(t.reset_confirm)) {
      setClonedApps([]);
      setIsRootActive(false);
      setIsGpsActive(false);
      setVirtualLocation(null);
      setPremiumUsers(["sanjarbekorinboyev7@gmail.com"]);
      setAdmins(["sanjarbekorinboyev7@gmail.com"]);
      setSupportLink("https://t.me/virtualo_support");

      localStorage.removeItem('virtualo_clones');
      localStorage.removeItem('virtualo_root_active');
      localStorage.removeItem('virtualo_gps_active');
      localStorage.removeItem('virtualo_location');
      localStorage.removeItem('virtualo_premium');
      localStorage.removeItem('virtualo_admins');
      localStorage.removeItem('virtualo_support');
      alert("System Wiped Successfully.");
    }
  };

  // Admin, Premium and Support persistence
  const [language, setLanguage] = useState<'en' | 'uz' | 'ru'>(() => {
    return (localStorage.getItem('virtualo_lang') as any) || 'en';
  });

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('virtualo_lang', language);
  }, [language]);

  const [admins, setAdmins] = useState<string[]>(() => {
    const saved = localStorage.getItem('virtualo_admins');
    return saved ? JSON.parse(saved) : ["sanjarbekorinboyev7@gmail.com"];
  });
  const [premiumUsers, setPremiumUsers] = useState<string[]>(() => {
    const saved = localStorage.getItem('virtualo_premium');
    return saved ? JSON.parse(saved) : ["sanjarbekorinboyev7@gmail.com"];
  });
  const [supportLink, setSupportLink] = useState(() => {
    return localStorage.getItem('virtualo_support') || "https://t.me/virtualo_support";
  });

  const [virtualLocation, setVirtualLocation] = useState(() => {
    const saved = localStorage.getItem('virtualo_gps');
    return saved ? JSON.parse(saved) : { lat: 41.2995, lng: 69.2401, name: "Tashkent, Uzbekistan" };
  });

  const [user, setUser] = useState<UserProfile>({
    name: "Sanjarbek Orinboyev",
    email: "sanjarbekorinboyev7@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjar",
    isLoggedIn: true
  });

  const [clonedApps, setClonedApps] = useState<AppInstance[]>(() => {
    const saved = localStorage.getItem('virtualo_clones');
    return saved ? JSON.parse(saved) : MOCK_CLONES;
  });

  useEffect(() => {
    localStorage.setItem('virtualo_clones', JSON.stringify(clonedApps));
  }, [clonedApps]);

  const [showMapView, setShowMapView] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  const isAdmin = user.isLoggedIn && admins.includes(user.email);
  const isPremium = user.isLoggedIn && (premiumUsers.includes(user.email) || admins.includes(user.email));

  useEffect(() => {
    localStorage.setItem('virtualo_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('virtualo_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('virtualo_premium', JSON.stringify(premiumUsers));
  }, [premiumUsers]);

  useEffect(() => {
    localStorage.setItem('virtualo_support', supportLink);
  }, [supportLink]);

  useEffect(() => {
    localStorage.setItem('virtualo_gps', JSON.stringify(virtualLocation));
  }, [virtualLocation]);

  useEffect(() => {
    // Initializing simulation
    const timeout = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen bg-surface-900 flex flex-col items-center justify-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-brand/10 border border-brand/40 flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(0,255,65,0.2)]"
        >
          <Zap size={32} className="text-brand" />
        </motion.div>
        
        <div className="text-center font-mono space-y-2">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-brand text-xs tracking-widest uppercase font-bold"
          >
            VIRTUALO LOADING...
          </motion.p>
          <div className="w-48 h-0.5 bg-surface-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleClone = (app: AppInstance) => {
    setSelectedApp(app);
    setIsCloning(true);
    setCloningProgress(0);
    
    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setCloningProgress((step / steps) * 100);
      if (step >= steps) {
        clearInterval(timer);
        
        // Add to cloned apps
        const newClone: AppInstance = {
          ...app,
          id: `clone-${Date.now()}`,
          name: `${app.name} Clone`,
          isClone: true,
          status: 'active',
          lastUsed: 'Just now'
        };
        setClonedApps(prev => [newClone, ...prev]);

        setTimeout(() => {
          setIsCloning(false);
          setSelectedApp(null);
          setActiveTab('home');
        }, 500);
      }
    }, interval);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans ${isDarkMode ? 'bg-surface-900 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-20 ${isDarkMode ? 'bg-surface-800/80 border-border' : 'bg-white border-gray-200'} backdrop-blur-md`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isDarkMode ? 'bg-brand/10 border border-brand/40' : 'bg-brand/20 border border-brand text-black'}`}>
            <Zap size={18} className={isDarkMode ? 'text-brand' : 'text-brand-dark'} />
          </div>
          <span className={`font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            VIRTUAL<span className="text-brand">O</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Header Actions Removed */}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 space-y-6"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.home}</h2>
                  <p className="text-sm opacity-60">Manage your active virtual clones.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clonedApps.map((clone) => (
                  <div 
                    key={clone.id} 
                    className={`p-4 border rounded-2xl transition-all group relative ${isDarkMode ? 'bg-surface-800 border-border hover:border-brand/30' : 'bg-white border-gray-200 hover:border-brand'}`}
                  >
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         deleteClone(clone.id);
                       }}
                       className="absolute top-2 right-2 p-2 text-red-500/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDarkMode ? 'bg-surface-700 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                          {clone.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{clone.name}</h4>
                          <p className="text-[10px] font-mono opacity-50">{clone.packageName}</p>
                        </div>
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${clone.status === 'active' ? 'bg-brand/20 text-brand' : 'bg-red-500/10 text-red-500'}`}>
                        {clone.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] opacity-60">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{clone.lastUsed}</span>
                      </div>
                      <button className="text-brand font-bold hover:underline">LAUNCH ENGINE</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-gray-100 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-brand" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Kernel Isolation</span>
                    <span className="text-brand font-mono">ENCRYPTED</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Storage Proxy</span>
                    <span className="text-brand font-mono">SANDBOXED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div 
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.add}</h2>
                <p className="text-xs opacity-60 mx-auto max-w-[280px]">Select source to stage application into the virtual workspace.</p>
              </div>

              {/* Subtabs */}
              <div className={`flex p-1 rounded-xl mx-auto max-w-[320px] ${isDarkMode ? 'bg-surface-800' : 'bg-gray-200'}`}>
                <button 
                  onClick={() => setAddSubTab('installed')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${addSubTab === 'installed' ? (isDarkMode ? 'bg-surface-700 text-white border border-white/5 shadow-lg' : 'bg-white text-gray-900 shadow-sm') : 'opacity-50'}`}
                >
                  <Smartphone size={14} />
                  Installed Apps
                </button>
                <button 
                  onClick={() => setAddSubTab('folders')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${addSubTab === 'folders' ? (isDarkMode ? 'bg-surface-700 text-white border border-white/5 shadow-lg' : 'bg-white text-gray-900 shadow-sm') : 'opacity-50'}`}
                >
                  <FolderOpen size={14} />
                  From Folders
                </button>
              </div>

              <div className="space-y-4">
                {addSubTab === 'installed' ? (
                  <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-surface-800 border-border divide-border' : 'bg-white border-gray-200 divide-gray-100 shadow-sm'}`}>
                    <div className="p-4 relative">
                      <Search className="absolute left-7 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search system apps..." 
                        className={`w-full text-sm pl-10 pr-4 py-2 rounded-lg focus:outline-none ${isDarkMode ? 'bg-surface-700' : 'bg-gray-50 border border-gray-100'}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {MOCK_APPS.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase())).map((app) => (
                      <div 
                        key={app.id} 
                        className={`flex items-center justify-between p-4 cursor-pointer active:scale-[0.98] transition-transform ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                        onClick={() => handleClone(app)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${isDarkMode ? 'bg-surface-700' : 'bg-gray-50 border border-gray-100'}`}>
                            {app.icon}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.name}</p>
                            <p className="text-[10px] font-mono opacity-50">{app.version} • {app.size}</p>
                          </div>
                        </div>
                        <PlusCircle size={20} className="text-brand opacity-60" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`border-2 border-dashed rounded-3xl p-12 text-center space-y-4 ${isDarkMode ? 'bg-surface-800/50 border-border' : 'bg-gray-50 border-gray-300'}`}>
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-surface-700' : 'bg-white'}`}>
                        <FolderOpen className="text-brand" size={24} />
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select APK File</p>
                        <p className="text-xs opacity-50 mt-1">Files will be cloned into the virtual container.</p>
                      </div>
                      <button className="bg-brand text-black font-bold px-6 py-2 rounded-xl active:scale-95 transition-transform">BROWSE STORAGE</button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                       <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-center">Recent Selections</p>
                       <div className="text-center text-xs opacity-30 py-4 italic">No recent APK files found.</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-6 space-y-8"
            >
              {/* Profile Card */}
              <div className={`p-6 rounded-3xl border text-center space-y-4 relative overflow-hidden ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-md'}`}>
                 {user.isLoggedIn ? (
                   <>
                    <div className="relative inline-block">
                      <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl mx-auto border-2 border-brand/20 p-1" />
                      <div className="absolute -bottom-1 -right-1 bg-brand text-black rounded-full p-1 border-2 border-surface-800">
                        <CheckCircle2 size={12} />
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                      <p className="text-xs opacity-50 font-mono tracking-tight">{user.email}</p>
                    </div>
                    <button className="flex items-center gap-2 mx-auto text-[11px] font-bold py-1.5 px-4 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                      <LogOut size={14} /> SIGN OUT
                    </button>
                   </>
                 ) : (
                   <div className="py-4 space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-surface-700' : 'bg-gray-100'}`}>
                        <User className="opacity-30" size={24} />
                      </div>
                      <h3 className="font-bold">Not Logged In</h3>
                      <button className="w-full bg-brand text-black font-bold py-2.5 rounded-xl">LOGIN WITH GOOGLE</button>
                   </div>
                 )}
              </div>

              {/* Navigation Hub */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-2">System Access</p>
                <div className="grid grid-cols-1 gap-3">
                   <button 
                     onClick={() => setActiveTab('premium')}
                     className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-surface-800 border-border hover:bg-surface-700' : 'bg-white border-gray-100 shadow-sm hover:bg-gray-50'}`}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                         <Zap size={20} />
                       </div>
                       <div className="text-left">
                         <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.premium_functions}</p>
                         <p className="text-[10px] opacity-50">GPS, Root & Virtual storage</p>
                       </div>
                     </div>
                     <ArrowRight size={16} className="opacity-30" />
                   </button>

                   {isAdmin && (
                    <button 
                      onClick={() => setActiveTab('admin')}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-surface-800 border-brand/20 hover:bg-surface-700' : 'bg-white border-brand shadow-sm hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                          <ShieldCheck size={20} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.admin_panel}</p>
                          <p className="text-[10px] opacity-50 uppercase">Security & User Ops</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-brand opacity-60" />
                    </button>
                   )}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-2">{t.preferences}</p>
                <div className={`divide-y rounded-2xl border ${isDarkMode ? 'bg-surface-800 border-border divide-border' : 'bg-white border-gray-200 divide-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-surface-700' : 'bg-gray-50'}`}>
                        <span className="text-brand font-bold text-xs">🌐</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.language}</p>
                        <p className="text-[10px] opacity-50">{language === 'uz' ? 'O\'zbek tili' : language === 'ru' ? 'Русский язык' : 'English language'}</p>
                      </div>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className={`text-xs p-1 focus:outline-none rounded border ${isDarkMode ? 'bg-surface-700 border-border text-white' : 'bg-white border-gray-200'}`}
                    >
                      <option value="en">English</option>
                      <option value="uz">O'zbekcha</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-surface-700' : 'bg-gray-50'}`}>
                        {isDarkMode ? <Moon size={18} className="text-brand" /> : <Sun size={18} className="text-brand-dark" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.theme}</p>
                        <p className="text-[10px] opacity-50">{isDarkMode ? 'Night vision active' : 'Daylight mode active'}</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${isDarkMode ? 'bg-brand' : 'bg-gray-300'}`}
                    >
                      <motion.div 
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: isDarkMode ? 20 : 0 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-2">System Info</p>
                <button 
                  onClick={() => window.open(supportLink, '_blank')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-200 shadow-sm'}`}
                >
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand/10 text-brand">
                        <MessageSquare size={18} />
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Official Support</p>
                        <p className="text-[10px] opacity-50 truncate max-w-[150px]">{supportLink}</p>
                      </div>
                   </div>
                   <div className="bg-brand text-black font-bold text-[9px] px-2 py-1 rounded">OPEN</div>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div 
              key="premium-page"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-8 min-h-full relative"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setActiveTab('settings')} className="p-2 -ml-2 text-brand">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-bold tracking-tight">{t.premium_functions}</h2>
                <div className="w-10" />
              </div>

              <div className={`space-y-8 transition-all ${!isPremium ? 'blur-sm grayscale opacity-30 pointer-events-none' : ''}`}>
                {/* Virtual GPS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-2">
                     <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{t.virtual_gps}</p>
                     <div 
                        onClick={() => isPremium && setIsGpsActive(!isGpsActive)}
                        className={`w-10 h-5 rounded-full transition-colors p-1 cursor-pointer ${isGpsActive ? 'bg-brand' : (isDarkMode ? 'bg-surface-700' : 'bg-gray-200')}`}
                      >
                         <motion.div 
                           className="w-3 h-3 bg-white rounded-full"
                           animate={{ x: isGpsActive ? 20 : 0 }}
                         />
                      </div>
                  </div>
                  <div 
                     onClick={() => setShowMapView(true)}
                     className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer hover:border-brand/30 ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isGpsActive ? 'bg-brand/20 text-brand' : 'bg-surface-700/50 opacity-40 text-gray-500'}`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{t.virtual_gps}</p>
                        <p className="text-[10px] opacity-50">
                          {isGpsActive ? (virtualLocation ? virtualLocation.name : 'Configuring...') : 'System Disabled'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold uppercase ${isGpsActive ? 'text-brand' : 'opacity-30'}`}>{isGpsActive ? t.ready : 'OFF'}</div>
                  </div>
                </div>

                {/* Root Engine */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-2">
                    <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{t.root_engine}</p>
                    <div 
                        onClick={() => isPremium && setIsRootActive(!isRootActive)}
                        className={`w-10 h-5 rounded-full transition-colors p-1 cursor-pointer ${isRootActive ? 'bg-brand' : (isDarkMode ? 'bg-surface-700' : 'bg-gray-200')}`}
                      >
                         <motion.div 
                           className="w-3 h-3 bg-white rounded-full"
                           animate={{ x: isRootActive ? 20 : 0 }}
                         />
                      </div>
                  </div>
                  <div className={`divide-y rounded-2xl border ${isDarkMode ? 'bg-surface-800 border-border divide-border' : 'bg-white border-gray-200 divide-gray-100 shadow-sm'}`}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isRootActive ? 'bg-brand/10 text-brand' : 'bg-surface-700/50 text-gray-500'}`}>
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t.virtual_root}</p>
                          <p className="text-[10px] opacity-60">{t.root_desc}</p>
                        </div>
                      </div>
                      <div className={`text-[8px] font-bold uppercase transition-colors ${isRootActive ? 'text-brand' : 'opacity-20'}`}>
                        {isRootActive ? 'ENABLED' : 'DISABLED'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isRootActive ? 'bg-brand/10 text-brand' : 'bg-surface-700/50 text-gray-500'}`}>
                          <Zap size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t.magisk_hide}</p>
                          <p className="text-[10px] opacity-60">{t.magisk_desc}</p>
                        </div>
                      </div>
                      <div className={`text-[8px] font-bold uppercase transition-colors ${isRootActive ? 'text-brand' : 'opacity-20'}`}>
                        {isRootActive ? 'ACTIVE' : 'OFF'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Isolation - Visible to All */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-2">System Isolation</p>
                <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-sm'}`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                         <Database size={16} className="text-brand" />
                         <span className="text-sm font-bold">{t.storage_isolation}</span>
                      </div>
                      <div className="text-[9px] bg-brand/20 text-brand px-2 py-0.5 rounded-full font-bold">READY</div>
                   </div>
                   <div className="space-y-3">
                      {['Android/obb', 'Android/data'].map((p, i) => (
                         <div key={i} className={`p-3 rounded-2xl border text-[10px] font-mono ${isDarkMode ? 'bg-black/20 border-white/5 text-gray-400' : 'bg-gray-50'}`}>
                            <p className="opacity-40 mb-1">MAPPED_PATH:</p>
                            <p className="text-brand break-all">/storage/emulated/0/{p} <br/>→ /.virtualo/{p}</p>
                         </div>
                      ))}
                   </div>
                </div>
              </div>

              {!isPremium && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-transparent backdrop-blur-[2px]">
                   <div className="bg-surface-900/90 border border-brand/20 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-4 max-w-[280px]">
                     <div className="w-16 h-16 rounded-3xl bg-brand/10 flex items-center justify-center text-brand mx-auto mb-2 animate-pulse">
                        <Lock size={32} />
                     </div>
                     <p className="text-sm font-bold leading-tight text-white">{t.contact_support_premium}</p>
                     <button 
                       onClick={() => window.open(supportLink, '_blank')}
                       className="w-full bg-brand text-black font-bold px-6 py-3 rounded-2xl text-xs shadow-xl shadow-brand/20 active:scale-95 transition-all"
                     >
                       GET PREMIUM ACCESS
                     </button>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div 
              key="admin-page"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-8"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setActiveTab('settings')} className="p-2 -ml-2 text-brand">
                  <ArrowLeft size={24} />
                </button>
                <div className="text-center">
                  <h2 className="text-lg font-bold tracking-tight">{t.admin_panel}</h2>
                  <p className="text-[9px] uppercase tracking-widest text-brand opacity-60 font-bold">System Overlord</p>
                </div>
                <div className="w-10" />
              </div>

              {/* Support Link Entry */}
              <div className="space-y-4">
                 <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <label className="text-[10px] uppercase font-bold tracking-wider opacity-60 block mb-3">{t.support_link}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={supportLink}
                        onChange={(e) => setSupportLink(e.target.value)}
                        className={`flex-1 text-sm pl-4 py-3 rounded-2xl focus:outline-none border transition-all ${isDarkMode ? 'bg-surface-900 border-white/5 focus:border-brand/40 text-white' : 'bg-gray-50 border-gray-200'}`}
                        placeholder="https://t.me/..."
                      />
                      <button className="bg-brand text-black font-bold px-4 rounded-2xl text-[10px] shadow-lg shadow-brand/20">SAVE</button>
                    </div>
                 </div>
              </div>

              {/* User Management Lists */}
              <div className="space-y-6">
                {/* Premium Users */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-2">
                    <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{t.manage_premium}</p>
                    <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">{premiumUsers.length}</span>
                  </div>
                  
                  <div className={`p-4 rounded-3xl border space-y-3 ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex gap-2 mb-2">
                       <input 
                         id="add-prem"
                         type="email" 
                         placeholder="user@gmail.com"
                         className={`flex-1 text-xs px-4 py-2.5 rounded-xl border focus:outline-none ${isDarkMode ? 'bg-surface-900 border-border' : 'bg-gray-50 border-gray-200'}`}
                       />
                       <button 
                         onClick={() => {
                           const el = document.getElementById('add-prem') as HTMLInputElement;
                           if (el.value && !premiumUsers.includes(el.value)) {
                             setPremiumUsers([...premiumUsers, el.value]);
                             el.value = '';
                           }
                         }}
                         className="bg-brand text-black font-bold px-4 rounded-xl text-[10px]"
                       >
                         GRANT
                       </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {premiumUsers.length === 0 ? (
                        <p className="text-[10px] opacity-30 text-center py-4 italic">{t.no_users}</p>
                      ) : premiumUsers.map((email) => (
                        <div key={email} className={`flex items-center justify-between p-3 rounded-2xl ${isDarkMode ? 'bg-surface-900/50' : 'bg-gray-50'}`}>
                           <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_5px_brand]" />
                              <span className="text-xs font-mono truncate">{email}</span>
                           </div>
                           <button 
                             onClick={() => {
                               if (confirm(t.delete_confirm)) {
                                 setPremiumUsers(premiumUsers.filter(u => u !== email));
                               }
                             }}
                             className="p-1.5 text-red-500/40 hover:text-red-500 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admins */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pl-2">
                    <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{t.manage_admins}</p>
                    <span className="text-[9px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold">{admins.length}</span>
                  </div>
                  
                  <div className={`p-4 rounded-3xl border space-y-3 ${isDarkMode ? 'bg-surface-800 border-border' : 'bg-white border-gray-100 shadow-sm'}`}>
                    {/* ... admin input ... */}
                    <div className="flex gap-2 mb-2">
                       <input 
                         id="add-admin"
                         type="email" 
                         placeholder="admin@gmail.com"
                         className={`flex-1 text-xs px-4 py-2.5 rounded-xl border focus:outline-none ${isDarkMode ? 'bg-surface-900 border-border' : 'bg-gray-50 border-gray-200'}`}
                       />
                       <button 
                         onClick={() => {
                           const el = document.getElementById('add-admin') as HTMLInputElement;
                           if (el.value && !admins.includes(el.value)) {
                             setAdmins([...admins, el.value]);
                             el.value = '';
                           }
                         }}
                         className="bg-brand text-black font-bold px-4 rounded-xl text-[10px]"
                       >
                         ADD
                       </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {admins.map((email) => (
                        <div key={email} className={`flex items-center justify-between p-3 rounded-2xl ${isDarkMode ? 'bg-surface-900/50' : 'bg-gray-50'}`}>
                           <div className="flex items-center gap-2 overflow-hidden">
                              <ShieldCheck size={12} className="text-brand shrink-0" />
                              <span className="text-xs font-mono truncate">{email}</span>
                           </div>
                           <button 
                             onClick={() => {
                               if (email === user.email) {
                                 alert("Self-removal locked.");
                               } else if (confirm(t.delete_confirm)) {
                                 setAdmins(admins.filter(a => a !== email));
                               }
                             }}
                             className="p-1.5 text-red-500/40 hover:text-red-500 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dangerous Operations */}
                <div className="pt-6 border-t border-red-500/10">
                   <div className={`p-5 rounded-3xl border border-red-500/20 bg-red-500/5`}>
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
                            <Zap size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-red-500">{t.factory_reset}</p>
                            <p className="text-[10px] text-red-500/60">{t.reset_desc}</p>
                         </div>
                      </div>
                      <button 
                        onClick={factoryReset}
                        className="w-full py-3 bg-red-500 text-white font-bold rounded-2xl text-[10px] shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                      >
                         RESET ALL SYSTEM DATA
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className={`h-20 border-t flex items-center justify-around px-4 fixed bottom-0 left-0 right-0 z-30 transition-colors ${isDarkMode ? 'bg-surface-800/90 border-border' : 'bg-white/90 border-gray-200'} backdrop-blur-lg`}>
        <button 
          onClick={() => setActiveTab('home')}
          className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <Home size={activeTab === 'home' ? 24 : 20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.home}</span>
          {activeTab === 'home' && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-brand rounded-full mt-0.5" />}
        </button>

        {/* Admin Navigation Button Removed - Moved to nested buttons */}

        <button 
          onClick={() => setActiveTab('add')}
          className={`bottom-nav-item ${activeTab === 'add' ? 'active' : ''}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeTab === 'add' ? 'bg-brand text-black shadow-[0_0_15px_rgba(0,255,65,0.4)] scale-110' : 'text-gray-500'}`}>
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{t.add}</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`bottom-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={activeTab === 'settings' ? 24 : 20} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.settings}</span>
          {activeTab === 'settings' && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-brand rounded-full mt-0.5" />}
        </button>
      </nav>

      {/* Cloning Progress Overlay */}
      <AnimatePresence>
        {isCloning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-sm rounded-[2rem] p-8 border relative overflow-hidden ${isDarkMode ? 'bg-surface-800 border-brand/20 shadow-[0_0_50px_rgba(0,255,65,0.1)]' : 'bg-white border-gray-200'}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-surface-700/20">
                <motion.div 
                  className="h-full bg-brand shadow-[0_0_10px_#00ff41]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${cloningProgress}%` }}
                />
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-brand/10 border border-brand/20 rounded-2xl mx-auto flex items-center justify-center relative">
                  <div className="text-3xl">{selectedApp?.icon}</div>
                  <motion.div 
                    className="absolute inset-0 border-2 border-brand rounded-2xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                <div className="space-y-1">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {cloningProgress < 40 ? 'Analyzing Manifest...' : cloningProgress < 85 ? 'Bridging Legacy SDK...' : 'Finalizing Virtual Box...'}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs opacity-50">Target: <span className="text-white font-mono">SDK {selectedApp?.id === 'we2012' ? '4' : '23+'}</span></p>
                    {selectedApp?.id === 'we2012' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">LEGACY MODE</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between font-mono text-[9px] uppercase opacity-50">
                      <span>ByteCode Translation</span>
                      <span>{Math.round(cloningProgress)}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-surface-900' : 'bg-gray-100'}`}>
                      <motion.div 
                        className="h-full bg-brand shadow-[0_0_8px_#00ff41]"
                        initial={{ width: 0 }}
                        animate={{ width: `${cloningProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl font-mono text-[9px] text-left h-24 overflow-hidden relative ${isDarkMode ? 'bg-surface-900/50' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="space-y-1 opacity-70">
                      <p className="text-brand">{`> Reading kr.konami.we2012...`}</p>
                      <p className="text-gray-400">{`> Warning: SDK Version 4 detected`}</p>
                      <p className="text-gray-400">{`> Applying 32-bit architecture bridge...`}</p>
                      <p className="text-brand/70">{`> Injecting Virtual SU binaries...`}</p>
                      {cloningProgress > 50 && <p className="text-brand">{`> Emulating dalvik-cache for Legacy...`}</p>}
                      {cloningProgress > 80 && <p className="text-brand">{`> Signature spoofing [OK]`}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-center gap-2 text-brand font-mono text-[9px] animate-pulse">
                    <ShieldCheck size={12} />
                    VIRTUAL CONTAINER ISOLATION ACTIVE
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen GPS Map View */}
      <AnimatePresence>
        {showMapView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-hidden flex flex-col"
          >
            {/* Immersive Map Background Layer (Interactive) */}
            <div className={`absolute inset-0 z-0 overflow-hidden ${isDarkMode ? 'bg-[#0b0d0f]' : 'bg-[#f5f5f5]'}`}>
              <motion.div 
                id="map-container"
                drag
                dragMomentum={false}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                onDrag={(e, info) => {
                  // Calculate mock coordinates based on velocity or simple offset
                  // Every 100px is roughly 0.001 degrees
                  const deltaLat = info.delta.y * 0.00001 * (1/mapScale);
                  const deltaLng = info.delta.x * 0.00001 * (1/mapScale);
                  
                  setVirtualLocation(prev => ({
                    ...prev,
                    lat: prev.lat - deltaLat,
                    lng: prev.lng + deltaLng,
                    name: `Location Fix: ${prev.lat.toFixed(4)}, ${prev.lng.toFixed(4)}`
                  }));
                }}
                onClick={(e) => {
                   // Single click to teleport marker to exact spot
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const y = e.clientY - rect.top;
                   const centerX = rect.width / 2;
                   const centerY = rect.height / 2;
                   
                   const deltaLat = (centerY - y) * 0.0001 * (1/mapScale);
                   const deltaLng = (x - centerX) * 0.0001 * (1/mapScale);
                   
                   setVirtualLocation(prev => ({
                     ...prev,
                     lat: prev.lat + deltaLat,
                     lng: prev.lng + deltaLng,
                     name: `Marker: ${prev.lat.toFixed(3)}, ${prev.lng.toFixed(3)}`
                   }));
                }}
                className="absolute inset-0 w-[10000px] h-[10000px] -left-[5000px] -top-[5000px]"
                style={{ scale: mapScale }}
                onWheel={(e) => {
                   if (e.deltaY < 0) setMapScale(prev => Math.min(prev + 0.2, 8));
                   else setMapScale(prev => Math.max(prev - 0.2, 0.15));
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2) {
                    const dist = Math.hypot(
                      e.touches[0].pageX - e.touches[1].pageX,
                      e.touches[0].pageY - e.touches[1].pageY
                    );
                    if (touchStartDist === null) {
                      setTouchStartDist(dist);
                    } else {
                      const delta = dist / touchStartDist;
                      setMapScale(prev => Math.min(Math.max(prev * delta, 0.15), 8));
                      setTouchStartDist(dist);
                    }
                  }
                }}
                onTouchEnd={() => setTouchStartDist(null)}
              >
                {/* Map Geometry Simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke={isDarkMode ? "#ffffff" : "#000000"} strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Optimized Mock Roads */}
                  <g stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} strokeWidth="20" fill="none">
                     {Array.from({ length: 40 }).map((_, i) => (
                       <Fragment key={i}>
                         <line x1="0" y1={i * 250} x2="10000" y2={i * 250} />
                         <line x1={i * 250} y1="0" x2={i * 250} y2="10000" />
                       </Fragment>
                     ))}
                  </g>
                </svg>
              </motion.div>

              {/* Central Crosshair / Marker (Fixed in center) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                 <motion.div 
                   className="relative flex flex-col items-center"
                 >
                    <div className="bg-brand text-black px-3 py-1 rounded-full text-[10px] font-bold mb-2 shadow-lg shadow-brand/20 whitespace-nowrap">
                      {virtualLocation.name}
                    </div>
                    <MapPin size={48} className="text-brand filter drop-shadow-[0_0_12px_rgba(0,255,65,0.6)]" />
                    <div className="w-12 h-3 bg-black/20 blur-sm rounded-full mt-1"></div>
                 </motion.div>
              </div>
            </div>

            {/* Top Overlay: Back & Search */}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-4 pointer-events-none">
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowMapView(false)}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center pointer-events-auto shadow-2xl backdrop-blur-2xl border ${isDarkMode ? 'bg-surface-900/90 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                  >
                    <ArrowRight className="rotate-180" size={24} />
                  </button>

                  <div className={`flex-1 flex items-center h-12 rounded-2xl border pointer-events-auto shadow-2xl backdrop-blur-2xl transition-all ${isDarkMode ? 'bg-surface-900/90 border-white/10 focus-within:border-brand/40' : 'bg-white border-gray-100 focus-within:border-brand'}`}>
                    <Search className="ml-4 opacity-50" size={18} />
                    <input 
                       type="text"
                       placeholder="Search city or location..."
                       className={`w-full bg-transparent p-4 text-sm focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.toLowerCase();
                            const cities = [
                              { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
                              { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
                              { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
                              { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
                              { name: 'Tashkent, Uzbekistan', lat: 41.2995, lng: 69.2401 },
                              { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
                              { name: 'New York, USA', lat: 40.7128, lng: -74.0060 }
                            ];
                            const found = cities.find(c => c.name.toLowerCase().includes(val));
                            if (found) setVirtualLocation(found);
                            else alert("City not indexed in virtual atlas. Try: Tokyo, Tashkent, London...");
                         }
                       }}
                    />
                  </div>
               </div>
            </div>

            {/* Bottom Overlay: Location Info & Save */}
            <div className="mt-auto relative z-10 p-4 pointer-events-none">
               <motion.div 
                 initial={{ y: 40, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 className={`max-w-xs mx-auto p-4 rounded-[2rem] border pointer-events-auto shadow-2xl backdrop-blur-2xl ${isDarkMode ? 'bg-surface-900/95 border-white/10' : 'bg-white border-gray-100'}`}
               >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase tracking-widest opacity-40 mb-0.5">{t.virtual_gps}</span>
                       <span className="text-sm font-bold truncate max-w-[150px]">{virtualLocation.name}</span>
                       <span className="text-[9px] font-mono opacity-30">{virtualLocation.lat.toFixed(4)}, {virtualLocation.lng.toFixed(4)}</span>
                    </div>
                    <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-surface-800' : 'bg-gray-100'}`}>
                       <MapIcon className="text-brand" size={18} />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowMapView(false);
                      const notification = document.createElement('div');
                      notification.className = "fixed top-20 left-1/2 -translate-x-1/2 bg-brand text-black px-6 py-3 rounded-2xl font-bold z-[200] shadow-2xl animate-bounce";
                      notification.innerText = t.spoof_active;
                      document.body.appendChild(notification);
                      setTimeout(() => notification.remove(), 3000);
                    }}
                    className="w-full py-3.5 bg-brand text-black font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <CheckCircle2 size={16} />
                    {t.apply_fix}
                  </button>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,64,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

