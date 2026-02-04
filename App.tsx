
import React, { useState, useRef } from 'react';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Leaf, 
  Stethoscope, 
  MessageCircle, 
  ChevronRight, 
  AlertTriangle, 
  ArrowLeft,
  Send,
  Plus,
  Camera,
  Loader2,
  X,
  PhoneCall,
  ShieldAlert,
  Download
} from 'lucide-react';
import { MOCK_PLANTS, MOCK_MALADIES, COLORS } from './constants';
import { Plant, Maladie, Gravite } from './types';
import { getAIAdvice, identifyPlantFromImage } from './services/gemini';

// --- Components ---

const Header = ({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
  <header className="sticky top-0 z-50 bg-[#2E7D32] text-white p-4 shadow-md flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition-all active:scale-90">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold truncate max-w-[200px] md:max-w-none">{title}</h1>
    </div>
    <div className="bg-white/20 p-2 rounded-full cursor-pointer hover:bg-white/30 transition shadow-inner">
      <Leaf size={20} className="text-[#FFD700]" />
    </div>
  </header>
);

const TabBar = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
  <nav className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    {[
      { id: 'home', icon: Home, label: 'Akèy' },
      { id: 'diseases', icon: Stethoscope, label: 'Maladi' },
      { id: 'plants', icon: Leaf, label: 'Plant' },
      { id: 'ai', icon: MessageCircle, label: 'AI' },
      { id: 'profile', icon: User, label: 'Pwofil' },
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${
          activeTab === tab.id ? 'text-[#2E7D32] scale-110' : 'text-gray-400 hover:text-green-400'
        }`}
      >
        <tab.icon size={22} fill={activeTab === tab.id ? 'currentColor' : 'none'} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
      </button>
    ))}
  </nav>
);

const PlantDetail = ({ plant, onBack }: { plant: Plant; onBack: () => void }) => (
  <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500">
    <Header title={plant.nom_kreyol} showBack onBack={onBack} />
    <div className="relative">
      <img src={plant.image} alt={plant.nom_kreyol} className="w-full h-72 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
    <div className="p-5 -mt-6 relative z-10 bg-white rounded-t-3xl space-y-6 shadow-sm">
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">{plant.nom_kreyol}</h2>
            <p className="text-sm italic text-[#2E7D32] font-semibold">{plant.nom_scientifique}</p>
          </div>
          <button className="bg-green-50 text-[#2E7D32] p-3 rounded-2xl shadow-sm">
            <Heart size={24} />
          </button>
        </div>
        <p className="mt-4 text-gray-600 leading-relaxed text-base">{plant.description}</p>
      </section>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
          <AlertTriangle size={20} />
          <span>Atansyon!</span>
        </div>
        <p className="text-sm text-amber-700 font-medium">
          {plant.contre_indications.length > 0 
            ? `Pa pou: ${plant.contre_indications.join(', ')}`
            : "Pa gen gwo kontendikasyon espesyal pou plant sa a."}
        </p>
      </div>

      <section>
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-lg">
          <Leaf size={20} className="text-[#2E7D32]" /> Pwopriyete Medikinal
        </h3>
        <div className="flex flex-wrap gap-2">
          {plant.proprietes.map(p => (
            <span key={p} className="bg-green-100 text-[#2E7D32] px-4 py-1.5 rounded-full text-sm font-bold border border-green-200">
              {p}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Plus size={18} className="text-green-600" /> Preparasyon
          </h3>
          <p className="text-gray-600 leading-relaxed">{plant.preparation}</p>
        </section>
        <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Stethoscope size={18} className="text-green-600" /> Dozaj
          </h3>
          <p className="text-gray-600 leading-relaxed">{plant.dosage}</p>
        </section>
      </div>
    </div>
  </div>
);

const DiseaseDetail = ({ disease, onBack, onSelectPlant }: { disease: Maladie; onBack: () => void; onSelectPlant: (p: Plant) => void }) => {
  const remedies = MOCK_PLANTS.filter(p => disease.remedes_ids.includes(p.id));
  const isGrave = disease.gravite === Gravite.GRAVE;

  return (
    <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500">
      <Header title={disease.nom} showBack onBack={onBack} />
      
      {isGrave && (
        <div className="bg-red-600 text-white p-8 animate-pulse shadow-2xl flex flex-col items-center text-center space-y-4">
          <ShieldAlert size={64} className="mb-2" />
          <h3 className="text-3xl font-black uppercase italic tracking-tighter">Sa se yon ijans!</h3>
          <p className="text-xl font-bold leading-tight max-w-xs mx-auto">
            Kouri al lopital imedyatman. Maladi sa a pa ka trete lakay sèlman!
          </p>
          <div className="bg-white text-red-600 px-6 py-3 rounded-full font-black flex items-center gap-2 text-lg shadow-xl cursor-pointer hover:scale-105 transition active:scale-95">
            <PhoneCall size={24} /> RELE 116 (ANBILANS)
          </div>
        </div>
      )}

      <div className="p-5 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {disease.categorie}
            </span>
          </div>
          <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
            isGrave ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            Nivo: {disease.gravite}
          </span>
        </div>

        <section>
          <h2 className="text-3xl font-black text-gray-800">{disease.nom}</h2>
          <p className="mt-3 text-gray-600 leading-relaxed text-lg">{disease.causes}</p>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 space-y-4">
          <h3 className="font-black text-gray-800 text-lg border-l-4 border-green-500 pl-3">Sentòm yo</h3>
          <ul className="grid grid-cols-1 gap-3">
            {disease.symptomes.map(s => (
              <li key={s} className="flex items-center gap-3 text-gray-700 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-green-50 p-6 rounded-3xl border border-green-100">
          <h3 className="font-black text-green-900 mb-2 flex items-center gap-2">
            <ShieldAlert size={20} /> Prevansyon
          </h3>
          <p className="text-green-800 leading-relaxed">{disease.prevention}</p>
        </section>

        {!isGrave && remedies.length > 0 && (
          <section>
            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-xl">
              <Leaf size={24} className="text-[#2E7D32]" /> Remèd yo konseye
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {remedies.map(plant => (
                <button
                  key={plant.id}
                  onClick={() => onSelectPlant(plant)}
                  className="group flex items-center gap-4 bg-white p-4 rounded-3xl shadow-md border border-gray-50 hover:border-green-400 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <img src={plant.image} alt={plant.nom_kreyol} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition duration-500" />
                  <div className="text-left flex-1">
                    <h4 className="font-black text-gray-800 text-lg">{plant.nom_kreyol}</h4>
                    <p className="text-xs text-green-600 font-bold uppercase tracking-tight">{plant.proprietes.slice(0, 2).join(' • ')}</p>
                  </div>
                  <ChevronRight size={24} className="text-gray-300 group-hover:text-green-500 transition" />
                </button>
              ))}
            </div>
          </section>
        )}

        {isGrave && (
          <div className="text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold italic text-sm">
              Pa sèvi ak remèd fèy pou maladi sa a san konsèy yon doktè kalifye.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Maladie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Vision state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const botResponse = await getAIAdvice(userText);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse || "M pa t ka jwenn yon repons kounye a." }]);
    setIsTyping(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      setIsScanning(true);
      setScanResult(null);

      const base64Clean = base64.split(',')[1];
      const result = await identifyPlantFromImage(base64Clean, file.type);
      setScanResult(result);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const renderHome = () => (
    <div className="p-5 pb-10 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-br from-[#2E7D32] to-[#14532D] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full">
              <User size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Onè, Respè!</h2>
          </div>
          <p className="opacity-80 font-medium">Sante w nan men w ak nan tè a.</p>
          <div className="mt-8 flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            <button onClick={() => setActiveTab('diseases')} className="flex-shrink-0 bg-white/15 p-4 rounded-3xl flex flex-col items-center gap-3 w-28 hover:bg-white/25 transition-all shadow-lg border border-white/10 active:scale-95">
              <Stethoscope size={28} />
              <span className="text-xs font-black uppercase tracking-tighter">Maladi</span>
            </button>
            <button onClick={() => setActiveTab('plants')} className="flex-shrink-0 bg-white/15 p-4 rounded-3xl flex flex-col items-center gap-3 w-28 hover:bg-white/25 transition-all shadow-lg border border-white/10 active:scale-95">
              <Leaf size={28} />
              <span className="text-xs font-black uppercase tracking-tighter">Plant</span>
            </button>
            <button onClick={triggerCamera} className="flex-shrink-0 bg-[#FFD700] text-green-950 p-4 rounded-3xl flex flex-col items-center gap-3 w-28 hover:scale-105 transition-all shadow-[0_10px_20px_rgba(255,215,0,0.3)] active:scale-95">
              <Camera size={28} />
              <span className="text-xs font-black uppercase tracking-tighter">Scan Fèy</span>
            </button>
          </div>
        </div>
        <Leaf className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-45 group-hover:scale-125 transition duration-1000" size={200} />
      </div>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-800 text-xl tracking-tight">Plant nan moman an</h3>
          <button onClick={() => setActiveTab('plants')} className="text-[#2E7D32] text-sm font-black flex items-center gap-1">
            WÈ TOUT <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {MOCK_PLANTS.slice(0, 2).map(plant => (
            <div 
              key={plant.id} 
              onClick={() => setSelectedPlant(plant)}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-md border border-gray-50 cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={plant.image} alt={plant.nom_kreyol} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="p-4">
                <h4 className="font-black text-gray-800 group-hover:text-green-700 transition">{plant.nom_kreyol}</h4>
                <p className="text-[10px] text-gray-400 uppercase font-black mt-1 tracking-widest">{plant.famille}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-4">
        <div className="bg-amber-100/50 p-5 rounded-[2rem] border border-amber-200 flex items-center gap-5 shadow-sm">
          <div className="bg-white p-3 rounded-2xl text-amber-600 shadow-sm border border-amber-100">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h4 className="font-black text-amber-900">Konsèy Sekirite</h4>
            <p className="text-xs text-amber-800 font-medium">Pa janm bliye: AI a bay konsèy, men doktè bay lòd. Toujou pran prekosyon!</p>
          </div>
        </div>
      </section>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );

  const renderDiseases = () => (
    <div className="p-5 pb-10 space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition" size={20} />
        <input 
          type="text" 
          placeholder="Chache yon maladi (ex: Grip)..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent shadow-md focus:border-green-500 focus:ring-0 bg-white text-gray-800 font-medium transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        {MOCK_MALADIES.filter(m => m.nom.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedDisease(m)}
            className="w-full flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-gray-50 hover:border-green-300 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="text-left">
              <h4 className="font-black text-gray-800 text-lg">{m.nom}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{m.categorie}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                m.gravite === Gravite.GRAVE ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {m.gravite}
              </span>
              <ChevronRight size={20} className="text-gray-200" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlants = () => (
    <div className="p-5 pb-10 space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition" size={20} />
          <input 
            type="text" 
            placeholder="Chache pa non (ex: Asosi)..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent shadow-md focus:border-green-500 bg-white text-gray-800 font-medium transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={triggerCamera}
          className="bg-[#2E7D32] text-white p-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all active:scale-90"
        >
          <Camera size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {MOCK_PLANTS.filter(p => p.nom_kreyol.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPlant(p)}
            className="group bg-white rounded-3xl overflow-hidden shadow-md border border-gray-50 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-32 overflow-hidden">
              <img src={p.image} alt={p.nom_kreyol} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            </div>
            <div className="p-4">
              <h4 className="font-black text-gray-800 group-hover:text-green-700 transition">{p.nom_kreyol}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-black mt-1 line-clamp-1">{p.proprietes.join(' • ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-gray-100/50 m-5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50 relative">
      <div className="bg-white/80 backdrop-blur-md p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200 animate-pulse">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-800">Doktè Fèy AI</h3>
            <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Disponib • Sante Lakay</p>
          </div>
        </div>
        <div className="bg-green-50 text-green-600 p-2 rounded-xl">
          <ShieldAlert size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
        {chatMessages.length === 0 && (
          <div className="text-center py-16 px-8 flex flex-col items-center">
            <div className="bg-white p-6 rounded-full shadow-xl mb-6 text-green-100">
               <Leaf size={64} fill="currentColor" />
            </div>
            <h4 className="text-gray-800 font-black text-xl mb-2">Mwen la pou ou!</h4>
            <p className="text-gray-400 text-sm italic font-medium">
              "Bonjou! Pa kache m anyen. Ki maladi k ap bat ou oswa sou ki plant ou vle konnen plis?"
            </p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#2E7D32] text-white rounded-tr-none' 
                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none leading-relaxed'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-3">
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ekri yon kesyon pou AI a..." 
          className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-green-500 transition"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-[#2E7D32] text-white p-3 rounded-2xl shadow-lg hover:bg-green-800 transition-all active:scale-90"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-5 pb-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col items-center gap-4 py-8 relative">
        <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-gray-200 relative border-4 border-green-50 hover:scale-105 transition-all duration-500 group overflow-hidden">
          <User size={64} className="group-hover:text-green-500 transition" />
          <button className="absolute bottom-0 right-0 bg-[#2E7D32] text-white p-2.5 rounded-2xl border-4 border-white shadow-lg active:scale-90">
            <Plus size={20} />
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black text-gray-800 tracking-tight">Itilizatè Lakay</h3>
          <p className="text-sm text-green-600 font-black uppercase tracking-widest mt-1">Gadyen Konesans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-2">
        <button className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-gray-50 hover:border-green-300 transition-all hover:translate-x-1">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-2.5 rounded-2xl text-red-500">
              <Heart size={22} fill="currentColor" />
            </div>
            <span className="font-black text-gray-700">Favori m yo</span>
          </div>
          <ChevronRight size={20} className="text-gray-200" />
        </button>
        <button className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-gray-50 hover:border-green-300 transition-all hover:translate-x-1">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-500">
              <Download size={22} />
            </div>
            <span className="font-black text-gray-700">Done Oflayn</span>
          </div>
          <ChevronRight size={20} className="text-gray-200" />
        </button>
        <button className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-gray-50 hover:border-green-300 transition-all hover:translate-x-1">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-500">
              <AlertTriangle size={22} />
            </div>
            <span className="font-black text-gray-700">Sekirite m</span>
          </div>
          <ChevronRight size={20} className="text-gray-200" />
        </button>
      </div>

      <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] border border-gray-100 text-center shadow-inner">
        <ShieldAlert className="mx-auto text-gray-200 mb-4" size={48} />
        <p className="text-xs text-gray-400 font-bold leading-relaxed px-4 italic">
          <strong>Avi Legal:</strong> Aplikasyon sa a se pou enfòmasyon sèlman. Medsin tradisyonèl se yon kilti, men sante se yon syans. Toujou konsilte yon doktè pou ka grav.
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F0FDF4] md:shadow-[0_0_100px_rgba(0,0,0,0.1)] relative overflow-x-hidden flex flex-col">
      {/* Scan Modal */}
      {(capturedImage || isScanning) && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col p-5 animate-in fade-in duration-500">
          <div className="flex justify-end mb-6">
            <button onClick={() => { setCapturedImage(null); setScanResult(null); }} className="text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition">
              <X size={28} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="w-full max-h-[45vh] rounded-[2rem] overflow-hidden border-4 border-green-500 shadow-2xl shadow-green-500/30 relative">
              <img src={capturedImage!} alt="Scan" className="w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <div className="relative">
                     <Loader2 size={64} className="animate-spin text-green-400" />
                     <Leaf size={24} className="absolute inset-0 m-auto text-white animate-pulse" />
                  </div>
                  <p className="font-black mt-4 uppercase tracking-widest text-sm">M ap analize fèy la...</p>
                </div>
              )}
            </div>

            <div className="w-full bg-white rounded-[2.5rem] p-8 overflow-y-auto max-h-[40vh] shadow-2xl animate-in slide-in-from-bottom duration-500">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="h-8 bg-gray-100 rounded-full animate-pulse w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-50 rounded-full animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-50 rounded-full animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-50 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-[#2E7D32]">
                    <div className="bg-green-50 p-2 rounded-xl">
                      <Leaf size={28} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Rezilta Analiz</h3>
                  </div>
                  <div className="prose prose-green prose-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                    {scanResult}
                  </div>
                  <button 
                    onClick={() => { setCapturedImage(null); setScanResult(null); }}
                    className="w-full bg-[#2E7D32] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-green-800"
                  >
                    Mwen konprann
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPlant ? (
        <PlantDetail plant={selectedPlant} onBack={() => setSelectedPlant(null)} />
      ) : selectedDisease ? (
        <DiseaseDetail 
          disease={selectedDisease} 
          onBack={() => setSelectedDisease(null)} 
          onSelectPlant={(p) => { setSelectedDisease(null); setSelectedPlant(p); }} 
        />
      ) : (
        <div className="flex flex-col flex-1">
          <Header title={
            activeTab === 'home' ? 'Remèd Lakay' : 
            activeTab === 'diseases' ? 'Lis Maladi' : 
            activeTab === 'plants' ? 'Plant Medisinal' : 
            activeTab === 'ai' ? 'Doktè Fèy AI' : 'Pwofil Mwen'
          } />
          
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'diseases' && renderDiseases()}
            {activeTab === 'plants' && renderPlants()}
            {activeTab === 'ai' && renderAI()}
            {activeTab === 'profile' && renderProfile()}
          </main>

          <TabBar activeTab={activeTab} onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
          }} />
        </div >
      )}
    </div>
  );
}
