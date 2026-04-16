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
  {id:'hood',cat:'product',subcat:'appliance',title:'油煙機設計',short:'薄化歐化油煙機、近吸油煙機系列',desc:'為 SAKURA 品牌設計薄化歐化油煙機（2020）及近吸油煙機（2022）、歐化油煙機（2021）系列。涵蓋外觀造型、CMF 規格、結構工程圖及量產驗證，兼顧空氣動力學效能與現代廚房美學。',tags:['產品設計','廚房家電','SAKURA'], images: ['static/images/hood_euro01.jpg', 'static/images/hood_euro02.jpg', 'static/images/hood_side_suction.jpg']},
  {id:'gas',cat:'product',subcat:'appliance',title:'瓦斯爐設計',short:'嵌入式瓦斯爐工業設計',desc:'嵌入式瓦斯爐工業設計，強調人因操作介面與安全結構整合，完成旋鈕、爐架與玻璃面板之 CMF 規格輸出。',tags:['產品設計','家電'], images: ['static/images/stove_easy_clean.jpg']},
  {id:'wearable',cat:'product',subcat:'medical',title:'穿戴式裝置設計',short:'睡眠監測智慧手環',desc:'睡眠監測智慧手環設計，整合感測模組與舒適穿戴結構，完成 CMF 規格及爆炸圖輸出。',tags:['穿戴裝置','醫療'], images: ['static/images/wearable01.jpg', 'static/images/wearable02.jpg', 'static/images/wearable03.jpg', 'static/images/wearable04.jpg']},
  {id:'medical',cat:'product',subcat:'medical',title:'醫療器材設計',short:'低頻治療儀 / 霧化器 / SPO2 手環',desc:'包含低周波治療器 2 款外觀提案、兒童用霧化器外觀提案及 SPO2 手環 5 款外觀提案，完成外觀造型、爆炸圖與量產工程規格文件。',tags:['醫療器材','工業設計'], images: ['static/images/medical02.jpg']},
  {id:'toy',cat:'product',subcat:'toy',title:'玩具設計',short:'兒童益智玩具系列',desc:'兒童益智玩具系列設計，包含角色造型、結構拼組與安全材質規劃。',tags:['玩具設計','CMF'], images: ['static/images/toy_design.jpg']},
  {id:'sketch',cat:'product',subcat:'sketch',title:'手繪作品',short:'人物速寫 / 產品草圖 / 概念插畫',desc:'人物速寫、產品草圖與概念插畫，展現設計思維與手感表達能力。',tags:['手繪','插畫'], images: ['static/images/sketch.jpg']},
  {id:'tws_card',cat:'packaging',subcat:'ce',title:'TWS 紙卡內襯設計',short:'TWS 耳機紙卡內襯方案總覽',desc:'針對 TWS 耳機系列開發紙卡內襯，彙整多種結構選項，形成模組化設計資料庫。',tags:['包裝設計','TWS','紙卡'], images: ['static/images/tws_card_inner01.png', 'static/images/tws_card_inner02.png', 'static/images/tws_card_inner03.png', 'static/images/tws_card_inner04.png', 'static/images/tws_card_inner05.png', 'static/images/tws_card_inner06.png', 'static/images/tws_card_inner07.png', 'static/images/tws_card_inner08.png', 'static/images/tws_card_inner09.png', 'static/images/tws_card_inner10.png', 'static/images/tws_card_inner11.png', 'static/images/tws_card_inner12.png']},
  {id:'tws_pkg',cat:'packaging',subcat:'ce',title:'TWS 包裝設計',short:'TWS 耳機完整包裝設計',desc:'為國際品牌 TWS 耳機設計完整包材，包含外箱、內裝結構與印刷規格。',tags:['包裝設計','消費電子'], images: ['static/images/tws_package_design01.jpg', 'static/images/tws_package_design02.jpg']},
  {id:'hdt_card',cat:'packaging',subcat:'ce',title:'HDT 紙卡內襯設計',short:'電競耳機包裝結構方案',desc:'HDT 電競耳機紙卡內襯設計，提出多選項比較方案，支援 RFQ 提案決策。',tags:['包裝設計','HDT'], images: ['static/images/hdt_card01.jpg', 'static/images/hdt_card02.jpg', 'static/images/hdt_card03.jpg', 'static/images/hdt_card04.jpg', 'static/images/hdt_card05.jpg', 'static/images/hdt_card06.jpg', 'static/images/hdt_card07.jpg', 'static/images/hdt_card08.jpg', 'static/images/hdt_card09.jpg', 'static/images/hdt_card10.jpg', 'static/images/hdt_card11.jpg', 'static/images/hdt_card12.jpg', 'static/images/hdt_card13.jpg', 'static/images/hdt_card14.jpg']},
  {id:'soundbar_card',cat:'packaging',subcat:'ce',title:'Soundbar 紙卡內襯設計',short:'Soundbar 包裝內構設計',desc:'Soundbar 紙卡內襯結構設計，考量產品尺寸與跌落保護需求。',tags:['包裝設計','Soundbar'], images: ['static/images/soundbar_card_inner01.png', 'static/images/soundbar_card_inner02.png', 'static/images/soundbar_card_inner03.png', 'static/images/soundbar_card_inner04.jpg', 'static/images/soundbar_card_inner05.jpg', 'static/images/soundbar_card_inner06.jpg', 'static/images/soundbar_card_inner07.jpg', 'static/images/soundbar_card_inner08.jpg']},
  {id:'soundbar_pkg',cat:'packaging',subcat:'ce',title:'Soundbar 設計',short:'Soundbar 整體包裝方案',desc:'Speaker Packaging Design，採用 Harvest Foam Dry-Pressed Pulp Tray，整合環保材質與品牌呈現。',tags:['包裝設計','永續','Soundbar'], images: ['static/images/soundbar_design01.jpg']},
  {id:'webcam',cat:'packaging',subcat:'ce',title:'視訊鏡頭包裝設計',short:'Webcam Packaging Design',desc:'視訊鏡頭包裝設計，採 Black Wet-Pressed Pulp Tray，兼顧防護與環保需求。',tags:['包裝設計','紙托'], images: ['static/images/webcam01.jpg', 'static/images/webcam02.jpg']},
  {id:'carrycase',cat:'packaging',subcat:'bike',title:'Carrycase 包袋設計',short:'收納包袋結構設計',desc:'自行車零件收納包袋設計，考量多 SKU 共用與模組化包裝平台。',tags:['包裝設計','自行車'], images: ['static/images/carrycase01.jpg']},
  {id:'mtb',cat:'packaging',subcat:'bike',title:'MTB Handle Bar 包裝設計',short:'MTB 車把手包裝設計',desc:'MTB 車把手三層瓦楞結構包裝，考量層板方案、正面紙板與包裝底座。',tags:['包裝設計','自行車','Handle Bar'], images: ['static/images/mtb_handle_bar01.jpg', 'static/images/mtb_handle_bar02.jpg', 'static/images/mtb_handle_bar03.jpg', 'static/images/mtb_handle_bar04.png', 'static/images/mtb_handle_bar05.png', 'static/images/mtb_handle_bar06.png']},
  {id:'tr',cat:'packaging',subcat:'bike',title:'TR Handle Bar 包裝設計',short:'TR 車把手包裝設計',desc:'TR Handle Bar 包裝結構設計，統整行李方案、正面紙板至包裝底座完整流程。',tags:['包裝設計','自行車'], images: ['static/images/tr_handle_bar01.jpg', 'static/images/tr_handle_bar02.jpg', 'static/images/tr_handle_bar03.jpg', 'static/images/tr_handle_bar04.jpg', 'static/images/tr_handle_bar05.jpg', 'static/images/tr_handle_bar06.png', 'static/images/tr_handle_bar07.png', 'static/images/tr_handle_bar08.png']},
  {id:'ra',cat:'packaging',subcat:'bike',title:'RA Handle Bar 包裝設計',short:'RA 車把手包裝設計',desc:'RA Handle Bar 系列包裝設計，涵蓋運輸、展示與量產導入規格。',tags:['包裝設計','自行車'], images: ['static/images/ra_handle_bar01.png', 'static/images/ra_handle_bar02.png', 'static/images/ra_handle_bar03.png', 'static/images/ra_handle_bar04.png', 'static/images/ra_handle_bar05.png', 'static/images/ra_handle_bar06.png', 'static/images/ra_handle_bar07.png']},
  {id:'seatpost',cat:'packaging',subcat:'bike',title:'座管 包裝設計',short:'座管包裝結構設計',desc:'自行車座管包裝結構設計，針對細長零件開發全紙質緩衝方案。',tags:['包裝設計','自行車','減塑'], images: ['static/images/seatpost01.jpg', 'static/images/seatpost02.jpg', 'static/images/seatpost03.jpg', 'static/images/seatpost04.jpg', 'static/images/seatpost05.jpg', 'static/images/seatpost06.jpg', 'static/images/seatpost07.jpg', 'static/images/seatpost08.jpg', 'static/images/seatpost09.jpg']},
  {id:'steerer',cat:'packaging',subcat:'bike',title:'立管 包裝設計',short:'立管包裝結構設計',desc:'立管包裝設計，開發輕量化、可回收包材方案。',tags:['包裝設計','自行車'], images: ['static/images/steerer01.jpg', 'static/images/steerer02.jpg', 'static/images/steerer03.jpg', 'static/images/steerer04.jpg', 'static/images/steerer05.jpg']},
  {id:'quickrelease',cat:'packaging',subcat:'bike',title:'快拆束仔 包裝設計',short:'快拆束仔包裝設計',desc:'快拆束仔小零件包裝設計，兼顧防護性與零售展示需求。',tags:['包裝設計','自行車'], images: ['static/images/quickrelease01.jpg', 'static/images/quickrelease02.jpg', 'static/images/quickrelease03.jpg', 'static/images/quickrelease04.jpg']},
  {id:'graphic',cat:'graphic',subcat:'branding',title:'平面設計',short:'品牌CIS / 海報 / 識別物料',desc:'品牌視覺識別系統（CIS）、海報設計與企業識別物料整合輸出。',tags:['品牌設計','平面','CIS'], images: ['static/images/poster_design.jpg']}
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
    images: ['static/images/course-packaging.png', 'static/images/course-packaging-photo.jpg']
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
    images: ['static/images/course-ai-talent.png']
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
    images: ['static/images/ipas-ai-planning-cert.jpg']
  },
  {
    cat: 'ai', 
    title:'AI 應用實務系列課程(NUVA)',
    sub:'ChatGPT LV.1 & MAKE LV.1',
    org:'NUVA',
    date:'2025.03 – 2025.04',
    hours:'16 小時',
    desc:'學習建立 AI 機器人與 LINE 官方帳號整合應用，實現品牌溝通自動化。',
    outcomes: ['ChatGPT 進階指令技巧', 'MAKE 自動化工作流建置', 'LINE Bot 整合應用', 'AI 內容生成策略'],
    images: ['static/images/chat-gpt-lv1.jpg', 'static/images/make-lv1.jpg', 'static/images/nuva-group-photo.jpg']
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
    images: ['static/images/ipas-ai-planning-basic.jpg']
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
    logo: 'static/images/merry-logo.jpg',
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
    logo: 'static/images/sakura-logo.png',
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
    logo: 'static/images/emg-logo.png',
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
    logo: 'static/images/cic-logo.png',
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
  { id: 'gym', title: '重量訓練', icon: Dumbbell, goal: '目前每週2練，\n目標提升至每週4練！', desc: '訓練耐力與自律，堅持每一步小進步，挑戰更強的自己。', emojis: ['🏋️', '💪', '🏃', '⚡'], image: 'static/images/gym.jpg' },
  { id: 'marathon', title: '馬拉松', icon: Timer, goal: '5次半馬，\n目標完成人生第一場全馬！', desc: '目前有5次半馬的經驗，目標挑戰人生第一場全馬拉松，不只是體能，更是堅持信念的挑戰！', emojis: ['🏅', '🎽', '🏃‍♀️', '🥇'], image: 'static/images/marathon.jpg' },
  { id: 'hiking', title: '登山', icon: Mountain, goal: '登頂2座百岳，\n目標持續挑戰台灣百岳全集！', desc: '除了健身與長跑，我也熱愛登山挑戰，目前已成功攀登兩座台灣百岳。', emojis: ['⛰️', '🌄', '🥾', '🗻'], image: 'static/images/hiking.jpg' }
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
    src="static/images/profile.jpg" 
    alt="賴以婕 Amanda" 
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
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
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <User size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">關於賴以婕</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Layers size={14} />
                </div>
              </div>
              設計背景 × 設計流程開發經驗
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>畢業於台灣科技大學工業設計系，擁有 6 年產品與包裝設計實務經驗，熟悉從外觀設計、結構開發到量產製程的完整開發流程。</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>擅長品牌前期市場調研與定位分析，根據產品需求進行2D/3D設計規劃，執行草模驗證、建模與工程圖繪製，並具備『依照預算與成本條件調整設計策略的靈活應變能力』。</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Package size={14} />
                </div>
              </div>
              包裝設計專業深化
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>曾任職於美律實業股份有限公司，負責TWS耳機、電競耳機、Soundbar等國際品牌的包裝設計與開發，持續強化『環保包裝結構設計、跨部門專案執行能力及開發經驗』。</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>現任職於久鼎金屬實業股份有限公司，專注於自行車零件包裝結構革新。<br />致力於開發「全紙質緩衝結構」與「減塑方案」，協助產業落實低碳永續目標。</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 設計 X 開發實務經驗 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">設計 × 開發實務經驗</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-3 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Box size={14} />
                </div>
              </div>
              包裝設計領域
            </h3>
            <div className="space-y-4 pl-[52px]">
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  國際品牌 TWS／HDT／Soundbar 包裝設計提案 (共25件)
                </div>
                <div className="text-sm leading-relaxed text-[#6c757d] pl-[22px] space-y-2">
                  <p>根據產品定位提出多元價位(低/中/高)包裝設計方案，滿足不同市場需求與品牌策略</p>
                  <p>在消費性電子產品RFQ階段，主導包裝結構設計、2D工程圖繪製與初步成本分析，成功協助研發單位達成約10%的包材成本節省</p>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  建立包裝設計資料庫以及市調資料表 (共6件)
                </div>
                <p className="text-sm leading-relaxed text-[#6c757d] pl-[22px]">彙整 TWS、HDT、Soundbar 紙卡內襯結構規格，形成模組化資料庫，加速專案提案效率，並精準對焦市場需求</p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  參與 HDT 電競耳機開發專案 (共2件)
                </div>
                <p className="text-sm leading-relaxed text-[#6c757d] pl-[22px]">實際參與兩款 HyperX 電競耳機機型開發，累積從結構設計、打樣修正到量產導入的完整開發經驗</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <PenTool size={14} />
                </div>
              </div>
              產品設計領域
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>主導易清系列檯面爐與近吸式油煙機完整開發流程</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>親自承辦金點設計競賽提案並獲得兩件入選（R3750B、P0233／235）</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>協助外觀與結構開發並導入量產流程，成功落地產品（如 R3750B）</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Users size={14} />
                </div>
              </div>
              跨部門與供應商協作能力
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>能與供應商與工廠密切協作，確保設計順利導入量產並維持品質穩定</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 職涯規劃 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Target size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">職涯規劃</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-3 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Flag size={14} />
                </div>
              </div>
              短期目標
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>深入 ESG 永續議題，探索各類紙材、布料等 CMF 特性與加工技術，建立應用知識庫，並與供應商合作開發環保材質</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>強化紙材結構設計能力，目標能提出具創新性的設計專利</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>培養紙材成本評估能力，根據需求提出兼顧保護性與成本效益的結構優化方案</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-3 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <TrendingUp size={14} />
                </div>
              </div>
              中長期目標
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>累積跨國與跨部門合作經驗，強化英文聽說讀寫的能力以應對全球化的工作需求</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>持續提升設計落地與製程協作能力，累積更多實戰開發經驗</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>建立包裝設計與市場趨勢的連結敏感度，結合行銷視角強化整合能力，朝向具策略思維的設計開發整合型人才邁進</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 設計理念 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Lightbulb size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">設計理念</h2>
        </div>
        <ol className="flex flex-col gap-4 mt-2">
          {[
            '設計應兼具感性與理性：設計不僅是創造視覺與情感價值，更必須考量製程可行性、技術限制、成本控制與品質穩定性。',
            '設計須服務於產品與使用者體驗：我重視產品本質，關注設計如何實際提升使用者的便利性與品牌價值，讓設計發揮功能性與影響力。',
            '重視跨部門合作與溝通效率：良好的設計來自良好的協作，我樂於與不同角色協同合作，透過積極溝通整合各方需求與資源。',
            '持續保持熱情與學習動能：對我而言，設計不只是工作，更是一種持續探索的過程。我始終懷抱熱情與好奇心，樂於在團隊中貢獻專業，也期待在未來的職位中持續成長，與夥伴一同創造實質價值，攜手向前。'
          ].map((text, i) => {
            const [bold, rest] = text.split('：');
            return (
              <li key={i} className="flex gap-3 items-start text-sm leading-relaxed text-[#6c757d]">
                <div className="w-10 flex justify-center shrink-0">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-[#e8f5ee] text-[#3d7a5a] font-bold text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                </div>
                <div className="flex flex-col">
                  <strong className="text-[#343a40] mb-1">{bold}</strong>
                  <span>{rest}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 興趣嗜好 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Heart size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">興趣嗜好</h2>
        </div>
        
        <div>
          <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                <Dumbbell size={14} />
              </div>
            </div>
            運動訓練
          </h3>
          <p className="text-sm leading-relaxed text-[#6c757d] pl-[52px]">
            工作之餘，我熱衷於挑戰自我的運動項目，包括健身、馬拉松與登山。<br/><br/>
            這些活動不僅讓我保持身心健康，更讓我在一次次的訓練與突破中，學習如何與自己對話、建立目標並找出實踐方法。對我而言，運動是一種自我探索與壓力釋放的途徑，也深深影響了我在工作上的思考方式與執行力。它讓我更堅定、更有彈性，也讓我在生活中保持熱情與正向的態度。
          </p>
        </div>
      </div>

      {/* 結語 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Check size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">結語</h2>
        </div>
        
        <div className="bg-[#e8f5ee] p-4 rounded-xl text-[#3d7a5a] text-sm leading-relaxed font-medium text-left">
          非常感謝您的閱讀。如有進一步了解的需要，歡迎與我聯繫。<br/>
          若有幸符合貴公司徵才條件，我將十分期待有機會參與正式面試，為團隊帶來我的熱情與專業。
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">工作經歷</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {EXP_DATA.map((exp, i) => (
          <motion.div 
            key={i} 
            className={`border-2 rounded-xl overflow-hidden transition-all hover:border-[#3d7a5a] ${expandedExp === i ? 'border-[#5a9e78] shadow-sm' : 'border-[#e9ecef]'}`}
          >
            <motion.div 
              whileTap={{ backgroundColor: "#f8f9fa" }}
              className="flex items-start justify-between p-3.5 sm:p-4 cursor-pointer gap-2 hover:bg-[#f1f3f5] transition-colors"
              onClick={() => setExpandedExp(expandedExp === i ? -1 : i)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 flex justify-center shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#e9ecef] shrink-0 flex items-center justify-center overflow-hidden relative group">
                    {exp.logo ? (
                      <img src={exp.logo} alt={exp.co} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[10px] font-semibold text-[#adb5bd]">LOGO</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[15px] text-[#343a40]">{exp.role}</div>
                  <div className="text-sm text-[#3d7a5a] font-semibold mt-0.5">{exp.co}</div>
                  <div className="text-xs text-[#adb5bd] mt-0.5">{exp.period}</div>
                </div>
              </div>
              <ChevronDown size={16} className={`shrink-0 mt-1 transition-transform text-[#adb5bd] ${expandedExp === i ? 'rotate-180 text-[#3d7a5a]' : ''}`} />
            </motion.div>
            
            <AnimatePresence>
              {expandedExp === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-[#e9ecef]">
                    <div className="text-xs text-[#adb5bd] py-2 pl-[52px]">{exp.loc}</div>
                    
                      <div className="text-sm font-bold text-[#343a40] mt-2 mb-2 flex items-center gap-3">
                        <div className="w-10 flex justify-center shrink-0">
                          <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                            <ClipboardList size={14} className="text-[#3d7a5a]" />
                          </div>
                        </div>
                        主要職責
                      </div>
                      <div className="flex flex-col gap-2">
                        {exp.duties.map((d, j) => (
                          <div key={j} className="flex gap-2 items-start text-sm text-[#6c757d] leading-relaxed pl-[52px]">
                            <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm font-bold text-[#343a40] mt-4 mb-2 flex items-center gap-3">
                        <div className="w-10 flex justify-center shrink-0">
                          <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                            <Trophy size={14} className="text-[#3d7a5a]" />
                          </div>
                        </div>
                        主要成果
                      </div>
                      <div className="flex flex-col gap-2">
                        {exp.results.map((r, j) => (
                          <div key={j} className="flex gap-2 items-start text-sm text-[#6c757d] leading-relaxed pl-[52px]">
                            <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-4 pl-[52px]">
                      {exp.tags.map((t, j) => <span key={j} className="bg-[#f1f3f5] border border-[#e9ecef] text-[#6c757d] text-xs px-2.5 py-1 rounded-full">{t}</span>)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 學歷 */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a] mt-8">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">學歷</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#e9ecef] shrink-0 flex items-center justify-center overflow-hidden relative group">
                <img src="static/images/ntust-logo.png" alt="國立臺灣科技大學" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-[#343a40]">國立臺灣科技大學</div>
              <div className="text-xs text-[#6c757d] mt-0.5">工業設計系・大學畢業</div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#e9ecef] shrink-0 flex items-center justify-center overflow-hidden relative group">
                <img src="static/images/tcivs-logo.jpg" alt="國立台中高工" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-[#343a40]">國立台中高工</div>
              <div className="text-xs text-[#6c757d] mt-0.5">圖文傳播科・高職畢業</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  const renderSkills = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
              <Wrench size={22} />
            </div>
            <h2 className="text-[18px] font-bold text-[#343a40]">專業技能與核心組成</h2>
          </div>

          <div className="space-y-4">
            {skillsList.map((skill) => {
            const Icon = skillIcons[skill.icon] || Wrench;

            return (
              <motion.div 
                key={skill.id} 
                layout
                className="border-2 border-[#e9ecef] rounded-xl p-5 hover:border-[#3d7a5a] transition-all bg-white group relative"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0 group-hover:bg-[#3d7a5a] group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#343a40]">{skill.title}</h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map(lv => (
                        <Star 
                          key={lv} 
                          size={10} 
                          className={lv <= skill.level ? 'text-yellow-400' : 'text-[#e9ecef]'} 
                          fill={lv <= skill.level ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-[#6c757d] leading-relaxed mb-4">{skill.desc}</p>
                
                <div className="space-y-3">
                  <div className="bg-[#f8f9fa] rounded-lg p-3 border border-[#e9ecef]">
                    <div className="text-[12px] font-bold text-[#adb5bd] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers size={12} /> 核心組成與子技能
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.subSkills.map((sub: string, j: number) => (
                        <span key={j} className="flex items-center gap-1 text-[12px] text-[#495057] bg-white border border-[#dee2e6] px-2 py-1 rounded-md shadow-sm">
                          <div className="w-1 h-1 rounded-full bg-[#3d7a5a]" />
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {skill.tags.map((tag: string, j: number) => (
                        <span key={j} className="text-[9px] font-bold text-[#3d7a5a] bg-[#e8f5ee] px-2 py-0.5 rounded border border-[#c8d8cf] uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-[#e9ecef]">
          <h2 className="text-[15px] font-bold mb-4 flex items-center gap-3">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center">
                <Cpu size={14} />
              </div>
            </div>
            軟體工具
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 pl-[52px]">
            {[
              { name: 'SolidWorks', logo: 'static/images/solidworks-logo.jpg' },
              { name: 'Creo', logo: 'static/images/creo-logo.png' },
              { name: 'KeyShot', logo: 'static/images/keyshot-logo.jpg' },
              { name: 'Illustrator', logo: 'static/images/illustrator-logo.jpg' },
              { name: 'Photoshop', logo: 'static/images/photoshop-logo-2015.jpg' },
              { name: 'InDesign', logo: 'static/images/adobe-indesign-logo.png' },
              { name: 'AutoCAD', logo: 'static/images/autocad-logo-1.jpg' }
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border-2 border-[#e9ecef] bg-white hover:border-[#3d7a5a] transition-colors">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0 border border-[#e9ecef] overflow-hidden relative group">
                  <img src={t.logo} alt={t.name} className="w-full h-full object-contain p-0.5" referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm font-semibold text-[#343a40]">{t.name}</span>
              </div>
            ))}
          </div>
          
          <h2 className="text-[15px] font-bold mb-4 flex items-center gap-3">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center">
                <Palette size={14} />
              </div>
            </div>
            語言能力
          </h2>
          <div className="flex flex-wrap gap-1.5 pl-[52px]">
            {['中文（母語）', '英文（工作應用）', '台語'].map((t, i) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.05, y: -1 }}
                className="bg-[#f1f3f5] border-2 border-[#e9ecef] text-[#6c757d] text-xs px-3 py-1 rounded-full font-medium transition-colors hover:bg-[#e8f5ee] hover:border-[#3d7a5a] hover:text-[#3d7a5a] cursor-default"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderProjects = () => {
    const SUBCATS: Record<string, { id: string, label: string }[]> = {
      packaging: [
        { id: 'all', label: '全部包裝' },
        { id: 'ce', label: '消費性電子產品' },
        { id: 'bike', label: '自行車零件' }
      ],
      product: [
        { id: 'all', label: '全部產品' },
        { id: 'appliance', label: '廚電/家電' },
        { id: 'medical', label: '醫療/穿戴' },
        { id: 'toy', label: '玩具設計' },
        { id: 'sketch', label: '手繪作品' }
      ],
      graphic: [
        { id: 'all', label: '全部平面' },
        { id: 'branding', label: '品牌/CIS' }
      ]
    };

    const toggleSubCat = (id: string) => {
      if (id === 'all') {
        setActiveProjSubCats(['all']);
        return;
      }
      
      setActiveProjSubCats(prev => {
        const withoutAll = prev.filter(x => x !== 'all');
        if (prev.includes(id)) {
          const next = withoutAll.filter(x => x !== id);
          return next.length === 0 ? ['all'] : next;
        } else {
          return [...withoutAll, id];
        }
      });
    };

    const getCount = (subcatId: string) => {
      let base = activeProjCat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === activeProjCat);
      if (subcatId === 'all') return base.length;
      return base.filter(p => p.subcat === subcatId).length;
    };

    return (
      <div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.entries(CATS).map(([key, cat]) => {
            const Icon = cat.icon;
            const count = key === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.cat === key).length;
            return (
              <motion.button 
                key={key}
                onClick={() => {
                  setActiveProjCat(key);
                  setActiveProjSubCats(['all']);
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer border-2 transition-all ${activeProjCat === key ? 'bg-[#e8f5ee] border-[#3d7a5a] text-[#3d7a5a] shadow-sm' : 'border-[#e9ecef] text-[#6c757d] bg-white hover:border-[#3d7a5a] hover:text-[#3d7a5a]'}`}
              >
                <Icon size={14} />
                {cat.label}
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeProjCat === key ? 'bg-[#3d7a5a] text-white' : 'bg-[#f1f3f5] text-[#adb5bd]'}`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {activeProjCat !== 'all' && SUBCATS[activeProjCat] && (
          <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1 no-scrollbar">
            <div className="flex gap-2 shrink-0">
              {SUBCATS[activeProjCat].map((subcat) => (
                <motion.button 
                  key={subcat.id}
                  onClick={() => toggleSubCat(subcat.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all whitespace-nowrap ${activeProjSubCats.includes(subcat.id) ? 'bg-[#3d7a5a] border-[#3d7a5a] text-white shadow-sm' : 'border-[#e9ecef] text-[#6c757d] bg-white hover:border-[#3d7a5a] hover:text-[#3d7a5a]'}`}
                >
                  {subcat.label}
                  <span className={`ml-1 text-[9px] opacity-70`}>({getCount(subcat.id)})</span>
                  {activeProjSubCats.includes(subcat.id) && subcat.id !== 'all' && <X size={10} className="ml-0.5" />}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => {
              return (
                <motion.div 
                  key={p.id} 
                  onClick={() => setLightboxProj(p)} 
                  whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                  className="rounded-xl overflow-hidden border-2 border-[#e9ecef] transition-all cursor-pointer hover:border-[#3d7a5a] flex flex-col bg-white"
                >
                  <div className="h-[200px] sm:h-[240px] overflow-hidden bg-white flex items-center justify-center relative group">
                    {p.images && p.images.length > 0 ? (
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                        loading="lazy"
                      />
                    ) : (
                      <ProjectPlaceholder id={p.id} cat={p.cat} />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold mb-1">{p.title}</h3>
                    <p className="text-xs text-[#adb5bd] leading-relaxed">{p.short}</p>
                    <div className="flex flex-wrap gap-1 mt-auto pt-2">
                      {p.tags.map(t => <span key={t} className="text-[11px] bg-[#e8f5ee] text-[#3d7a5a] px-2 py-0.5 rounded-md font-semibold">{t}</span>)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-[#f8f9fa] rounded-2xl border-2 border-dashed border-[#e9ecef]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#adb5bd] shadow-sm">
                <Search size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#343a40] mb-1">找不到相關專案</h3>
              <p className="text-xs text-[#adb5bd]">請嘗試調整搜尋關鍵字或篩選條件</p>
              <button 
                onClick={() => { setProjSearch(''); setActiveProjSubCats(['all']); }}
                className="mt-4 text-xs text-[#3d7a5a] font-bold hover:underline"
              >
                重設所有篩選
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCourses = () => {
    return (
      <div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.entries(COURSE_CATS).map(([key, cat]) => {
            const Icon = cat.icon;
            const count = key === 'all' ? COURSES.length : COURSES.filter(c => c.cat === key).length;
            return (
              <motion.button 
                key={key}
                onClick={() => setActiveCourseCat(key)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer border-2 transition-all ${activeCourseCat === key ? 'bg-[#e8f5ee] border-[#3d7a5a] text-[#3d7a5a] shadow-sm' : 'border-[#e9ecef] text-[#6c757d] bg-white hover:border-[#3d7a5a] hover:text-[#3d7a5a]'}`}
              >
                <Icon size={14} />
                {cat.label}
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeCourseCat === key ? 'bg-[#3d7a5a] text-white' : 'bg-[#f1f3f5] text-[#adb5bd]'}`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c, i) => {
              const isExpanded = expandedCourse === i;
              return (
                <motion.div 
                  key={i} 
                  layout
                  initial={false}
                  className={`border-2 rounded-xl overflow-hidden transition-all bg-white flex flex-col ${isExpanded ? 'border-[#3d7a5a] shadow-md' : 'border-[#e9ecef] hover:border-[#3d7a5a]'}`}
                >
                  <div 
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => setExpandedCourse(isExpanded ? null : i)}
                  >
                    <div className="w-full sm:w-80 h-48 shrink-0 bg-white rounded-lg flex items-center justify-center text-xl border border-[#e9ecef] overflow-hidden">
                      {c.images && c.images.length > 0 ? (
                        <img src={c.images[0]} alt={c.title} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[10px] font-semibold text-[#adb5bd]">暫無圖片</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-[#343a40]">{c.title}</div>
                          {c.sub && <div className="text-xs text-[#adb5bd] mt-0.5">{c.sub}</div>}
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="text-[#adb5bd]"
                        >
                          <ChevronDown size={18} />
                        </motion.div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="text-xs text-[#3d7a5a] font-semibold flex items-center gap-1">
                          <Target size={12} />
                          {c.org}
                        </div>
                        <div className="text-[11px] text-[#adb5bd] flex items-center gap-1">
                          <Calendar size={12} />
                          {c.date}
                        </div>
                      </div>
                      {c.hours && (
                        <div className="mt-2">
                          <span className="bg-[#e8f5ee] text-[#3d7a5a] text-[10px] px-2 py-0.5 rounded-full font-bold">
                            培訓時長：{c.hours}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-5 pt-2 border-t border-[#f1f3f5] bg-[#fcfdfc]">
                          <div className="space-y-4">
                            <div>
                              <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mb-2">課程簡介</div>
                              <p className="text-xs text-[#6c757d] leading-relaxed">{c.desc}</p>
                            </div>

                            {c.outcomes && c.outcomes.length > 0 && (
                              <div>
                                <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mb-2">學習重點與模組</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                  {c.outcomes.map((outcome, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#e9ecef]">
                                      <div className="w-5 h-5 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
                                        <Check size={10} strokeWidth={3} />
                                      </div>
                                      <span className="text-[12px] text-[#495057] font-medium leading-tight">{outcome}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxCourse({ ...c, index: i });
                                }}
                                className="text-[11px] font-bold text-[#3d7a5a] flex items-center gap-1 hover:underline"
                              >
                                開啟完整詳情 <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-[#f8f9fa] rounded-2xl border-2 border-dashed border-[#e9ecef]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#adb5bd] shadow-sm">
                <Search size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#343a40] mb-1">找不到相關課程</h3>
              <p className="text-xs text-[#adb5bd]">請嘗試調整搜尋關鍵字或篩選條件</p>
              <button 
                onClick={() => { setCourseSearch(''); setActiveCourseCat('all'); }}
                className="mt-4 text-xs text-[#3d7a5a] font-bold hover:underline"
              >
                重設所有篩選
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInterests = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {INTERESTS.map((int, i) => {
        const Icon = int.icon;
        return (
          <motion.div 
            key={i} 
            onClick={() => setLightboxProj({ id: int.id, title: int.title, desc: int.desc, images: int.image ? [int.image] : [], tags: int.emojis, cat: 'interest', short: int.goal } as any)}
            whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className="border-2 border-[#e9ecef] rounded-xl overflow-hidden transition-all hover:border-[#3d7a5a] flex flex-col bg-white cursor-pointer"
          >
            <div className="h-[280px] bg-white flex items-center justify-center text-4xl relative overflow-hidden">
              {int.image ? (
                <img src={int.image} alt={int.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" referrerPolicy="no-referrer" />
              ) : (
                int.emojis[0]
              )}
              <div className="absolute right-2 bottom-2 opacity-10">
                <Icon size={48} />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="text-sm font-bold">{int.title}</div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs text-[#3d7a5a] font-semibold whitespace-pre-line leading-relaxed">
                  {int.goal}
                </div>

                <div className="text-xs text-[#6c757d] leading-loose">
                  {int.desc}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-[#343a40] font-sans">
      {/* Top Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-[#e9ecef] shadow-sm">
        <div className="max-w-[2100px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            <div className="hidden lg:block w-[280px] shrink-0"></div>
            <div className="w-full lg:max-w-[1200px] flex-1 flex md:justify-center">
              <nav className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1.5 px-4 py-4 text-[0.85rem] cursor-pointer border-b-[3px] -mb-[2px] whitespace-nowrap transition-all font-medium relative ${isActive ? 'text-[#3d7a5a] border-[#3d7a5a] font-bold' : 'text-[#6c757d] border-transparent hover:text-[#3d7a5a]'}`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {tab.label}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3d7a5a]"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
            <div className="hidden xl:block w-[280px] shrink-0"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[2100px] mx-auto w-full items-start p-4 sm:p-8 justify-center">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 bg-white rounded-2xl shadow-sm p-7 lg:sticky lg:top-24">
          <motion.div 
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-[120px] h-[120px] rounded-full bg-[#f1f3f5] mx-auto mb-4 overflow-hidden border-[4px] border-[#e8f5ee] flex items-center justify-center cursor-default shadow-md z-10 relative"
          >
            <AvatarSVG />
          </motion.div>
          
          <h1 className="text-center text-[1.2rem] font-bold">賴以婕 Amanda</h1>
          <p className="text-center text-[#6c757d] text-[0.82rem] mt-1">工業設計師 / 包裝工程師</p>
          <div className="flex items-center justify-center gap-1 text-[#adb5bd] text-[0.78rem] mt-2 mb-4">
            <MapPin size={12} />
            台灣, 台中
          </div>
          <div className="h-px bg-[#e9ecef] mb-4"></div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">目前狀態</span>
            <span className="bg-[#e8f5ee] text-[#3d7a5a] text-[0.72rem] px-2.5 py-0.5 rounded-full font-semibold">開放中</span>
          </div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">電子郵件</span>
            <span className="font-semibold text-[0.74rem]">amanda840604@gmail.com</span>
          </div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">聯絡電話</span>
            <span className="font-semibold text-[0.74rem]">0918-190-990</span>
          </div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">LINE</span>
            <motion.a 
              href="https://line.me/ti/p/fk-CFFKYiU" 
              target="_blank" 
              rel="noreferrer" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-bold text-[0.7rem] text-[#3d7a5a] bg-[#e8f5ee] px-3 py-1 rounded-full border border-[#c8d8cf] hover:bg-[#3d7a5a] hover:text-white transition-colors"
            >
              加為好友
            </motion.a>
          </div>
        </aside>
        
        {/* Content */}
        <main className="flex-1 w-full lg:max-w-[1200px] bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Panels */}
          <div className="p-5 sm:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'about' && renderAbout()}
                {activeTab === 'exp' && renderExperience()}
                {activeTab === 'skills' && renderSkills()}
                {activeTab === 'projects' && renderProjects()}
                {activeTab === 'courses' && renderCourses()}
                {activeTab === 'interests' && renderInterests()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Right Spacer for Centering */}
        <div className="hidden xl:block w-[280px] shrink-0"></div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {(lightboxProj || lightboxCourse) && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 sm:p-8" onClick={(e) => { if (e.target === e.currentTarget) { setLightboxProj(null); setLightboxCourse(null); } }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-6xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#e9ecef]">
                <h2 className="text-[15px] font-bold">{lightboxProj ? lightboxProj.title : lightboxCourse.title}</h2>
                <motion.button 
                  onClick={() => { setLightboxProj(null); setLightboxCourse(null); }} 
                  whileTap={{ scale: 0.9 }}
                  className="text-[#6c757d] p-1.5 rounded-md hover:bg-[#f1f3f5] transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="overflow-y-auto p-4 flex flex-col gap-3">
                {lightboxProj && (
                  <div className="flex flex-col gap-6">
                    {lightboxProj.images && lightboxProj.images.length > 0 ? (
                      lightboxProj.images.map((img: string, idx: number) => (
                        <div key={idx} className={`w-full bg-white rounded-xl overflow-hidden flex justify-center p-2 sm:p-4 border border-[#e9ecef] ${lightboxProj.cat === 'interest' ? 'max-w-[50%] mx-auto' : ''}`}>
                          <img 
                            src={img} 
                            alt={`${lightboxProj.title} - ${idx + 1}`} 
                            className="max-w-full h-auto object-contain block shadow-sm rounded-lg" 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="h-[400px] rounded-2xl overflow-hidden border-2 border-dashed border-[#dee2e6]">
                        <ProjectPlaceholder id={lightboxProj.id} cat={lightboxProj.cat} />
                      </div>
                    )}
                  </div>
                )}
                {lightboxCourse && (
                  <div className="flex flex-col gap-6">
                    {lightboxCourse.images && lightboxCourse.images.length > 0 ? (
                      lightboxCourse.images.map((img: string, idx: number) => (
                        <div key={idx} className="w-full bg-white rounded-xl overflow-hidden flex justify-center p-2 sm:p-4 border border-[#e9ecef]">
                          <img 
                            src={img} 
                            alt={`${lightboxCourse.title} - ${idx + 1}`} 
                            className="max-w-full h-auto object-contain block shadow-sm rounded-lg" 
                          />
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center h-[300px] flex items-center justify-center bg-white rounded-lg text-[#adb5bd] font-semibold border-2 border-dashed border-[#dee2e6]">
                        尚未上傳照片
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="px-5 pb-5 text-sm text-[#6c757d] leading-relaxed border-t border-[#e9ecef] pt-4 shrink-0">
                <p>{lightboxProj ? lightboxProj.desc : lightboxCourse.desc}</p>
                
                {lightboxCourse && lightboxCourse.outcomes && (
                  <div className="mt-4">
                    <h4 className="text-[#3d7a5a] font-bold mb-2 flex items-center gap-2">
                      <Target size={14} /> 學習重點與模組
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lightboxCourse.outcomes.map((outcome: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#e9ecef]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3d7a5a] shrink-0" />
                          <span className="text-[12px] leading-tight">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {lightboxProj && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {lightboxProj.tags.map((t: string) => <span key={t} className="text-[11px] bg-[#e8f5ee] text-[#3d7a5a] px-2 py-0.5 rounded-md font-semibold">{t}</span>)}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

