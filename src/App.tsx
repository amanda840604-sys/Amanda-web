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
  all: { label: 'All', icon: LayoutGrid },
  packaging: { label: 'Packaging', icon: Package },
  product: { label: 'Product', icon: Box },
  graphic: { label: 'Graphic', icon: PenTool }
};

const INITIAL_SKILLS = [
  { 
    id: 1,
    title: 'Market Research & Positioning Analysis', 
    icon: 'Search', 
    desc: 'Expert in competitive research and brand positioning analysis to define design directions.', 
    subSkills: ['Competitive Analysis', 'Product Strategy', 'Product Positioning', 'Market Data Analysis', 'Proposal Writing'],
    tags: ['Market Research', 'Strategy'],
    level: 5
  },
  { 
    id: 2,
    title: '2D Brand Visual Integration & Presentation', 
    icon: 'Palette', 
    desc: 'Skilled in integrating packaging structure with brand identity to create professional proposals.', 
    subSkills: ['Adobe InDesign', 'Illustrator', 'Photoshop', 'Layout Design', 'Print Knowledge', 'Pre-press Design'],
    tags: ['Graphic Design', 'Branding'],
    level: 4
  },
  { 
    id: 3,
    title: '3D Modeling & Structural Simulation', 
    icon: 'Cpu', 
    desc: 'Capable of rapid 3D modeling and assembly simulation to bridge design and engineering.', 
    subSkills: ['Creo', 'SolidWorks', 'Rhino', 'Keyshot', 'Structural Evaluation', '3D Rendering'],
    tags: ['3D Modeling', 'Engineering'],
    level: 5
  },
  { 
    id: 4,
    title: 'Packaging Material Selection & BOM Creation', 
    icon: 'ClipboardList', 
    desc: 'Familiar with blister, corrugated, and pulp tray materials to propose optimized solutions.', 
    subSkills: ['Corrugated Structure', 'Material Selection', 'Engineering Drawings', 'BOM Creation'],
    tags: ['Packaging', 'BOM'],
    level: 4
  },
  { 
    id: 5,
    title: 'Prototyping & Design Validation', 
    icon: 'Hammer', 
    desc: 'Proficient in using sample cutters for structural simulation and rapid prototyping.', 
    subSkills: ['Sample Cutter Operation', 'Structural Simulation', 'Rapid Prototyping', 'Design Validation', 'CMF Sampling'],
    tags: ['Prototyping', 'Validation'],
    level: 5
  }
];

const PROJECTS = [
  {id:'hood',cat:'product',subcat:'appliance',title:'Range Hood Design',short:'Slim Euro-style & Side-suction Series',desc:'Designed slim Euro-style (2020) and side-suction (2022) range hoods for SAKURA. Covered ID, CMF, engineering drawings, and mass production validation.',tags:['Product Design','Kitchen Appliance','SAKURA'], images: ['/hood_euro01.jpg', '/hood_euro02.jpg', '/hood_side_suction.jpg']},
  {id:'gas',cat:'product',subcat:'appliance',title:'Gas Stove Design',short:'Built-in Gas Stove Industrial Design',desc:'Industrial design for built-in gas stoves, emphasizing HMI and safety structure integration. Completed CMF for knobs, grates, and glass panels.',tags:['Product Design','Home Appliance'], images: ['/stove_easy_clean.jpg']},
  {id:'wearable',cat:'product',subcat:'medical',title:'Wearable Device Design',short:'Sleep Monitoring Smart Wristband',desc:'Sleep monitoring wristband design, integrating sensor modules and comfortable wearable structures. Completed CMF and exploded view output.',tags:['Wearable','Medical'], images: ['/wearable01.jpg', '/wearable02.jpg', '/wearable03.jpg', '/wearable04.jpg']},
  {id:'medical',cat:'product',subcat:'medical',title:'Medical Equipment Design',short:'TENS / Nebulizer / SPO2 Wristband',desc:'Includes ID proposals for 2 TENS devices, a pediatric nebulizer, and 5 SPO2 wristbands. Completed ID, exploded views, and engineering specs.',tags:['Medical Device','Industrial Design'], images: ['/medical02.jpg']},
  {id:'toy',cat:'product',subcat:'toy',title:'Toy Design',short:'Educational Toy Series',desc:'Educational toy series design, including character modeling, structural assembly, and safety material planning.',tags:['Toy Design','CMF'], images: ['/toy_design.jpg']},
  {id:'sketch',cat:'product',subcat:'sketch',title:'Sketch Portfolio',short:'Figure Sketch / Product Sketch / Concept Art',desc:'Figure sketches, product sketches, and concept illustrations demonstrating design thinking and hand-drawing skills.',tags:['Sketch','Illustration'], images: ['/sketch.jpg']},
  {id:'tws_card',cat:'packaging',subcat:'ce',title:'TWS Card Inner Design',short:'TWS Earphone Card Inner Solutions',desc:'Developed card inner structures for TWS earphone series, creating a modular design database.',tags:['Packaging Design','TWS','Cardboard'], images: ['/tws_card_inner01.png', '/tws_card_inner02.png', '/tws_card_inner03.png', '/tws_card_inner04.png', '/tws_card_inner05.png', '/tws_card_inner06.png', '/tws_card_inner07.png', '/tws_card_inner08.png', '/tws_card_inner09.png', '/tws_card_inner10.png', '/tws_card_inner11.png', '/tws_card_inner12.png']},
  {id:'tws_pkg',cat:'packaging',subcat:'ce',title:'TWS Packaging Design',short:'Complete TWS Earphone Packaging',desc:'Designed complete packaging for international TWS brands, including outer boxes, inner structures, and printing specs.',tags:['Packaging Design','Consumer Electronics'], images: ['/tws_package_design01.jpg', '/tws_package_design02.jpg']},
  {id:'hdt_card',cat:'packaging',subcat:'ce',title:'HDT Card Inner Design',short:'Gaming Headset Packaging Structures',desc:'HDT gaming headset card inner design, providing multiple comparison options for RFQ proposals.',tags:['Packaging Design','HDT'], images: ['/hdt_card01.jpg', '/hdt_card02.jpg', '/hdt_card03.jpg', '/hdt_card04.jpg', '/hdt_card05.jpg', '/hdt_card06.jpg', '/hdt_card07.jpg', '/hdt_card08.jpg', '/hdt_card09.jpg', '/hdt_card10.jpg', '/hdt_card11.jpg', '/hdt_card12.jpg', '/hdt_card13.jpg', '/hdt_card14.jpg']},
  {id:'soundbar_card',cat:'packaging',subcat:'ce',title:'Soundbar Card Inner Design',short:'Soundbar Packaging Inner Structures',desc:'Soundbar card inner structural design, considering product dimensions and drop protection.',tags:['Packaging Design','Soundbar'], images: ['/soundbar_card_inner01.png', '/soundbar_card_inner02.png', '/soundbar_card_inner03.png', '/soundbar_card_inner04.jpg', '/soundbar_card_inner05.jpg', '/soundbar_card_inner06.jpg', '/soundbar_card_inner07.jpg', '/soundbar_card_inner08.jpg']},
  {id:'soundbar_pkg',cat:'packaging',subcat:'ce',title:'Soundbar Packaging Design',short:'Soundbar Overall Packaging Solution',desc:'Speaker Packaging Design using Harvest Foam Dry-Pressed Pulp Tray, integrating eco-friendly materials.',tags:['Packaging Design','Sustainability','Soundbar'], images: ['/soundbar_design01.jpg']},
  {id:'webcam',cat:'packaging',subcat:'ce',title:'Webcam Packaging Design',short:'Webcam Packaging Design',desc:'Webcam packaging design using Black Wet-Pressed Pulp Tray for protection and sustainability.',tags:['Packaging Design','Pulp Tray'], images: ['/webcam01.jpg', '/webcam02.jpg']},
  {id:'carrycase',cat:'packaging',subcat:'bike',title:'Carrycase Bag Design',short:'Storage Bag Structural Design',desc:'Bicycle parts storage bag design, considering multi-SKU sharing and modular packaging platforms.',tags:['Packaging Design','Bicycle'], images: ['/carrycase01.jpg']},
  {id:'mtb',cat:'packaging',subcat:'bike',title:'MTB Handle Bar Packaging',short:'MTB Handle Bar Packaging Design',desc:'MTB Handle Bar packaging design, including transport test validation and mass production specs.',tags:['Packaging Design','Bicycle','Handle Bar'], images: ['/mtb_handle_bar01.jpg', '/mtb_handle_bar02.jpg', '/mtb_handle_bar03.jpg', '/mtb_handle_bar04.png', '/mtb_handle_bar05.png', '/mtb_handle_bar06.png']},
  {id:'tr',cat:'packaging',subcat:'bike',title:'TR Handle Bar Packaging',short:'TR Handle Bar Packaging Design',desc:'TR Handle Bar packaging structural design, from luggage solutions to base base integration.',tags:['Packaging Design','Bicycle'], images: ['/tr_handle_bar01.jpg', '/tr_handle_bar02.jpg', '/tr_handle_bar03.jpg', '/tr_handle_bar04.jpg', '/tr_handle_bar05.jpg', '/tr_handle_bar06.png', '/tr_handle_bar07.png', '/tr_handle_bar08.png']},
  {id:'ra',cat:'packaging',subcat:'bike',title:'RA Handle Bar Packaging',short:'RA Handle Bar Packaging Design',desc:'RA Handle Bar series packaging design, covering transport, display, and production specs.',tags:['Packaging Design','Bicycle'], images: ['/ra_handle_bar01.png', '/ra_handle_bar02.png', '/ra_handle_bar03.png', '/ra_handle_bar04.png', '/ra_handle_bar05.png', '/ra_handle_bar06.png', '/ra_handle_bar07.png']},
  {id:'seatpost',cat:'packaging',subcat:'bike',title:'Seatpost Packaging Design',short:'Seatpost Packaging Structural Design',desc:'Bicycle seatpost packaging design, developing all-paper cushioning for long parts.',tags:['Packaging Design','Bicycle','Plastic-free'], images: ['/seatpost01.jpg', '/seatpost02.jpg', '/seatpost03.jpg', '/seatpost04.jpg', '/seatpost05.jpg', '/seatpost06.jpg', '/seatpost07.jpg', '/seatpost08.jpg', '/seatpost09.jpg']},
  {id:'steerer',cat:'packaging',subcat:'bike',title:'Steerer Packaging Design',short:'Steerer Packaging Structural Design',desc:'Steerer packaging design, developing lightweight and recyclable material solutions.',tags:['Packaging Design','Bicycle'], images: ['/steerer01.jpg', '/steerer02.jpg', '/steerer03.jpg', '/steerer04.jpg', '/steerer05.jpg']},
  {id:'quickrelease',cat:'packaging',subcat:'bike',title:'Quick Release Packaging',short:'Quick Release Packaging Design',desc:'Small parts packaging design for quick release, balancing protection and retail display.',tags:['Packaging Design','Bicycle'], images: ['/quickrelease01.jpg', '/quickrelease02.jpg', '/quickrelease03.jpg', '/quickrelease04.jpg']},
  {id:'graphic',cat:'graphic',subcat:'branding',title:'Graphic Design',short:'Branding CIS / Poster / Identity',desc:'Brand Visual Identity System (CIS), poster design, and corporate identity materials.',tags:['Branding','Graphic','CIS'], images: ['/poster_design.jpg']}
];

const COURSES = [
  {
    cat: 'packaging', 
    title:'Packaging Structure Design & Cost Optimization',
    sub:'',
    org:'Plastics Industry Development Center',
    date:'2026.03.26',
    hours:'48 Hours',
    desc:'Focuses on structural design, transport testing, and cost optimization methods for packaging.',
    outcomes: ['Structural Analysis', 'ISTA Testing Standards', 'Cost Estimation', 'Sustainable Materials'],
    images: ['/course-packaging.png', '/course-packaging-photo.jpg']
  },
  {
    cat: 'ai', 
    title:'AI Talent Cultivation Program',
    sub:'',
    org:'Ministry of Economic Affairs',
    date:'2025.12.09 – 2025.12.17',
    hours:'30 Hours',
    desc:'Covers AI fundamentals, machine learning theories, and generative AI applications.',
    outcomes: ['ML Fundamentals', 'GenAI Principles', 'Industry Case Studies', 'Model Evaluation'],
    images: ['/course-ai-talent.png']
  },
  {
    cat: 'ai', 
    title:'iPAS AI Application Planner Certificate',
    sub:'',
    org:'China Productivity Center',
    date:'2026.04.26',
    hours:'48 Hours',
    desc:'Systematic learning of AI implementation and planning. (In training, certificate pending)',
    outcomes: ['AI Scenario Planning', 'Digital Transformation', 'AI Tool Integration', 'Exam Preparation'],
    images: ['/ipas-ai-planning-cert.jpg']
  },
  {
    cat: 'ai', 
    title:'AI Application Practice (NUVA)',
    sub:'ChatGPT LV.1 & MAKE LV.1',
    org:'NUVA',
    date:'2025.03 – 2025.04',
    hours:'16 Hours',
    desc:'Learning AI bot creation and LINE official account integration for automation.',
    outcomes: ['ChatGPT Prompting', 'MAKE Automation', 'LINE Bot Integration', 'AI Content Strategy'],
    images: ['/chat-gpt-lv1.jpg', '/make-lv1.jpg', '/nuva-group-photo.jpg']
  },
  {
    cat: 'ai', 
    title:'iPAS AI Application Planner Basic Training',
    sub:'',
    org:'Ministry of Economic Affairs',
    date:'2026.03.22',
    hours:'15 Hours',
    desc:'Basic AI application and planning in commercial scenarios.',
    outcomes: ['AI Fundamentals', 'Scenario Analysis', 'Implementation Practice', 'Case Studies'],
    images: ['/ipas-ai-planning-basic.jpg']
  }
];

const COURSE_CATS = {
  all: { label: '全部', icon: LayoutGrid },
  ai: { label: 'AI應用課程', icon: BrainCircuit },
  packaging: { label: '包裝專業課程', icon: Archive }
};

const EXP_DATA = [
  {
    role:'Packaging Engineer', co:'Merry Electronics Co., Ltd.', period:'2022/7 – 2025/05・2 yrs 11 mos',
    loc:'Taichung, Taiwan・Consumer Electronics 500+ employees',
    logo: '/merry-logo.jpg',
    duties:['Consumer electronics packaging development and structural design','Engineering drawings and packaging process documentation','Supplier sample tracking and quality improvement'],
    results:[
      'TWS / HDT / Soundbar packaging proposals for international brands (25+ projects)',
      'Proposed multi-tier packaging solutions based on product positioning, achieving 40% win rate',
      'Led structural design and cost analysis during RFQ, saving approx. 10% in material costs'
    ],
    tags:['Creo','Product Development','CAD','Structural Evaluation','Packaging Design']
  },
  {
    role:'Product Designer', co:'Taiwan Sakura Corporation', period:'2020/3 – 2022/7・2 yrs 5 mos',
    loc:'Taichung, Taiwan・Kitchen Appliances 500+ employees',
    logo: '/sakura-logo.png',
    duties:['Market planning and design direction based on consumer research','Cross-functional collaboration','Kitchen appliance market and design trend research'],
    results:[
      '2021 Outstanding Employee Award',
      'Product development and market launch experience',
      'Led the launch of G2522AG & G2623AG gas stoves, optimizing cleaning design and knob aesthetics'
    ],
    tags:['Creo','Photoshop','Illustrator','KeyShot','Design Tools']
  },
  {
    role:'Product Designer', co:'EMG Technology Co., Ltd.', period:'2018/11 – 2019/12・1 yr 2 mos',
    loc:'Taichung, Taiwan・Medical Devices 30–100 employees',
    logo: '/emg-logo.png',
    duties:['New product proposals and presentations','ID proposals based on RD modules, including visual, material, and styling','Industrial design for medical products'],
    results:[
      '2 TENS device ID proposals',
      'Pediatric nebulizer ID proposal',
      '5 SPO2 wristband ID proposals'
    ],
    tags:['SolidWorks','Illustrator','Photoshop','KeyShot','Mechanical Design','Styling']
  },
  {
    role:'Product Designer', co:'CIC Co., Ltd.', period:'2017/8 – 2018/8・1 yr 1 mo',
    loc:'New Taipei City, Taiwan・Design Services 30–100 employees',
    logo: '/cic-logo.png',
    duties:['New product proposals and presentations','ID proposals based on RD modules','Industrial design and styling'],
    results:[
      'Led aluminum product design for GAKKEN (Japan)',
      'Developed all-in-one solar products & packaging design',
      'Assisted in color configuration for 12-in-1 solar products'
    ],
    tags:['Illustrator','Photoshop','Product Design','Packaging Design','KeyShot']
  }
];

const INTERESTS = [
  { id: 'gym', title: 'Weight Training', icon: Dumbbell, goal: 'Currently 2 sessions/week,\nGoal: 4 sessions/week!', desc: 'Training endurance and discipline, persisting in every small progress to challenge a stronger self.', emojis: ['🏋️', '💪', '🏃', '⚡'], image: '/gym.jpg' },
  { id: 'marathon', title: 'Marathon', icon: Timer, goal: '5 Half-marathons completed,\nGoal: First Full Marathon!', desc: 'With 5 half-marathon experiences, I aim to challenge my first full marathon—not just for fitness, but as a test of conviction!', emojis: ['🏅', '🎽', '🏃‍♀️', '🥇'], image: '/marathon.jpg' },
  { id: 'hiking', title: 'Hiking', icon: Mountain, goal: '2 Baiyue peaks reached,\nGoal: Continue the Baiyue challenge!', desc: 'Beyond fitness and long-distance running, I love the challenge of mountain climbing, having successfully summitted two of Taiwan\'s Baiyue peaks.', emojis: ['⛰️', '🌄', '🥾', '🗻'], image: '/hiking.jpg' }
];

const TABS = [
  { id: 'about', label: 'About', icon: User },
  { id: 'exp', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: Grid },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'interests', label: 'Interests', icon: Heart },
];

const AvatarSVG = () => (
  <img 
    src="/profile.jpg" 
    alt="Amanda Lai" 
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
      {/* About Amanda Lai */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <User size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">About Amanda Lai</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Layers size={14} />
                </div>
              </div>
              Design Background & Development Experience
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Graduated from National Taiwan University of Science and Technology (NTUST) in Industrial Design. 6 years of experience in product and packaging design, familiar with the full development process from ID to mass production.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Expert in market research, positioning analysis, and 2D/3D design planning. Proficient in prototyping, modeling, and engineering drawings with the flexibility to adjust strategies based on budget and cost constraints.</span>
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
              Packaging Design Specialization
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Formerly at Merry Electronics, responsible for TWS, HDT, and Soundbar packaging for international brands. Strengthened skills in eco-friendly structure design and cross-functional project execution.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Currently at JD Components, focusing on bicycle part packaging innovation. Dedicated to developing all-paper cushioning and plastic-free solutions to achieve low-carbon sustainability goals.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design & Development Practice */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Design & Development Practice</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-3 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Box size={14} />
                </div>
              </div>
              Packaging Design
            </h3>
            <div className="space-y-4 pl-[52px]">
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  International TWS/HDT/Soundbar Packaging Proposals (25+ projects)
                </div>
                <div className="text-sm leading-relaxed text-[#6c757d] pl-[22px] space-y-2">
                  <p>Proposed multi-tier (low/mid/high) packaging solutions based on product positioning to meet diverse market needs and brand strategies.</p>
                  <p>Led structural design and cost analysis during RFQ for consumer electronics, helping R&D achieve approx. 10% savings in material costs.</p>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  Created Packaging Design Databases & Market Research (6+ projects)
                </div>
                <p className="text-sm leading-relaxed text-[#6c757d] pl-[22px]">Compiled specs for TWS, HDT, and Soundbar card inners into a modular database, accelerating proposal efficiency and market alignment.</p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#343a40] mb-2 flex items-start gap-2">
                  <ArrowRight size={14} className="mt-0.5 text-[#3d7a5a] shrink-0" />
                  Participated in HDT Gaming Headset Development (2 projects)
                </div>
                <p className="text-sm leading-relaxed text-[#6c757d] pl-[22px]">Involved in the development of two HyperX headset models, gaining experience from structural design and sampling to mass production.</p>
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
              Product Design
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Led the full development of easy-clean gas stoves and side-suction hoods.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Managed Golden Pin Design Award submissions with 2 entries selected (R3750B, P0233/235).</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Assisted in ID and structural development for mass production (e.g., R3750B).</span>
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
              Cross-functional & Supplier Collaboration
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Close collaboration with suppliers and factories to ensure smooth production and quality stability.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Goals */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Target size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Career Goals</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-3 flex items-center gap-3">
              <div className="w-10 flex justify-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                  <Flag size={14} />
                </div>
              </div>
              Short-term Goals
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Deep dive into ESG sustainability, exploring CMF characteristics and processing technologies for paper and fabrics. Build a knowledge base and collaborate with suppliers for eco-friendly materials.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Strengthen paper structural design capabilities with the goal of filing innovative design patents.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Develop cost assessment skills for paper materials to propose structural optimizations that balance protection and cost-effectiveness.</span>
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
              Mid-to-Long-term Goals
            </h3>
            <div className="space-y-3 pl-[52px]">
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Accumulate international and cross-functional collaboration experience, strengthening English communication for global work environments.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Continue improving design implementation and manufacturing collaboration through more practical development projects.</span>
              </div>
              <div className="flex gap-2 items-start text-sm leading-relaxed text-[#6c757d]">
                <ArrowRight size={14} className="mt-1 text-[#3d7a5a] shrink-0" />
                <span>Build sensitivity to packaging trends and market shifts, integrating marketing perspectives to become a strategic design and development professional.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Philosophy */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Lightbulb size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Design Philosophy</h2>
        </div>
        <ol className="flex flex-col gap-4 mt-2">
          {[
            'Design should balance emotion and reason: Design is not just about visual and emotional value; it must consider manufacturing feasibility, technical constraints, cost control, and quality stability.',
            'Design must serve the product and user experience: I value the essence of the product, focusing on how design practically improves user convenience and brand value.',
            'Value cross-functional collaboration and communication efficiency: Great design comes from great collaboration. I enjoy working with different roles to integrate needs and resources.',
            'Maintain passion and learning momentum: For me, design is a continuous process of exploration. I remain passionate and curious, eager to contribute and grow with my team.'
          ].map((text, i) => {
            const [bold, rest] = text.split(': ');
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

      {/* Interests & Hobbies */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Heart size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Interests & Hobbies</h2>
        </div>
        
        <div>
          <h3 className="text-[15px] font-bold text-[#3d7a5a] mb-2 flex items-center gap-3">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                <Dumbbell size={14} />
              </div>
            </div>
            Sports & Training
          </h3>
          <p className="text-sm leading-relaxed text-[#6c757d] pl-[52px]">
            Outside of work, I am passionate about challenging sports like fitness, marathons, and hiking.<br/><br/>
            These activities help me maintain physical and mental health while teaching me goal-setting and perseverance. Sports serve as a path for self-discovery and stress relief, deeply influencing my work ethic and resilience.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a]">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <Check size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Conclusion</h2>
        </div>
        
        <div className="bg-[#e8f5ee] p-4 rounded-xl text-[#3d7a5a] text-sm leading-relaxed font-medium text-left">
          Thank you very much for reading. Please feel free to contact me for further information.<br/>
          I look forward to the opportunity for a formal interview to bring my passion and expertise to your team.
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
          <h2 className="text-[18px] font-bold text-[#343a40]">Work Experience</h2>
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
                        Key Responsibilities
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
                        Key Achievements
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

      {/* Education */}
      <div className="border-2 border-[#e9ecef] bg-white rounded-xl p-5 transition-all hover:border-[#3d7a5a] mt-8">
        <div className="flex items-center gap-3 mb-4 border-b border-[#e9ecef] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f5ee] text-[#3d7a5a] flex items-center justify-center shrink-0">
            <GraduationCap size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#343a40]">Education</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#e9ecef] shrink-0 flex items-center justify-center overflow-hidden relative group">
                <img src="/ntust-logo.png" alt="NTUST" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-[#343a40]">National Taiwan University of Science and Technology</div>
              <div className="text-xs text-[#6c757d] mt-0.5">Industrial Design・Bachelor's Degree</div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 flex justify-center shrink-0">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#e9ecef] shrink-0 flex items-center justify-center overflow-hidden relative group">
                <img src="/tcivs-logo.jpg" alt="TCIVS" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-[#343a40]">Taichung Industrial High School</div>
              <div className="text-xs text-[#6c757d] mt-0.5">Graphic Arts・Vocational High School</div>
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
                      <Layers size={12} /> Core Components & Sub-skills
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
            Software Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 pl-[52px]">
            {[
              { name: 'SolidWorks', logo: '/solidworks-logo.jpg' },
              { name: 'Creo', logo: '/creo-logo.png' },
              { name: 'KeyShot', logo: '/keyshot-logo.jpg' },
              { name: 'Illustrator', logo: '/illustrator-logo.jpg' },
              { name: 'Photoshop', logo: '/photoshop-logo-2015.jpg' },
              { name: 'InDesign', logo: '/adobe-indesign-logo.png' },
              { name: 'AutoCAD', logo: '/autocad-logo-1.jpg' }
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
            Languages
          </h2>
          <div className="flex flex-wrap gap-1.5 pl-[52px]">
            {['Chinese (Native)', 'English (Professional)', 'Taiwanese'].map((t, i) => (
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
        { id: 'all', label: 'All Packaging' },
        { id: 'ce', label: 'Consumer Electronics' },
        { id: 'bike', label: 'Bicycle Parts' }
      ],
      product: [
        { id: 'all', label: 'All Products' },
        { id: 'appliance', label: 'Kitchen Appliances' },
        { id: 'medical', label: 'Medical/Wearable' },
        { id: 'toy', label: 'Toy Design' },
        { id: 'sketch', label: 'Sketching' }
      ],
      graphic: [
        { id: 'all', label: 'All Graphic' },
        { id: 'branding', label: 'Branding/CIS' }
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
              <h3 className="text-sm font-bold text-[#343a40] mb-1">No projects found</h3>
              <p className="text-xs text-[#adb5bd]">Try adjusting your search or filters</p>
              <button 
                onClick={() => { setProjSearch(''); setActiveProjSubCats(['all']); }}
                className="mt-4 text-xs text-[#3d7a5a] font-bold hover:underline"
              >
                Reset all filters
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
                            Duration: {c.hours}
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
                              <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mb-2">Course Introduction</div>
                              <p className="text-xs text-[#6c757d] leading-relaxed">{c.desc}</p>
                            </div>

                            {c.outcomes && c.outcomes.length > 0 && (
                              <div>
                                <div className="text-[11px] font-bold text-[#adb5bd] uppercase tracking-wider mb-2">Learning Objectives & Modules</div>
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
                                View Details <ArrowRight size={12} />
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
              <h3 className="text-sm font-bold text-[#343a40] mb-1">No courses found</h3>
              <p className="text-xs text-[#adb5bd]">Try adjusting your search or filters</p>
              <button 
                onClick={() => { setCourseSearch(''); setActiveCourseCat('all'); }}
                className="mt-4 text-xs text-[#3d7a5a] font-bold hover:underline"
              >
                Reset all filters
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
          
          <h1 className="text-center text-[1.2rem] font-bold">Amanda Lai</h1>
          <p className="text-center text-[#6c757d] text-[0.82rem] mt-1">Industrial Designer / Packaging Engineer</p>
          <div className="flex items-center justify-center gap-1 text-[#adb5bd] text-[0.78rem] mt-2 mb-4">
            <MapPin size={12} />
            Taichung, Taiwan
          </div>
          <div className="h-px bg-[#e9ecef] mb-4"></div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">Status</span>
            <span className="bg-[#e8f5ee] text-[#3d7a5a] text-[0.72rem] px-2.5 py-0.5 rounded-full font-semibold">Open to Opportunities</span>
          </div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">Email</span>
            <span className="font-semibold text-[0.74rem]">amanda840604@gmail.com</span>
          </div>
          <div className="flex justify-between items-center text-[0.8rem] py-1.5">
            <span className="text-[#adb5bd]">Phone</span>
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
              Add Friend
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
                        No photos uploaded yet
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
                      <Target size={14} /> Learning Objectives & Modules
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

