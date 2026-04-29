export interface Work {
  id: number;
  type: 'ai_drama' | 'photography';
  title: string;
  description: string;
  coverImage: string;
  mediaUrl: string[];
  script?: string;
  assets: string[];
  createdAt: string;
}

const DEFAULT_WORKS: Work[] = [
  {
    id: 1,
    type: 'ai_drama',
    title: 'Neon Echoes',
    description: 'A cyberpunk narrative exploring the meaning of consciousness in an AI-driven society. Visuals generated with Midjourney V6, animation via Runway Gen-2.',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',
    mediaUrl: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    script: 'SCENE START\nINT. SERVER ROOM - NIGHT\nNeon lights bleed through the cracks...',
    assets: ['Concept Art 1', 'Character Turnaround', 'VFX Layers'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    type: 'photography',
    title: 'Silence in the Alps',
    description: 'A harsh yet beautiful exploration of the Italian Alps during deep winter.',
    coverImage: 'https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?q=80&w=1600&auto=format&fit=crop',
    mediaUrl: [],
    script: '',
    assets: ['High-res printable version', 'Raw file snippet'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 3,
    type: 'ai_drama',
    title: 'The Final Symphony',
    description: 'An orbital station prepares for the end of the universe while listening to Beethoven.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    mediaUrl: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    script: 'SCENE START\nEXT. ORBIT - CONTINUOUS\nStars dying gracefully...',
    assets: ['Storyboards', 'Audio Stems'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 4,
    type: 'photography',
    title: 'Urban Shadows',
    description: 'Street photography capturing the high-contrast lives of Tokyo denizens.',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop',
    mediaUrl: [],
    script: '',
    assets: ['B&W Print version'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  }
];

function getStoredWorks(): Work[] {
  const stored = localStorage.getItem('framezero_works');
  if (!stored) {
    localStorage.setItem('framezero_works', JSON.stringify(DEFAULT_WORKS));
    return DEFAULT_WORKS;
  }
  return JSON.parse(stored);
}

function saveWorks(works: Work[]) {
  localStorage.setItem('framezero_works', JSON.stringify(works));
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getWorks(type?: string): Promise<Work[]> {
    await delay(300);
    const works = getStoredWorks();
    let sorted = works.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (type) {
      return sorted.filter(w => w.type === type);
    }
    return sorted;
  },

  async getWork(id: number | string): Promise<Work | null> {
    await delay(200);
    const works = getStoredWorks();
    return works.find(w => w.id === Number(id)) || null;
  },

  async createWork(workData: Partial<Work>): Promise<{ id: number }> {
    await delay(400);
    const works = getStoredWorks();
    const newWork: Work = {
      ...workData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    } as Work;
    works.push(newWork);
    saveWorks(works);
    return { id: newWork.id };
  },

  async deleteWork(id: number | string): Promise<{ success: boolean }> {
    await delay(300);
    const works = getStoredWorks();
    const newWorks = works.filter(w => w.id !== Number(id));
    if (newWorks.length === works.length) {
      throw new Error('Not found');
    }
    saveWorks(newWorks);
    return { success: true };
  }
};
