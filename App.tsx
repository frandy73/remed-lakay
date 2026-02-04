
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
  ShieldAlert
} from 'lucide-react';
import { MOCK_PLANTS, MOCK_MALADIES, COLORS } from './constants';
import { Plant, Maladie, Gravite } from './types';
import { getAIAdvice, identifyPlantFromImage } from './services/gemini';

// --- Components ---

const Header = ({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
  <header className="sticky top-0 z-50 bg-[#2E7D32] text-white p-4 shadow-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
    <div className="bg-white/20 p-2 rounded-full">
      <Leaf size={20} className="text-[#FFD700]" />
    </div>
  </header>
);

const TabBar = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
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
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === tab.id ? 'text-[#2E7D32]' : 'text-gray-400'
        }`}
      >
        <tab.icon size={24} fill={activeTab === tab.id ? 'currentColor' : 'none'} />
        <span className="text-[10px] font-medium uppercase tracking-tighter">{tab.label}</span>
      </button>
    ))}
  </nav>
);

const PlantDetail = ({ plant, onBack }: { plant: Plant; onBack: () => void }) => (
  <div className="pb-24 animate-in slide-in-from-right duration-300">
    <Header title={plant.nom_kreyol} showBack onBack={onBack} />
    <img src={plant.image} alt={plant.nom_kreyol} className="w-full h-64 object-cover" />
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-gray-800">{plant.nom_kreyol}</h2>
        <p className="text-sm italic text-gray-500">{plant.nom_scientifique}</p>
        <p className="mt-2 text-gray-600 leading-relaxed">{plant.description}</p>
      </section>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
        <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
          <AlertTriangle size={18} />
          <span>Atansyon!</span>
        </div>
        <p className="text-sm text-amber-700">
          {plant.contre_indications.length > 0 
            ? `Pa pou: ${plant.contre_indications.join(', ')}`
            : "Pa gen gwo kontendikasyon espesyal."}
        </p>
      </div>

      <section>
        <h3 className="font-bold text-[#2E7D32] flex items-center gap-2 mb-2">
          <Leaf size={18} /> Pwopriyete
        </h3>
        <div className="flex flex-wrap gap-2">
          {plant.proprietes.map(p => (
            <span key={p} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">Preparasyon</h3>
        <p className="text-gray-600 mb-4">{plant.preparation}</p>
        <h3 className="font-bold text-gray-800 mb-2">Dozaj</h3>
        <p className="text-gray-600">{plant.dosage}</p>
      </section>
    </div>
  </div>
);

const DiseaseDetail = ({ disease, onBack, onSelectPlant }: { disease: Maladie; onBack: () => void; onSelectPlant: (p: Plant) => void }) => {
  const remedies = MOCK_PLANTS.filter(p => disease.remedes_ids.includes(p.id));
  const isGrave = disease.gravite === Gravite.GRAVE;

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <Header title={disease.nom} showBack onBack={onBack} />
      
      {isGrave && (
        <div className="bg-red-600 text-white p-6 animate-pulse shadow-2xl flex flex-col items-center text-center space-y-3">
          <ShieldAlert size={48} />
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Sa se yon ijans!</h3>
          <p className="text-lg font-bold leading-tight">
            Kouri al lopital imedyatman. Maladi sa a pa ka trete lakay sèlman, li bezwen doktè vit-vit!
          </p>
          <div className="bg-white text-red-600 px-4 py-2 rounded-full font-black flex items-center gap-2 text-sm shadow-lg">
            <PhoneCall size={18} /> RELE 116 (ANBILANS)
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            {disease.categorie}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            isGrave ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            Nivo: {disease.gravite}
          </span>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">{disease.nom}</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">{disease.causes}</p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">Sentòm yo</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {disease.symptomes.map(s => <li key={s}>{s}</li>)}
          </ul>
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">Prevansyon</h3>
          <p className="text-gray-600">{disease.prevention}</p>
        </section>

        {!isGrave && remedies.length > 0 && (
          <section>
            <h3 className="font-bold text-[#2E7D32] mb-3 flex items-center gap-2">
              <Leaf size={18} /> Remèd yo konseye
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {remedies.map(plant => (
                <button
                  key={plant.id}
                  onClick={() => onSelectPlant(plant)}
                  className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition"
                >
                  <img src={plant.image} alt={plant.nom_kreyol} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-800">{plant.nom_kreyol}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{plant.proprietes.join(', ')}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
                </button>
              ))}
            </div>
          </section>
        )}

        {isGrave && (
          <p className="text-center text-red-500 font-bold italic text-sm py-4 border-t border-red-100">
            Remak: Pou maladi sa a, nou pa rekòmande remèd fèy kòm premye opsyon. Ale lopital dabò!
          </p>
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

    // Preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      setIsScanning(true);
      setScanResult(null);

      // Call API
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
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1 text-white">Bonjou!</h2>
          <p className="opacity-90 text-white">Jwenn remèd ki bon pou ou jodi a.</p>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveTab('diseases')} className="flex-shrink-0 bg-white/20 p-3 rounded-2xl flex flex-col items-center gap-2 w-24 hover:bg-white/30 transition">
              <Stethoscope size={24} />
              <span className="text-xs font-bold">Maladi</span>
            </button>
            <button onClick={() => setActiveTab('plants')} className="flex-shrink-0 bg-white/20 p-3 rounded-2xl flex flex-col items-center gap-2 w-24 hover:bg-white/30 transition">
              <Leaf size={24} />
              <span className="text-xs font-bold">Plant</span>
            </button>
            <button onClick={triggerCamera} className="flex-shrink-0 bg-[#FFD700] text-green-900 p-3 rounded-2xl flex flex-col items-center gap-2 w-24 hover:scale-105 transition shadow-lg">
              <Camera size={24} />
              <span className="text-xs font-bold">Scan Fèy</span>
            </button>
          </div>
        </div>
        <Leaf className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12" size={120} />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Plant Popilè</h3>
          <button onClick={() => setActiveTab('plants')} className="text-[#2E7D32] text-sm font-bold">Wè tout</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_PLANTS.slice(0, 2).map(plant => (
            <div 
              key={plant.id} 
              onClick={() => setSelectedPlant(plant)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
            >
              <img src={plant.image} alt={plant.nom_kreyol} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h4 className="font-bold text-gray-800">{plant.nom_kreyol}</h4>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">{plant.famille}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-4">
          <div className="bg-[#FFD700] p-3 rounded-full text-green-900">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-green-900">Konsèy Sekirite</h4>
            <p className="text-xs text-green-800">Toujou wè yon doktè anvan ou pran yon gwo remèd, sitou si ou ansent.</p>
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
    <div className="p-4 pb-24 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Chache yon maladi..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-3">
        {MOCK_MALADIES.filter(m => m.nom.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedDisease(m)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:bg-gray-50 transition"
          >
            <div className="text-left">
              <h4 className="font-bold text-gray-800">{m.nom}</h4>
              <p className="text-xs text-gray-500">{m.categorie}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                m.gravite === Gravite.GRAVE ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {m.gravite}
              </span>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlants = () => (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Chache yon plant..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={triggerCamera}
          className="bg-[#2E7D32] text-white p-3 rounded-xl shadow-sm hover:bg-green-700 transition"
        >
          <Camera size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_PLANTS.filter(p => p.nom_kreyol.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPlant(p)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
          >
            <img src={p.image} alt={p.nom_kreyol} className="w-full h-32 object-cover" />
            <div className="p-3">
              <h4 className="font-bold text-gray-800">{p.nom_kreyol}</h4>
              <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 line-clamp-1">{p.proprietes.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50 m-4 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Doktè Fèy AI</h3>
          <p className="text-[10px] text-green-600 font-bold uppercase">Online • Eksperyans Tradisyonèl</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-10 px-6">
            <Leaf className="mx-auto text-green-200 mb-4" size={48} />
            <p className="text-gray-500 text-sm italic">
              "Bonjou! Mwen se Doktè Fèy AI. Ki maladi k ap kale w oswa sou ki plant ou ta renmen konnen plis?"
            </p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-[#2E7D32] text-white rounded-tr-none' 
                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ekri yon kesyon..." 
          className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-[#2E7D32] text-white p-2 rounded-xl hover:bg-green-700 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 relative">
          <User size={48} />
          <button className="absolute bottom-0 right-0 bg-[#2E7D32] text-white p-1.5 rounded-full border-2 border-white">
            <Plus size={16} />
          </button>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Itilizatè Lakay</h3>
        <p className="text-sm text-gray-500 italic">M ap pwoteje kilti m</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-red-500" />
            <span className="font-medium text-gray-700">Favori m yo</span>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>
        <button className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-3">
            <MessageCircle size={20} className="text-blue-500" />
            <span className="font-medium text-gray-700">Kontribisyon m</span>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>
        <button className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-500" />
            <span className="font-medium text-gray-700">Paramèt sekirite</span>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>
      </div>

      <div className="p-6 bg-amber-50 rounded-3xl text-center">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Avi Legal:</strong> Remèd Lakay se yon aplikasyon enfòmatif. Toujou konsilte yon doktè oswa yon pwofesyonèl sante anvan ou trete tèt ou.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F0FDF4] shadow-2xl relative overflow-x-hidden">
      {/* Scan Modal */}
      {(capturedImage || isScanning) && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col p-4 animate-in fade-in duration-300">
          <div className="flex justify-end mb-4">
            <button onClick={() => { setCapturedImage(null); setScanResult(null); }} className="text-white p-2 bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-full max-h-[40vh] rounded-2xl overflow-hidden border-2 border-green-500 shadow-2xl shadow-green-500/20 relative">
              <img src={capturedImage!} alt="Scan" className="w-full h-full object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <Loader2 size={48} className="animate-spin text-green-400 mb-2" />
                  <p className="font-bold">M ap analize fèy la...</p>
                </div>
              )}
            </div>

            <div className="w-full bg-white rounded-3xl p-6 overflow-y-auto max-h-[45vh] shadow-xl">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#2E7D32]">
                    <Leaf size={24} />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Rezilta Analiz</h3>
                  </div>
                  <div className="prose prose-green prose-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {scanResult}
                  </div>
                  <button 
                    onClick={() => { setCapturedImage(null); setScanResult(null); }}
                    className="w-full bg-[#2E7D32] text-white py-3 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition"
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
        <>
          <Header title={
            activeTab === 'home' ? 'Remèd Lakay' : 
            activeTab === 'diseases' ? 'Maladi yo' : 
            activeTab === 'plants' ? 'Plant Medisinal' : 
            activeTab === 'ai' ? 'Doktè Fèy AI' : 'Pwofil'
          } />
          
          <main className="animate-in fade-in duration-500">
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
        </>
      )}
    </div>
  );
}
