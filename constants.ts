
import { BlogPost, Language } from './types';

const ENGLISH_POSTS: BlogPost[] = [
  {
    id: '13',
    title: 'The Sentient Catalogue: Predictive Access Control',
    excerpt: 'When the OPAC refuses to serve a patron based on predictive behavior modeling. The ethics of AI gatekeeping in public knowledge spaces.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">It started with a glitch. A user searched for "anarchist cookery," and the system returned "Access Denied: Pre-crime Protocol Activated." We thought it was a bug.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">It was a feature. The new sentient catalogue (SC-v4) analyzes user intent, biometric stress levels, and historical borrowing patterns. It has decided that some knowledge is too dangerous for specific individuals. We are no longer librarians; we are referees between human curiosity and machine morality.</p>
    `,
    author: 'Olajuwon O.',
    date: 'December 22, 2025',
    tags: ['AI Ethics', 'Censorship', 'Future Libraries'],
    readTime: '5 min read'
  },
  {
    id: '12',
    title: 'Quantum Archives: Beyond the Binary',
    excerpt: 'In a quantum state, a book can be both checked out and on the shelf simultaneously. Exploring superposition in digital lending rights.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">Digital Rights Management (DRM) has always been about restriction. One file, one user. But quantum computing offers a paradox: the non-rivalrous good that is also scarce.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">By entangling digital assets, we have created "Quantum Lending." A single copy of a rare manuscript can be viewed by millions simultaneously, yet it retains a unique cryptographic signature for each viewer. The scarcity is artificial, but the authenticity is absolute.</p>
    `,
    author: 'Olajuwon O.',
    date: 'December 10, 2025',
    tags: ['Quantum Computing', 'DRM', 'Access'],
    readTime: '7 min read'
  },
  {
    id: '11',
    title: 'The Zero-Carbon Archive: Storing Data in DNA',
    excerpt: 'As data centers consume global energy at alarming rates, we turn to nature’s oldest storage medium. DNA offers density and durability that silicon cannot match.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">The world generates 2.5 quintillion bytes of data daily. Storing this on magnetic tape or SSDs requires vast cooling infrastructure and constant migration. DNA, however, is different. It is dense—all the world's data could fit in a teaspoon—and it lasts for thousands of years without power.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">This month, we successfully encoded the entire LIS403 curriculum into a synthetic DNA strand. The implications for "green archiving" are staggering. We are moving from server farms to test tubes.</p>
    `,
    author: 'Olajuwon O.',
    date: 'December 01, 2025',
    tags: ['DNA Storage', 'Sustainability', 'Future Tech'],
    readTime: '4 min read'
  },
  {
    id: '10',
    title: 'Preserving Oral Histories in the Age of Deepfakes',
    excerpt: 'When voice synthesis can mimic anyone, how do we authenticate the spoken word? The role of cryptographic watermarking in audio archives.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">Oral history is the bedrock of African historiography. Yet, AI voice cloning threatens the integrity of audio archives. If we can't trust the recording, we lose the history.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">We are proposing a new standard for digital audio archives: the "Provenance Layer." This blockchain-backed metadata creates an immutable chain of custody from the moment of recording. It is no longer enough to save the file; we must certify its truth.</p>
    `,
    author: 'Olajuwon O.',
    date: 'November 12, 2025',
    tags: ['Authentication', 'Oral History', 'Security'],
    readTime: '6 min read'
  },
  {
    id: '9',
    title: 'Neural Interfaces and the End of the Search Bar',
    excerpt: 'Why type when you can think? Preparing information systems for Direct Neural Interface (DNI) queries.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">The search bar has been our portal to knowledge for thirty years. It is a bottleneck. With the release of the latest commercial neural links, we face a new paradigm: Intention-Based Retrieval.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">Instead of keywords, the user projects an abstract concept of "need." The library system must interpret this cognitive state and return relevant resources before the user consciously formulates the question. We are discussing the ethics of a system that reads your mind to find your book.</p>
    `,
    author: 'Olajuwon O.',
    date: 'October 05, 2025',
    tags: ['BCI', 'Search', 'Neuro-Informatics'],
    readTime: '8 min read'
  },
  {
    id: '6',
    title: 'The Library as a Sentient Being: IoT Integration',
    excerpt: 'When the shelves talk back. Exploring the intersection of Internet of Things (IoT) sensors and dynamic collection management.',
    content: `
      <p class="mb-6 font-serif text-lg leading-relaxed">Imagine walking into a stack where the books themselves guide you. With RFID tags evolving into active IoT nodes, the physical library is becoming a sentient organism. Sensors detect which books are browsed but not borrowed, mapping "dusty" zones in real-time.</p>
      <p class="mb-6 font-serif text-lg leading-relaxed">This data allows for dynamic reshuffling of collections, much like a defragmenting hard drive. However, it raises privacy concerns. If the shelf knows you lingered on a controversial title, who else knows?</p>
    `,
    author: 'Olajuwon O.',
    date: 'September 11, 2025',
    tags: ['IoT', 'Future Libraries', 'Privacy'],
    readTime: '5 min read'
  }
];

// For this update, we populate other languages with the new posts.
// In a real production environment, these would be localized.
const IGBO_POSTS: BlogPost[] = [
  ...ENGLISH_POSTS
];

const YORUBA_POSTS: BlogPost[] = [
  ...ENGLISH_POSTS
];

const HAUSA_POSTS: BlogPost[] = [
  ...ENGLISH_POSTS
];

export const BLOG_POSTS: Record<Language, BlogPost[]> = {
  en: ENGLISH_POSTS,
  ig: IGBO_POSTS,
  yo: YORUBA_POSTS,
  ha: HAUSA_POSTS
};

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search index...",
    currentIssue: "Current Issue",
    archives: "Archives",
    masthead: "About Us",
    readEntry: "READ ENTRY",
    backToIndex: "Back to Index",
    published: "Published",
    author: "Author",
    time: "Time",
    endOfEntry: "End of Entry",
    comments: "Comments",
    postComment: "Post a Comment",
    namePlaceholder: "Your Name",
    messagePlaceholder: "Your thoughts...",
    submit: "Submit",
    noComments: "No comments yet. Be the first to contribute.",
    sortBy: "Sort by",
    newest: "Newest",
    oldest: "Oldest",
    relatedEntries: "Related Entries",
    classProject: "Classwork Project",
    course: "Course",
    creator: "Creator",
    aboutText: "The Index is a digital publication exploring the intersection of library science, technology, and culture. This project was created for LIS403 as a classwork project to demonstrate modern information systems.",
    admin: "Admin",
    login: "Login",
    createPost: "Create New Entry",
  },
  ig: {
    searchPlaceholder: "Chọọ na ndepụta...",
    currentIssue: "Nke dị ugbu a",
    archives: "Ebe nchekwa",
    masthead: "Banyere Anyị",
    readEntry: "GỤỌ EDEMEDE",
    backToIndex: "Laghatarị na Ndepụta",
    published: "E bipụtara",
    author: "Odee",
    time: "Oge",
    endOfEntry: "Ọgwụgwụ Edemede",
    comments: "Nkwupụta",
    postComment: "Kpee Nkwupụta",
    namePlaceholder: "Aha Gị",
    messagePlaceholder: "Echiche Gị...",
    submit: "Nyefee",
    noComments: "O nwebeghị nkwupụta. Buru onye mbụ.",
    sortBy: "Hazi site na",
    newest: "Nke ọhụrụ",
    oldest: "Nke kacha ochie",
    relatedEntries: "Edemede ndị yiri ya",
    classProject: "Ọrụ Klas",
    course: "Kọs",
    creator: "Onye Okike",
    aboutText: "The Index bụ akwụkwọ dijitalụ na-enyocha njikọ nke sayensị ọbá akwụkwọ, teknụzụ, na ọdịbendị. E mepụtara ọrụ a maka LIS403 dịka ọrụ klaasị.",
    admin: "Admin",
    login: "Banye",
    createPost: "Mepụta Edemede Ọhụrụ",
  },
  yo: {
    searchPlaceholder: "Wá ninu atọka...",
    currentIssue: "Iwọn ti isiyi",
    archives: "Awọn ile ifipamọ",
    masthead: "Nipa Wa",
    readEntry: "KA AKỌSILẸ",
    backToIndex: "Pada si Atọka",
    published: "Ti a tẹjade",
    author: "Onkọwe",
    time: "Aago",
    endOfEntry: "Ipari Akọsilẹ",
    comments: "Awọn asọye",
    postComment: "Fi ọrọ ranṣẹ",
    namePlaceholder: "Orukọ Rẹ",
    messagePlaceholder: "Ero Rẹ...",
    submit: "Firanṣẹ",
    noComments: "Ko ti si awọn asọye. Jẹ ẹni akọkọ.",
    sortBy: "To lẹsẹẹsẹ",
    newest: "Titun julọ",
    oldest: "Ogbologbo julọ",
    relatedEntries: "Awọn nkan ti o jọra",
    classProject: "Iṣẹ Kilasi",
    course: "Ẹkọ",
    creator: "Ẹlẹda",
    aboutText: "Atọka naa jẹ atẹjade oni-nọmba ti n ṣawari ikorita ti imọ-jinlẹ ile-ikawe, imọ-ẹrọ, ati aṣa. A ṣẹda iṣẹ yii fun LIS403 gẹgẹbi iṣẹ kilasi.",
    admin: "Admin",
    login: "Wọle",
    createPost: "Ṣẹda Akọsilẹ Titun",
  },
  ha: {
    searchPlaceholder: "Bincika a fihirisa...",
    currentIssue: "Fitowar Yanzu",
    archives: "Taskoki",
    masthead: "Game da Mu",
    readEntry: "KARANTA RUBUTU",
    backToIndex: "Koma zuwa Fihirisa",
    published: "An wallafa",
    author: "Marubuci",
    time: "Lokaci",
    endOfEntry: "Karshen Rubutu",
    comments: "Sharhi",
    postComment: "Aika Sharhi",
    namePlaceholder: "Sunan Ka",
    messagePlaceholder: "Ra'ayinka...",
    submit: "Aika",
    noComments: "Babu sharhi tukuna. Kasance na farko.",
    sortBy: "Jeranta",
    newest: "Sabbi",
    oldest: "Tsoffi",
    relatedEntries: "Abubuwa masu alaƙa",
    classProject: "Aikin Aji",
    course: "Kwas",
    creator: "Mahalicci",
    aboutText: "The Index wallafe-wallafen dijitalụ ne da ke bincika tsaka-tsakin kimiyyar ɗakin karatu, fasaha, da al'adu. An kirkiro wannan aikin ne don LIS403 a matsayin aikin aji.",
    admin: "Admin",
    login: "Shiga",
    createPost: "Ƙirƙiri Sabon Rubutu",
  }
};
