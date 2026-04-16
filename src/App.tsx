/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  MapPin, User, Briefcase, Wrench, Grid, BookOpen, Heart, 
  ChevronDown, X, GraduationCap, Layers, Package, Lightbulb,
  LayoutGrid, Box, PenTool, Search, Palette, Cpu, ClipboardList, Hammer,
  BrainCircuit, Archive, Dumbbell, Timer, Mountain, Target, Trophy,
  TrendingUp, Users, Flag, ArrowRight, Calendar, Check,
  Plus, Trash2, Edit2, Star, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper function to handle image paths correctly in both dev and prod
const getImageUrl = (path: string) => {
  if (!path) return '';
  // If the path starts with /images, it's a public asset. 
  // In Vite, public assets are served from the root in production.
  // We use the absolute path to ensure it works regardless of routing.
  return path;
};

const CATS = {
  all: { label: '全部', icon: LayoutGrid },
  packaging: { label: '包裝設計', icon: Package },
  product: { label: '產品設計', icon: Box },
  graphic: { label: '平面設計', icon: PenTool }
};

const INITIAL_SKILLS = [
  { 
    id: 1,
    title: '市場調研與定位分析', 
    icon: 'Search', 
    desc: '擅長設計前期的競品蒐集並針對該品牌定位分析，總結設計規畫方向。', 
    subSkills: ['競品分析', '產品策略', '產品定位', '市場調查資料分析', '報告撰寫與提案'],
    tags: ['Market Research', 'Strategy'],
    level: 5
  },
  { 
    id: 2,
    title: '2D 品牌視覺整合與簡報提案', 
    icon: 'Palette', 
    desc: '擅長整合包裝結構與品牌識別，製作具專業感與說服力的提案簡報。', 
    subSkills: ['Adobe InDesign', 'Illustrator', 'Photoshop', '電腦排版設計', '設計印刷基本認知', '電腦印前設計'],
    tags: ['Graphic Design', 'Branding'],
    level: 4
  },
  { 
    id: 3,
    title: '3D 建模與結構模擬', 
    icon: 'Cpu', 
    desc: '能快速建構產品結構模型並進行裝配模擬，支援從設計構想至工程的溝通。', 
    subSkills: ['Creo', 'SolidWorks', 'Rhino', 'Keyshot', '產品結構評估', '3D 渲染'],
    tags: ['3D Modeling', 'Engineering'],
    level: 5
  },
  { 
    id: 4,
    title: '包裝材料選用與 BOM 建立', 
    icon: 'ClipboardList', 
    desc: '熟悉泡殼、瓦楞紙卡、紙托等常用包材特性，依需求提出優化方案。', 
    subSkills: ['瓦楞紙結構', '包裝材料選用', '工程圖繪製', 'BOM 建立'],
    tags: ['Packaging', 'BOM'],
    level: 4
  },
  { 
    id: 5,
    title: '打樣實作與設計驗證能力', 
    icon: 'Hammer', 
    desc: '善用割樣機進行結構模擬與快速打樣，快速驗證設計可行性。', 
    subSkills: ['打樣機操作', '結構模擬', '快速打樣', '設計驗證', 'CMF 樣板製作'],
    tags: ['Prototyping', 'Validation'],
    level: 5
  }
];

const PROJECTS = [
  {id:'hood',cat:'product',subcat:'appliance',title:'油煙機設計',short:'薄化歐化油煙機、近吸油煙機系列',desc:'為 SAKURA 品牌設計薄化歐化油煙機（2020）及近吸油煙機（2022）、歐化油煙機（2021）系列。涵蓋外觀造型、CMF 規格、結構工程圖及量產驗證，兼顧空氣動力學效能與現代廚房美學。',tags:['產品設計','廚房家電','SAKURA'], images: ['/images/hood_euro01.jpg', '/images/hood_euro02.jpg', '/images/hood_side_suction.jpg']},
  {id:'gas',cat:'product',subcat:'appliance',title:'瓦斯爐設計',short:'嵌入式瓦斯爐工業設計',desc:'嵌入式瓦斯爐工業設計，強調人因操作介面與安全結構整合，完成旋鈕、爐架與玻璃面板之 CMF 規格輸出。',tags:['產品設計','家電'], images: ['/images/stove_easy_clean.jpg']},
  {id:'wearable',cat:'product',subcat:'medical',title:'穿戴式裝置設計',short:'睡眠監測智慧手環',desc:'睡眠監測智慧手環設計，整合感測模組與舒適穿戴結構，完成 CMF 規格及爆炸圖輸出。',tags:['穿戴裝置','醫療'], images: ['/images/wearable01.jpg', '/images/wearable02.jpg', '/images/wearable03.jpg', '/images/wearable04.jpg']},
  {id:'medical',cat:'product',subcat:'medical',title:'醫療器材設計',short:'低頻治療儀 / 霧化器 / SPO2 手環',desc:'包含低周波治療器 2 款外觀提案、兒童用霧化器外觀提案及 SPO2 手環 5 款外觀提案，完成外觀造型、爆炸圖與量產工程規格文件。',tags:['醫療器材','工業設計'], images: ['/images/medical02.jpg']},
  {id:'toy',cat:'product',subcat:'toy',title:'玩具設計',short:'兒童益智玩具系列',desc:'兒童益智玩具系列設計，包含角色造型、結構拼組與安全材質規劃。',tags:['玩具設計','CMF'], images: ['/images/toy_design.jpg']},
  {id:'sketch',cat:'product',subcat:'sketch',title:'手繪作品',short:'人物速寫 / 產品草圖 / 概念插畫',desc:'人物速寫、產品草圖與概念插畫，展現設計思維與手感表達能力。',tags:['手繪','插畫'], images: ['/images/sketch.jpg']},
  {id:'tws_card',cat:'packaging',subcat:'ce',title:'TWS 紙卡內襯設計',short:'TWS 耳機紙卡內襯方案總覽',desc:'針對 TWS 耳機系列開發紙卡內襯，彙整多種結構選項，形成模組化設計資料庫。',tags:['包裝設計','TWS','紙卡'], images: ['/images/tws_card_inner01.png', '/images/tws_card_inner02.png', '/images/tws_card_inner03.png', '/images/tws_card_inner04.png', '/images/tws_card_inner05.png', '/images/tws_card_inner06.png', '/images/tws_card_inner07.png', '/images/tws_card_inner08.png', '/images/tws_card_inner09.png', '/images/tws_card_inner10.png', '/images/tws_card_inner11.png', '/images/tws_card_inner12.png']},
  {id:'tws_pkg',cat:'packaging',subcat:'ce',title:'TWS 包裝設計',short:'TWS 耳機完整包裝設計',desc:'為國際品牌 TWS 耳機設計完整包材，包含外箱、內裝結構與印刷規格。',tags:['包裝設計','消費電子'], images: ['/images/tws_package_design01.jpg', '/images/tws_package_design02.jpg']},
  {id:'hdt_card',cat:'packaging',subcat:'ce',title:'HDT 紙卡內襯設計',short:'電競耳機包裝結構方案',desc:'HDT 電競耳機紙卡內襯設計，提出多選項比較方案，支援 RFQ 提案決策。',tags:['包裝設計','HDT'], images: ['/images/hdt_card01.jpg', '/images/hdt_card02.jpg', '/images/hdt_card03.jpg', '/images/hdt_card04.jpg', '/images/hdt_card05.jpg', '/images/hdt_card06.jpg', '/images/hdt_card07.jpg', '/images/hdt_card08.jpg', '/images/hdt_card09.jpg', '/images/hdt_card10.jpg', '/images/hdt_card11.jpg', '/images/hdt_card12.jpg', '/images/hdt_card13.jpg', '/images/hdt_card14.jpg']},
  {id:'soundbar_card',cat:'packaging',subcat:'ce',title:'Soundbar 紙卡內襯設計',short:'Soundbar 包裝內構設計',desc:'Soundbar 紙卡內襯結構設計，考量產品尺寸與跌落保護需求。',tags:['包裝設計','Soundbar'], images: ['/images/soundbar_card_inner01.png', '/images/soundbar_card_inner02.png', '/images/soundbar_card_inner03.png', '/images/soundbar_card_inner04.jpg', '/images/soundbar_card_inner05.jpg', '/images/soundbar_card_inner06.jpg', '/images/soundbar_card_inner07.jpg', '/images/soundbar_card_inner08.jpg']},
  {id:'soundbar_pkg',cat:'packaging',subcat:'ce',title:'Soundbar 設計',short:'Soundbar 整體包裝方案',desc:'Speaker Packaging Design，採用 Harvest Foam Dry-Pressed Pulp Tray，整合環保材質與品牌呈現。',tags:['包裝設計','永續','Soundbar'], images: ['/images/soundbar_design01.jpg']},
  {id:'webcam',cat:'packaging',subcat:'ce',title:'視訊鏡頭包裝設計',short:'Webcam Packaging Design',desc:'視訊鏡頭包裝設計，採 Black Wet-Pressed Pulp Tray，兼顧防護與環保需求。',tags:['包裝設計','紙托'], images: ['/images/webcam01.jpg', '/images/webcam02.jpg']},
  {id:'carrycase',cat:'packaging',subcat:'bike',title:'Carrycase 包袋設計',short:'收納包袋結構設計',desc:'自行車零件收納包袋設計，考量多 SKU 共用與模組化包裝平台。',tags:['包裝設計','自行車'], images: ['/images/carrycase01.jpg']},
  {id:'mtb',cat:'packaging',subcat:'bike',title:'MTB Handle Bar 包裝設計',short:'MTB 車把手包裝設計',desc:'MTB 車把手三層瓦楞結構包裝，考量層板方案、正面紙板與包裝底座。',tags:['包裝設計','自行車','Handle Bar'], images: ['/images/mtb_handle_bar01.jpg', '/images/mtb_handle_bar02.jpg', '/images/mtb_handle_bar03.jpg', '/images/mtb_handle_bar04.png', '/images/mtb_handle_bar05.png', '/images/mtb_handle_bar06.png']},
  {id:'tr',cat:'packaging',subcat:'bike',title:'TR Handle Bar 包裝設計',short:'TR 車把手包裝設計',desc:'TR Handle Bar 包裝結構設計，統整行李方案、正面紙板至包裝底座完整流程。',tags:['包裝設計','自行車'], images: ['/images/tr_handle_bar01.jpg', '/images/tr_handle_bar02.jpg', '/images/tr_handle_bar03.jpg', '/images/tr_handle_bar04.jpg', '/images/tr_handle_bar05.jpg', '/images/tr_handle_bar06.png', '/images/tr_handle_bar07.png', '/images/tr_handle_bar08.png']},
  {id:'ra',cat:'packaging',subcat:'bike',title:'RA Handle Bar 包裝設計',short:'RA 車把手包裝設計',desc:'RA Handle Bar 系列包裝設計，涵蓋運輸、展示與量產導入規格。',tags:['包裝設計','自行車'], images: ['/images/ra_handle_bar01.png', '/images/ra_handle_bar02.png', '/images/ra_handle_bar03.png', '/images/ra_handle_bar04.png', '/images/ra_handle_bar05.png', '/images/ra_handle_bar06.png', '/images/ra_handle_bar07.png']},
  {id:'seatpost',cat:'packaging',subcat:'bike',title:'座管 包裝設計',short:'座管包裝結構設計',desc:'自行車座管包裝結構設計，針對細長零件開發全紙質緩衝方案。',tags:['包裝設計','自行車','減塑'], images: ['/images/seatpost01.jpg', '/images/seatpost02.jpg', '/images/seatpost03.jpg', '/images/seatpost04.jpg', '/images/seatpost05.jpg', '/images/seatpost06.jpg', '/images/seatpost07.jpg', '/images/seatpost08.jpg', '/images/seatpost09.jpg']},
  {id:'steerer',cat:'packaging',subcat:'bike',title:'立管 包裝設計',short:'立管包裝結構設計',desc:'立管包裝設計，開發輕量化、可回收包材方案。',tags:['包裝設計','自行車'], images: ['/images/steerer01.jpg', '/images/steerer02.jpg', '/images/steerer03.jpg', '/images/steerer04.jpg', '/images/steerer05.jpg']},
  {id:'quickrelease',cat:'packaging',subcat:'bike',title:'快拆束仔 包裝設計',short:'快拆束仔包裝設計',desc:'快拆束仔小零件包裝設計，兼顧防護性與零售展示需求。',tags:['包裝設計','自行車'], images: ['/images/quickrelease01.jpg', '/images/quickrelease02.jpg', '/images/quickrelease03.jpg', '/images/quickrelease04.jpg']},
  {id:'graphic',cat:'graphic',subcat:'branding',title:'平面設計',short:'品牌CIS / 海報 / 識別物料',desc:'品牌視覺識別系統（CIS）、海報設計與企業識別物料整合輸出。',tags:['品牌設計','平面','CIS'], images: ['/images/poster_design.jpg']}
];

const COURSES = [
  {
    cat: 'packaging', 
    title:'包裝結構設計、運輸驗證與成本優化實務課程',
    sub:'',
    org:'財團法人塑膠工業技術發展中心',
    date:'2026.03.26',
    hours:'48 小時',
    desc:'聚集包裝結構設計、運輸測試與成本優化方法，提升包材選型與量產導入判斷能力。',
    outcomes: ['包裝結構力學分析', 'ISTA 運輸測試標準', '包裝材料成本估算', '永續包材選用指南'],
    images: ['/images/course-packaging.png', '/images/course-packaging-photo.jpg']
  },
  {
    cat: 'ai', 
    title:'在職菁英 AI 人才培育課程',
    sub:'',
    org:'114年度經濟部產業發展屬補助課程',
    date:'2025.12.09 – 2025.12.17',
    hours:'30 小時',
    desc:'學習 AI 基礎概論與架構、機器學習（監督式/非監督式學習）技術理論與案例、以及生成式 AI 的原理與應用。',
    outcomes: ['機器學習基礎理論', '生成式 AI 技術原理', '產業 AI 導入案例分析', 'AI 模型評估與優化'],
    images: ['/images/course-ai-talent.png']
  },
  {
    cat: 'ai', 
    title:'iPAS AI 應用規劃師初級證照班課程',
    sub:'',
    org:'中國生產力中心 China Productivity Center',
    date:'2026.04.26',
    hours:'48 小時',
    desc:'系統化學習 AI 導入、規劃與應用情境建構，強化跨領域數位工具整合能力。（正在培訓中，尚未取得證書）',
    outcomes: ['AI 應用場景規劃', '數位轉型策略制定', 'AI 工具鏈整合', '證照考試重點解析'],
    images: ['/images/ipas-ai-planning-cert.jpg']
  },
  {
    cat: 'ai', 
    title:'AI 應用實務系列課程(NUVA)',
    sub:'ChatGPT LV.1 & MAKE LV.1',
    org:'NUVA',
    date:'2025.03 – 2025.04',
    hours:'16 小時',
    desc:'學習建立 AI 機器人與 LINE 官方帳號整合應用，實現 brand 溝通自動化。',
    outcomes: ['ChatGPT 進階指令技巧', 'MAKE 自動化工作流建置', 'LINE Bot 整合應用', 'AI 內容生成策略'],
    images: ['/images/chat-gpt-lv1.jpg', '/images/make-lv1.jpg', '/images/nuva-group-photo.jpg']
  },
  {
    cat: 'ai', 
    title:'iPAS AI應用規劃師初級能力培訓班',
    sub:'',
    org:'經濟部商業發展署',
    date:'2026.03.22',
    hours:'15 小時',
    desc:'學習 AI 基礎應用與規劃，掌握商業場景下的 AI 導入實務。',
    outcomes: ['AI 基礎概論', '商業應用場景分析', 'AI 規劃實務', '案例研究'],
    images: ['/images/ipas-ai-planning-basic.jpg']
  }
];

const COURSE_CATS = {
  all: { label: '全部', icon: LayoutGrid },
  ai: { label: 'AI應用課程', icon: BrainCircuit },
  packaging: { label: '包裝專業課程', icon: Archive }
};

const EXP_DATA = [
  {
    role:'包裝工程師', co:'美律實業股份有限公司', period:'2022/7～2025/05・2年11個月',
    loc:'台中市南屯區・精密儀器相關製造業 500人以上',
    logo: '/images/merry-logo.jpg',
    duties:['消費性電子產品包裝開發工作、包裝相關提案與結構設計','新機型產品包材圖面繪製、包裝作業流程製作','包裝廠商樣品追蹤、品質問題改善確認'],
    results:[
      '國際品牌 TWS / HDT / Soundbar 包裝設計提案（共 25 件）',
      '根據產品定位提出多元價位包裝設計方案，滿足不同市場需求與品牌策略，接案達成率達 40%',
      '於 RFQ 階段設計消費性電子產品包裝、工程圖面繪製及成本分析，達成研發成本節省約 10%'
    ],
    tags:['Creo','產品開發','電腦繪圖軟體操作','產品結構評估','包裝設計']
  },
  {
    role:'產品設計師', co:'台灣櫻花股份有限公司', period:'2020/3～2022/7・2年5個月',
    loc:'台中市大雅區・非金屬家具及裝設品製造業 500人以上',
    logo: '/images/sakura-logo.png',
    duties:['針對 PM 市場規劃結合消費者調查結果擬定設計方向','跨部門協作經驗','國內外廚電市場與造型趨勢調研'],
    results:[
      '2021 年度績優員工',
      '產品開發與上市經驗',
      '主導易清檯面爐 G2522AG、G2623AG 上市，優化清潔設計與旋鈕造型'
    ],
    tags:['Creo','Adobe Photoshop','Illustrator','Key Shot','繪圖工具軟體操作']
  },
  {
    role:'產品設計師', co:'上岳科技股份有限公司', period:'2018/11～2019/12・1年2個月',
    loc:'台中市南屯區・醫療器材製造業 30–100人',
    logo: '/images/emg-logo.png',
    duties:['新品提案與簡報製作','依據 RD 提供模組進行產品設計提案，含視覺、材質規劃與造型風格定調','產品造型設計'],
    results:[
      '低周波治療器 2 款外觀提案',
      '兒童用霧化器外觀提案',
      'SPO2 手環 5 款外觀提案'
    ],
    tags:['SolidWorks','Illustrator','Photoshop','Key Shot','產品機構設計','外型設計']
  },
  {
    role:'產品設計師', co:'研成股份有限公司', period:'2017/8～2018/8・1年1個月',
    loc:'新北市新店區・專門設計相關業 30–100人',
    logo: '/images/cic-logo.png',
    duties:['新品提案與簡報製作','依據 RD 提供模組進行產品設計提案','產品造型設計'],
    results:[
      '獨立負責日本學研 GAKKEN 委託之鋁製品設計案',
      '研發多合一 solar 新產品 & 彩盒設計規劃',
      '協助 2018 年度 12in1 solar 產品色彩配置'
    ],
    tags:['Illustrator','Adobe Photoshop','產品設計','產品包裝設計','Key Shot']
  }
];

const INTERESTS = [
  { id: 'gym', title: '重量訓練', icon: Dumbbell, goal: '目前每週2練，\n目標提升至每週4練！', desc: '訓練耐力與自律，堅持每一步小進步，挑戰更強的自己。', emojis: ['🏋️', '💪', '🏃', '⚡'], image: '/images/gym.jpg' },
  { id: 'marathon', title: '馬拉松', icon: Timer, goal: '5次半馬，\n目標完成人生第一場全馬！', desc: '目前有5次半馬的經驗，目標挑戰人生第一場全馬拉松，不只是體能，更是堅持信念的挑戰！', emojis: ['🏅', '🎽', '🏃‍♀️', '🥇'], image: '/images/marathon.jpg' },
  { id: 'hiking', title: '登山', icon: Mountain, goal: '登頂2座百岳，\n目標持續挑戰台灣百岳全集！', desc: '除了健身與長跑，我也熱愛登山挑戰，目前已成功攀登兩座台灣百岳。', emojis: ['⛰️', '🌄', '🥾', '🗻'], image: '/images/hiking.jpg' }
];

const TABS = [
  { id: 'about', label: '關於我', icon: User },
  { id: 'exp', label: '經歷', icon: Briefcase },
  { id: 'skills', label: '技能專長', icon: Wrench },
  { id: 'projects', label: '專案成就', icon: Grid },
  { id: 'courses', label: '進修課程', icon: BookOpen },
  { id: 'interests', label: '興趣', icon: Heart },
];

const AvatarSVG = () => (
  <img 
    src={getImageUrl("/images/profile.jpg")} 
    alt="賴以婕 Amanda" 
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
    onError={(e) => {
      console.error("Image load failed:", e.currentTarget.src);
    }}
  />
);

const ProjectPlaceholder = ({ id, cat }: { id: string, cat: string }) => {
  const Icon = cat === 'packaging' ? Package : cat === 'product' ? Box : PenTool;
  
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-3 p-6 select-none">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#dee2e6]">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <div className="text-[13px] font-bold text-[#adb5bd] uppercase tracking-widest mb-1">Portfolio</div>
        <div className="text-[11px] text-[#ced4da] font-medium">尚未上傳專案照片</div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-[0.03] rotate-12">
        <Icon size={120} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [activeProjCat, setActiveProjCat] = useState('all');
  const [activeProjSubCats, setActiveProjSubCats] = useState<string[]>(['all']);
  const [projSearch, setProjSearch] = useState('');
  const [activeCourseCat, setActiveCourseCat] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [lightboxProj, setLightboxProj] = useState<any>(null);
  const [lightboxCourse, setLightboxCourse] = useState<any>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [expandedExp, setExpandedExp] = useState<number>(0);

  const [skillsList] = useState(INITIAL_SKILLS);

  const skillIcons: Record<string, any> = {
    Search, Palette, Cpu, ClipboardList, Hammer, Wrench, Lightbulb, BrainCircuit, Layers
  };
  
  const filteredProjects = useMemo(() => {
    let result = activeProjCat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === activeProjCat);
    
    if (!activeProjSubCats.includes('all') && activeProjSubCats.length > 0) {
      result = result.filter(p => activeProjSubCats.includes(p.subcat || ''));
    }

    if (projSearch.trim()) {
      const q = projSearch.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.short.toLowerCase().includes(q) || 
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [activeProjCat, activeProjSubCats, projSearch]);

  const filteredCourses = useMemo(() => {
    let result = activeCourseCat === 'all' ? COURSES : COURSES.filter(c => c.cat === activeCourseCat);
    
    if (courseSearch.trim()) {
      const q = courseSearch.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.sub.toLowerCase().includes(q) || 
        c.org.toLowerCase().includes(q) ||
        (c.outcomes && c.outcomes.some(o => o.toLowerCase().includes(q)))
      );
    }
    
    return result;
  }, [activeCourseCat, courseSearch]);

  const renderAbout = () => (
    <div className="flex flex-col gap-4">
      {/* 關於賴以婕 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-lg bg-[#3d7a5a]/10 flex items-center justify-center text-[#3d7a5a]">
            <User size={20} />
          </div>
          <h2 className="text-lg font-bold text-[#212529]">關於 賴以婕 Amanda</h2>
        </div>
        <div className="space-y-4 text-[#495057] leading-relaxed">
          <p>
            我是<strong>賴以婕 Amanda</strong>，目前居住於台中市，擁有超過 7 年的產品設計與包裝工程經驗。我熱衷於將美學創意與工程實務結合，致力於開發兼具品牌識別度與量產可行性的產品方案。
          </p>
          <p>
            在職業生涯中，我曾服務於<strong>美律實業 (Merry Electronics)</strong> 與<strong>台灣櫻花 (SAKURA)</strong> 等知名企業，主導過多項消費性電子產品與廚房家電的開發案。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
              <GraduationCap className="text-[#3d7a5a]" size={18} />
              <div>
                <div className="text-[11px] text-[#adb5bd] font-bold uppercase">Education</div>
                <div className="text-[13px] font-bold">國立台灣科技大學</div>
                <div className="text-[12px]">設計學院 工商業設計系</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
              <MapPin className="text-[#3d7a5a]" size={18} />
              <div>
                <div className="text-[11px] text-[#adb5bd] font-bold uppercase">Location</div>
                <div className="text-[13px] font-bold">台中市, 台灣</div>
                <div className="text-[12px]">Taichung, Taiwan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心價值 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Lightbulb, title: '創新思維', desc: '從市場趨勢中挖掘設計切入點。' },
          { icon: Layers, title: '結構專業', desc: '精通 3D 建模與包裝力學分析。' },
          { icon: Target, title: '精準執行', desc: '確保設計構想到量產的完美轉化。' }
        ].map((item, i) => (
          <div key={i} className="bg-white border-2 border-[#e9ecef] p-4 rounded-xl text-center hover:border-[#3d7a5a] transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center mx-auto mb-3 text-[#adb5bd] group-hover:bg-[#3d7a5a] group-hover:text-white transition-colors">
              <item.icon size={22} />
            </div>
            <h3 className="font-bold text-[#212529] mb-1">{item.title}</h3>
            <p className="text-[13px] text-[#6c757d]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExp = () => (
    <div className="flex flex-col gap-6">
      {EXP_DATA.map((exp, idx) => (
        <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#e9ecef]">
          <div className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full border-2 border-white ${idx === 0 ? 'bg-[#3d7a5a] shadow-[0_0_0_4px_rgba(61,122,90,0.1)]' : 'bg-[#adb5bd]'}`} />
          
          <div className="bg-white border-2 border-[#e9ecef] rounded-xl overflow-hidden hover:border-[#3d7a5a] transition-all">
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl border border-[#e9ecef] p-2 bg-white flex items-center justify-center overflow-hidden">
                    <img src={getImageUrl(exp.logo)} alt={exp.co} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#212529]">{exp.role}</h3>
                    <div className="text-[#3d7a5a] font-bold text-[14px]">{exp.co}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f8f9fa] rounded-full text-[12px] font-bold text-[#6c757d]">
                    <Calendar size={12} />
                    {exp.period}
                  </div>
                  <div className="text-[12px] text-[#adb5bd] mt-1 flex items-center justify-end gap-1">
                    <MapPin size={10} />
                    {exp.loc.split('・')[0]}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[13px] font-bold text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ClipboardList size={14} /> 主要職責
                  </h4>
                  <ul className="space-y-2">
                    {exp.duties.map((duty, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-[#495057]">
                        <div className="mt-1.5 w-1 h-1 rounded-full bg-[#3d7a5a] shrink-0" />
                        {duty}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#adb5bd] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Trophy size={14} /> 重點成就
                  </h4>
                  <ul className="space-y-2">
                    {exp.results?.map((res, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-[#495057] bg-[#f8f9fa] p-2 rounded-lg">
                        <Check size={14} className="text-[#3d7a5a] mt-0.5 shrink-0" />
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#f1f3f5] flex flex-wrap gap-2">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-[#f1f3f5] text-[#6c757d] rounded text-[11px] font-medium">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skillsList.map((skill) => {
        const Icon = skillIcons[skill.icon] || Wrench;
        return (
          <div key={skill.id} className="bg-white border-2 border-[#e9ecef] rounded-xl p-5 hover:border-[#3d7a5a] transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#3d7a5a]/10 flex items-center justify-center text-[#3d7a5a]">
                <Icon size={24} />
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-6 h-1.5 rounded-full ${i < skill.level ? 'bg-[#3d7a5a]' : 'bg-[#e9ecef]'}`} />
                ))}
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#212529] mb-2">{skill.title}</h3>
            <p className="text-[14px] text-[#6c757d] mb-4 flex-grow">{skill.desc}</p>
            <div className="space-y-2">
              <div className="text-[12px] font-bold text-[#adb5bd] uppercase tracking-wider">專業項目</div>
              <div className="flex flex-wrap gap-2">
                {skill.subSkills.map((sub, i) => (
                  <span key={i} className="px-2 py-1 bg-[#f8f9fa] border border-[#e9ecef] text-[#495057] rounded-md text-[12px]">{sub}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* 軟體工具 */}
      <div className="md:col-span-2 bg-[#212529] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Wrench size={20} className="text-[#3d7a5a]" />
          <h3 className="text-lg font-bold">軟體工具軟體操作</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Creo', logo: '/images/creo-logo.png' },
            { name: 'SolidWorks', logo: '/images/solidworks-logo.jpg' },
            { name: 'AutoCAD', logo: '/images/autocad-logo-1.jpg' },
            { name: 'KeyShot', logo: '/images/keyshot-logo.jpg' },
            { name: 'InDesign', logo: '/images/adobe-indesign-logo.png' },
            { name: 'Illustrator', logo: '/images/illustrator-logo.jpg' },
            { name: 'Photoshop', logo: '/images/photoshop-logo-2015.jpg' },
          ].map((tool, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-3 group-hover:bg-white/20 transition-colors flex items-center justify-center overflow-hidden">
                <img src={getImageUrl(tool.logo)} alt={tool.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <span className="text-[12px] font-medium text-white/60 group-hover:text-white">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="flex flex-col gap-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border-2 border-[#e9ecef]">
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATS).map(([id, cat]) => (
            <button
              key={id}
              onClick={() => setActiveProjCat(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeProjCat === id ? 'bg-[#3d7a5a] text-white shadow-lg shadow-[#3d7a5a]/20' : 'bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]'}`}
            >
              <cat.icon size={16} />
              {cat.label}
              <span className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${activeProjCat === id ? 'bg-white/20' : 'bg-[#e9ecef]'}`}>
                {id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.cat === id).length}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adb5bd]" />
          <input 
            type="text" 
            placeholder="搜尋專案名稱、標籤..." 
            value={projSearch}
            onChange={(e) => setProjSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-lg text-[13px] focus:ring-2 focus:ring-[#3d7a5a]/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={proj.id}
              onClick={() => setLightboxProj(proj)}
              className="group bg-white border-2 border-[#e9ecef] rounded-2xl overflow-hidden hover:border-[#3d7a5a] hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="aspect-[4/3] bg-[#f8f9fa] relative overflow-hidden">
                {proj.images && proj.images.length > 0 ? (
                  <img 
                    src={getImageUrl(proj.images[0])} 
                    alt={proj.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.placeholder')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="placeholder hidden absolute inset-0">
                  <ProjectPlaceholder id={proj.id} cat={proj.cat} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <div className="text-white">
                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">{CATS[proj.cat as keyof typeof CATS]?.label}</div>
                    <div className="font-bold flex items-center gap-2">查看詳細專案 <ArrowRight size={14} /></div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#212529] mb-1 group-hover:text-[#3d7a5a] transition-colors">{proj.title}</h3>
                <p className="text-[13px] text-[#6c757d] line-clamp-1 mb-4">{proj.short}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#f1f3f5] text-[#6c757d] rounded text-[10px] font-bold uppercase">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-[#e9ecef]">
          <div className="text-[#dee2e6] mb-4 flex justify-center"><Search size={48} /></div>
          <div className="text-[#adb5bd] font-bold">找不到符合條件的專案</div>
          <button onClick={() => {setActiveProjCat('all'); setProjSearch('');}} className="mt-4 text-[#3d7a5a] font-bold text-[13px] hover:underline">清除所有過濾條件</button>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border-2 border-[#e9ecef]">
        <div className="flex flex-wrap gap-2">
          {Object.entries(COURSE_CATS).map(([id, cat]) => (
            <button
              key={id}
              onClick={() => setActiveCourseCat(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeCourseCat === id ? 'bg-[#3d7a5a] text-white' : 'bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]'}`}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.map((course, idx) => (
          <div 
            key={idx} 
            className="bg-white border-2 border-[#e9ecef] rounded-xl overflow-hidden hover:border-[#3d7a5a] transition-all"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto bg-[#f8f9fa] shrink-0 overflow-hidden relative group cursor-pointer" onClick={() => setLightboxCourse(course)}>
                <img 
                  src={getImageUrl(course.images[0])} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 p-2 rounded-full text-[#3d7a5a] shadow-lg"><Search size={20} /></div>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.cat === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {COURSE_CATS[course.cat as keyof typeof COURSE_CATS]?.label}
                  </span>
                  <div className="text-[12px] font-bold text-[#adb5bd] flex items-center gap-1">
                    <Timer size={12} /> {course.hours}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#212529] mb-1">{course.title}</h3>
                <div className="text-[#3d7a5a] text-[13px] font-bold mb-3">{course.org}</div>
                <p className="text-[14px] text-[#6c757d] mb-4 line-clamp-2">{course.desc}</p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#f1f3f5]">
                  <div className="text-[12px] text-[#adb5bd] font-medium">{course.date}</div>
                  <button 
                    onClick={() => setExpandedCourse(expandedCourse === idx ? null : idx)}
                    className="text-[#3d7a5a] font-bold text-[13px] flex items-center gap-1 hover:underline"
                  >
                    {expandedCourse === idx ? '收起學習重點' : '查看學習重點'}
                    <ChevronDown size={14} className={`transition-transform ${expandedCourse === idx ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {expandedCourse === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-dashed border-[#e9ecef]">
                        {course.outcomes.map((outcome, i) => (
                          <div key={i} className="flex items-center gap-2 text-[13px] text-[#495057]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3d7a5a]" />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {INTERESTS.map((item) => (
        <div key={item.id} className="bg-white border-2 border-[#e9ecef] rounded-2xl overflow-hidden hover:border-[#3d7a5a] transition-all group">
          <div className="h-48 relative overflow-hidden">
            <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
              <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-[#3d7a5a] shadow-lg">
                <item.icon size={20} />
              </div>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-[#212529] mb-2">{item.title}</h3>
            <p className="text-[14px] text-[#6c757d] mb-4 h-12 line-clamp-2">{item.desc}</p>
            <div className="bg-[#f8f9fa] p-3 rounded-xl border border-[#e9ecef]">
              <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Target size={10} /> Current Goal
              </div>
              <div className="text-[13px] font-bold text-[#3d7a5a] whitespace-pre-line">{item.goal}</div>
            </div>
            <div className="flex gap-2 mt-4">
              {item.emojis.map((emoji, i) => (
                <span key={i} className="text-lg">{emoji}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-[#212529] font-sans selection:bg-[#3d7a5a]/20 selection:text-[#3d7a5a]">
      {/* Sidebar Navigation - Mobile Toggle could be added */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Profile Card */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white border-2 border-[#e9ecef] rounded-3xl overflow-hidden shadow-sm">
              <div className="h-32 bg-[#3d7a5a]" />
              <div className="px-6 pb-8 text-center -mt-16">
                <div className="w-32 h-32 rounded-3xl border-4 border-white bg-white mx-auto overflow-hidden shadow-xl mb-4">
                  <AvatarSVG />
                </div>
                <h1 className="text-2xl font-bold text-[#212529] mb-1">賴以婕 Amanda</h1>
                <p className="text-[#6c757d] font-medium text-[15px] mb-4">工業設計師 / 包裝工程師</p>
                <div className="flex items-center justify-center gap-2 text-[#adb5bd] text-[13px] mb-6">
                  <MapPin size={14} /> 台灣, 台中
                </div>
                
                <div className="space-y-3 pt-6 border-t border-[#f1f3f5]">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#adb5bd] font-medium">目前狀態</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-md font-bold text-[11px]">開放中</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#adb5bd] font-medium">電子郵件</span>
                    <a href="mailto:amanda840604@gmail.com" className="font-bold hover:text-[#3d7a5a] transition-colors">amanda840604@gmail.com</a>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#adb5bd] font-medium">聯絡電話</span>
                    <span className="font-bold">0918-190-990</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] pt-2">
                    <span className="text-[#adb5bd] font-medium">LINE</span>
                    <button className="px-4 py-1.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-full text-[12px] font-bold hover:bg-[#e9ecef] transition-colors">
                      加為好友
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="bg-white border-2 border-[#e9ecef] rounded-3xl p-3 shadow-sm hidden lg:block">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all mb-1 last:mb-0 ${activeTab === tab.id ? 'bg-[#3d7a5a] text-white shadow-lg shadow-[#3d7a5a]/20' : 'text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#212529]'}`}
                >
                  <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow min-w-0">
          {/* Mobile Nav */}
          <div className="lg:hidden mb-6 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#3d7a5a] text-white' : 'bg-white text-[#6c757d]'}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#212529] mb-2 flex items-center gap-3">
              {TABS.find(t => t.id === activeTab)?.label}
              <div className="h-1 flex-grow bg-[#e9ecef] rounded-full ml-4 opacity-50" />
            </h2>
            <p className="text-[#6c757d] font-medium">
              {activeTab === 'about' && '個人簡介與核心價值'}
              {activeTab === 'exp' && '職業生涯與實戰經驗'}
              {activeTab === 'skills' && '專業技能與軟體工具'}
              {activeTab === 'projects' && '設計專案與作品集'}
              {activeTab === 'courses' && '持續學習與專業進修'}
              {activeTab === 'interests' && '生活熱情與個人興趣'}
            </p>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'about' && renderAbout()}
            {activeTab === 'exp' && renderExp()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'interests' && renderInterests()}
          </motion.div>
        </main>
      </div>

      {/* Lightbox for Projects */}
      <AnimatePresence>
        {lightboxProj && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#212529]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxProj(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors" onClick={() => setLightboxProj(null)}>
              <X size={32} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-5xl max-h-full rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="md:w-3/5 bg-[#f8f9fa] flex flex-col">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                  {lightboxProj.images && lightboxProj.images.length > 0 ? (
                    lightboxProj.images.map((img: string, i: number) => (
                      <img key={i} src={getImageUrl(img)} alt={`${lightboxProj.title}-${i}`} className="w-full rounded-xl shadow-sm" />
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ProjectPlaceholder id={lightboxProj.id} cat={lightboxProj.cat} />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-2/5 p-8 overflow-y-auto">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-[#3d7a5a]/10 text-[#3d7a5a] rounded-full text-[11px] font-black uppercase tracking-widest mb-4 inline-block">
                    {CATS[lightboxProj.cat as keyof typeof CATS]?.label}
                  </span>
                  <h2 className="text-2xl font-black text-[#212529] mb-2">{lightboxProj.title}</h2>
                  <p className="text-[#3d7a5a] font-bold text-[15px]">{lightboxProj.short}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[12px] font-black text-[#adb5bd] uppercase tracking-widest mb-2">專案描述</h4>
                    <p className="text-[#495057] text-[14px] leading-relaxed">{lightboxProj.desc}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {lightboxProj.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#f8f9fa] border border-[#e9ecef] text-[#6c757d] rounded-lg text-[12px] font-bold">#{tag}</span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setLightboxProj(null)}
                    className="w-full py-4 bg-[#212529] text-white rounded-2xl font-bold text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    關閉詳細資訊
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Courses */}
      <AnimatePresence>
        {lightboxCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#212529]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxCourse(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={() => setLightboxCourse(null)}>
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl w-full max-h-full overflow-y-auto no-scrollbar rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                {lightboxCourse.images.map((img: string, i: number) => (
                  <img key={i} src={getImageUrl(img)} alt="Course Certificate" className="w-full rounded-2xl shadow-2xl" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 text-center text-[#adb5bd]">
        <div className="max-w-7xl mx-auto px-4 border-t border-[#e9ecef] pt-12">
          <div className="font-black text-[20px] text-[#212529] mb-2">Amanda Lai</div>
          <p className="text-[13px] mb-6">Industrial Designer & Packaging Engineer Portfolio</p>
          <div className="flex justify-center gap-6 text-[12px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#3d7a5a] transition-colors">Behance</a>
            <a href="#" className="hover:text-[#3d7a5a] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#3d7a5a] transition-colors">Instagram</a>
          </div>
          <p className="mt-8 text-[11px] opacity-50">© 2026 Amanda Lai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
