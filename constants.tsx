
import { Plant, Maladie, Gravite } from './types';

export const COLORS = {
  primary: '#2E7D32', // Natural Green
  secondary: '#FFD700', // Gold
  accent: '#F59E0B', // Amber
  danger: '#DC2626',
  background: '#F0FDF4',
};

export const MOCK_PLANTS: Plant[] = [
  {
    id: 'p1',
    nom_kreyol: 'Asosi',
    nom_scientifique: 'Momordica charantia',
    nom_francais: 'Margose',
    famille: 'Cucurbitaceae',
    description: 'Yon plant k ap rale ki bay ti fwi jòn epi ki gen fèy trè anmè.',
    proprietes: ['Netwaye san', 'Trete gratèl', 'Desann sik'],
    contre_indications: ['Fanm ansent', 'Timoun piti'],
    effets_secondaires: ['Vant fè mal si ou bwè twòp'],
    image: 'https://images.unsplash.com/photo-1596715611090-674068565f3d?auto=format&fit=crop&q=80&w=600',
    region: 'Tout kote nan peyi a',
    preparation: 'Bouyi 3 fèy nan yon lit dlo.',
    dosage: 'Yon ti gode chak maten pandan 3 jou.'
  },
  {
    id: 'p2',
    nom_kreyol: 'Vèvenn',
    nom_scientifique: 'Stachytarpheta jamaicensis',
    nom_francais: 'Verveine',
    famille: 'Verbenaceae',
    description: 'Yon ti plant vèt ak ti flè vyolèt, li grandi nan jaden ak bò wout.',
    proprietes: ['Kalme nè', 'Trete fyèv', 'Bon pou dijesyon'],
    contre_indications: ['Moun ki gen tansyon ba'],
    effets_secondaires: ['Dòmi nan je'],
    image: 'https://images.unsplash.com/photo-1628527303082-5638c460021c?auto=format&fit=crop&q=80&w=600',
    region: 'Plèn ak mòn',
    preparation: 'Pran yon branch, lave l, mete l nan dlo cho.',
    dosage: 'Yon tas anvan w al dòmi.'
  },
  {
    id: 'p3',
    nom_kreyol: 'Lalo',
    nom_scientifique: 'Abelmoschus esculentus',
    nom_francais: 'Gombo',
    famille: 'Malvaceae',
    description: 'Plant sa a bay fwi ki gen anpil glisad, yo itilize l nan manje ak nan remèd.',
    proprietes: ['Trete enflamasyon', 'Bon pou dijesyon'],
    contre_indications: [],
    effets_secondaires: [],
    image: 'https://images.unsplash.com/photo-1595133642301-8b28f73f8983?auto=format&fit=crop&q=80&w=600',
    region: 'Latibonit',
    preparation: 'Kraze fèy yo nan dlo fret pou fè yon lwil oswa bouyi l.',
    dosage: 'Bwè dlo a oswa lave pati ki malad la.'
  }
];

export const MOCK_MALADIES: Maladie[] = [
  {
    id: 'm1',
    nom: 'Grip',
    categorie: 'Respiratwa',
    symptomes: ['Nen k ap koule', 'Touse', 'Tèt fè mal'],
    causes: 'Viris ak chanjman tanperati',
    prevention: 'Evite pran fredi, bwè anpil ji sitwon',
    gravite: Gravite.LEGER,
    remedes_ids: ['p2']
  },
  {
    id: 'm2',
    nom: 'Dyabèt',
    categorie: 'Sik nan san',
    symptomes: ['Swaf anpil', 'Vire tounen', 'Pipi souvan'],
    causes: 'Move rejim alimantè oswa ereditè',
    prevention: 'Manje mwens sik, fè espò',
    gravite: Gravite.MODERE,
    remedes_ids: ['p1']
  },
  {
    id: 'm3',
    nom: 'Enfeksyon nan po',
    categorie: 'Po',
    symptomes: ['Gratèl', 'Plaj wouj'],
    causes: 'Mikwòb oswa move dlo',
    prevention: 'Kenbe kò a pwòp',
    gravite: Gravite.LEGER,
    remedes_ids: ['p1', 'p3']
  },
  {
    id: 'm4',
    nom: 'Kolera',
    categorie: 'Enfeksyon Vant',
    symptomes: ['Gwo dyare tankou dlo diri', 'Vomisman', 'Gwo dezidratasyon'],
    causes: 'Bakteri nan dlo oswa manje sal',
    prevention: 'Lave men souvan, trete dlo pou bwè',
    gravite: Gravite.GRAVE,
    remedes_ids: []
  },
  {
    id: 'm5',
    nom: 'Emoraji',
    categorie: 'San',
    symptomes: ['San k ap koule anpil', 'Feblès', 'Po blanchi'],
    causes: 'Gwo blesi oswa pwoblèm entèn',
    prevention: 'Fè atansyon ak kouto oswa machin',
    gravite: Gravite.GRAVE,
    remedes_ids: []
  }
];
