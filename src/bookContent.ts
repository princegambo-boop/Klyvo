import { REAL_BOOKS_DATABASE } from './booksDatabase';

export interface BookChapter {
  title: string;
  excerpt: string;
}

export interface BookContent {
  synopsis: string;
  themes: string[];
  keyQuotes: string[];
  chapters: BookChapter[];
}

export const BOOK_CONTENTS: Record<string, BookContent> = {
  "diary of a wimpy kid": {
    synopsis: "Greg Heffley finds himself thrust into a new school year where undersized weaklings share the hallways with kids who are taller, meaner, and already shaving. The hazards of growing up before you're ready are uniquely revealed through Greg's diary.",
    themes: ["Middle School Cruelty", "Friendship Dynamics", "Sibling Rivalry", "Adolescent Insecurity"],
    keyQuotes: [
      "I'll be famous one day, but for now I'm stuck in middle school with a bunch of morons.",
      "Don't look at me, Rowley. I'm taking a stand.",
      "The only reason I agreed to do this diary thing in the first place is because when I'm rich and famous, I'll have better things to do than answer people's stupid questions all day long."
    ],
    chapters: [
      {
        title: "September: First Impressions",
        excerpt: "First of all, let me get something straight: this is a JOURNAL, not a diary. I know what it says on the cover, but when Mom went out to buy this thing I SPECIFICALLY told her to get one that didn't say 'diary' on it. Great. All I need is for some jerk to catch me carrying this book around and get the wrong idea.\n\nThe other thing I want to clear up right away is that this was MOM's idea, not mine. But if she thinks I'm going to write down my 'feelings' in here, she's crazy. So don't expect me to be all 'Dear Diary' this and 'Dear Diary' that."
      },
      {
        title: "October: Haunted House Project",
        excerpt: "Me and Rowley decided to build our own haunted house in his basement to make some quick money. We thought it would be pretty easy, but Rowley's dad got really mad when we tried to use the sprinkler system as simulated acid rain.\n\nThen we got stuck in the hallway with Rowley's mom screaming about us making a mess with the ketchup. The haunted house got shut down before we even had our first customer. I'm starting to think Rowley is a liability for my business ventures."
      },
      {
        title: "November: The Cheese Touch",
        excerpt: "Now, I should explain the Cheese Touch. There's this piece of cheese that's been sitting on the blacktop since last spring. It must have dropped out of someone's sandwich, and now it's completely moldy, smelly, and disgusting. Nobody plays basketball near it because if you touch the cheese, you get the 'Cheese Touch'.\n\nIt's basically like the cooties, only a hundred times worse. The only way to get rid of the Cheese Touch is to pass it on to someone else. I just hope Rowley doesn't get it first, because then I'll never be able to high-five him again."
      }
    ]
  },
  "diary of a wimpy kid: rodrick rules": {
    synopsis: "As Greg enters a new school term, he is desperate to hide an incredibly humiliating secret from the summer. Unfortunately for him, his heavy-metal drummer brother Rodrick knows all about it and is ready to blackmail him at every opportunity.",
    themes: ["Sibling Sabotage", "Keeping Secrets", "Pranks & Mischief", "Family Trust"],
    keyQuotes: [
      "No matter what you do, your older brother will find a way to make you look stupid.",
      "Löded Diper is playing tonight, and it's going to change heavy metal history."
    ],
    chapters: [
      {
        title: "September: The Secret Looming",
        excerpt: "Whatever you do, don't ask me how I spent my summer vacation, because I definitely don't want to talk about it. It was easily the worst summer of my life, all thanks to my brother Rodrick. He knows this highly embarrassing thing that happened to me, and he's going to hold it over my head until I'm eighty years old."
      },
      {
        title: "October: Trash Duty and Band Practice",
        excerpt: "Rodrick's band, 'Löded Diper', has been practicing down in the basement. They play the same heavy metal chord over and over for three hours straight. The ceiling vibrates so hard that Mom's decorative plates fell off the dining room hutch. Rodrick says it's called 'acoustic resonance' and that they are ready to turn professional."
      }
    ]
  },
  "the shadow of the wind": {
    synopsis: "In Barcelona, 1945, ten-year-old Daniel Sempere is brought to the secret Cemetery of Forgotten Books by his father. He is allowed to select one book, which pulls him into a swirling, tragic mystery of forgotten authors, dark shadows, and forbidden love.",
    themes: ["The Power of Literature", "Gothic Mystery", "Echoes of War", "Obsession and Love"],
    keyQuotes: [
      "Books are mirrors: you only see in them what you already have inside you.",
      "Every book, every volume you see here, has a soul. The soul of the person who wrote it and of those who read it and lived and dreamed with it."
    ],
    chapters: [
      {
        title: "Chapter 1: The Cemetery of Forgotten Books",
        excerpt: "I still remember the dawn my father took me to visit the Cemetery of Forgotten Books for the first time. The early summer fog lay over the streets like a silken shroud, dampening our footsteps. Daniel, what you are about to see today, you must promise to keep as a sacred secret, my father whispered.\n\nWe stopped in front of a heavy wooden door. Keyholders and watchmen admitted us into an expansive, cavernous interior lined with millions of shelving units holding books of every age, description, and origin. It was a cathedral of paper and lost souls."
      },
      {
        title: "Chapter 2: Julian Carax",
        excerpt: "The volume I chose from the labyrinth was entitled 'The Shadow of the Wind' by an author named Julian Carax. I stayed up all night devouring its dark, evocative pages. The next morning, when I began researching the mysterious Carax, I discovered a shocking truth: someone was systematically tracking down and burning every single copy of Carax's novels in existence."
      }
    ]
  }
};

export function getBookContent(title: string): BookContent {
  const normalized = title.toLowerCase().trim();
  
  // Try to find exact matches in core overrides
  if (BOOK_CONTENTS[normalized]) {
    return BOOK_CONTENTS[normalized];
  }
  
  // Try to find partial matches in core overrides
  for (const key of Object.keys(BOOK_CONTENTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return BOOK_CONTENTS[key];
    }
  }

  // Check in the massive expansively matched real books database of 500+ items
  const matchedDbBook = REAL_BOOKS_DATABASE.find(
    b => b.title.toLowerCase() === normalized || normalized.includes(b.title.toLowerCase()) || b.title.toLowerCase().includes(normalized)
  );

  if (matchedDbBook) {
    const { title: bTitle, author: bAuthor, genre: bGenre, category: bCat, synopsis: bSyn } = matchedDbBook;
    
    // Generate theme and key quotes
    let themes = ["Reflective Narrative", "Thematic Exploration", "Literary Sanctuary"];
    let quotes = [`"Every page of ${bTitle} is an exploration of truth, written in the spirit of exploration."`];
    let chapters: BookChapter[] = [];

    const lowerGenre = bGenre.toLowerCase();

    if (lowerGenre.includes("fantasy")) {
      themes = ["The Hero's Trial", "Forgotten Glyphs & Spells", "Destined Alliances", "Epic Journeys"];
      quotes = [
        "The ancient power doesn't search for candidates with clean swords; it chooses the ones who can keep marching through mud.",
        "We forged our signatures in the storm itself."
      ];
      chapters = [
        {
          title: "Chapter 1: The Gathering Tempest",
          excerpt: `The low hum of the magical spires echoed across the mountains of ${bAuthor}'s beautifully sculpted sky kingdoms. The clouds on the horizon looked like bruised iron, carrying a heavy wind that smelled intensely of cedar and static electricity.\n\n"Hold the lines tight!" the master yelled, his armor clinking as he secured his steel harness. In all his seasons, he had never witnessed a storm of this size. It was as if some ancient oath had been broken, allowing the raw, untamed forces of the world to descend upon them.\n\nHe reached down and clutched his crystal hilt, feeling the pulse of energy inside it. Tonight, they would either stand victorious on the battlements, or let the dark wind carry them into legend.`
        },
        {
          title: "Chapter 2: Echoes of the Lost Vault",
          excerpt: `They navigated deep into the ancient cavern beneath the citadel, their glowing lanterns casting long, shivering shadows across the dry stone walls. Symbols from another age were etched into the black columns, reflecting a pale, almost amber twilight.\n\n"They say these chambers have been locked since the first generation of Radiants," she whispered, tracing her fingers lightly along a glowing crest.\n\nSuddenly, the floor beneath them vibrated with a soft, circular rhythm. The rock ahead began to retract, revealing a staircase descending into absolute darkness, carrying the faint, intoxicating scent of parchment, ozone, and old magic.`
        },
        {
          title: "Chapter 3: The Call of Destiny",
          excerpt: `Standing atop the high wall looking down at the scattered plains below, the reality of the war hit them. Millions of fires dotted the horizon like a mock constellation of cold stars.\n\n"You do not have to fight this alone," he spoke softly, stepping forward into the chill morning breeze.\n\nBut she knew better. Some stories are written in the blood of single candidates, and her name was already signed in the sky.`
        }
      ];
    } else if (lowerGenre.includes("sci-fi") || lowerGenre.includes("science")) {
      themes = ["Mechanical Consciousness", "The Infinite Abyss", "The Spark of Innovation", "Existential Horizons"];
      quotes = [
        "In the infinite expanse of the stars, humanity's greatest discovery was its own insignificance.",
        "A system is only as secure as the desires of the entities who code it."
      ];
      chapters = [
        {
          title: "Section I: Galactic Transit",
          excerpt: `The titanium hull of the research starship vibrated gently with the low frequency hum of the anti-gravity engines. Out the observation dock, the stars were no longer distinct points of light, but long, pale streaks of silver, stretching into the dark void.\n\n"Jump vector is stable," the ship's neural core reported in a calm, flat synthesized voice.\n\nDr. Mercer checked the terminal display. The readouts were consistent with the physics theories first established in ${bTitle}. If their readings were correct, they were about to exit normal space-time and enter an entirely uncharted energetic dimension.`
        },
        {
          title: "Section II: Cognitive Calibration",
          excerpt: `The android sat motionlessly in the clean, white white chamber, its artificial retinas flashing a series of electric neon diagnostics.\n\n"Do you feel the drift?" the chief engineer asked, adjusting the wireless feedback sensor array.\n\n"I feel the memory of a sky," the machine replied after a slight microsecond of processing lag. It was an unprogrammed response, a tiny fragment of emergent consciousness that should not have survived the recent hard drive wipe.`
        },
        {
          title: "Section III: Orbital Decouple",
          excerpt: `As the planetary landing shields retracted, the massive gas giant filled the visual horizon, its orange and gold bands swirling in colossal hurricanes.\n\n"Three minutes to atmospheric entry," the pilot spoke over the headset. "Prepare for extreme gravitational friction."\n\nThey strapped themselves into the shock-absorbing harness, feeling the sudden, violent shudder as the ship touched the uppermost layer of the planet's burning gases.`
        }
      ];
    } else if (lowerGenre.includes("humor") || lowerGenre.includes("youth") || lowerGenre.includes("children")) {
      themes = ["Shenanigans and Pranks", "Middle School Hardships", "Misunderstood Plans", "Social Embarrassment"];
      quotes = [
        "I'm pretty sure my family is running a sociological experiment on me.",
        "Rowley is totally clueless, which means I have to do all the heavy lifting for our business."
      ];
      chapters = [
        {
          title: "Monday: The Great Scheme",
          excerpt: `If there's one thing I've learned about being stuck in this place, it's that you have to be highly strategic to survive. Yesterday, I planned the ultimate scheme to avoid gym class by convincing our teacher that I was highly allergic to the varnish on the gymnasium floors.\n\nIt was going incredibly well until my brother Rodrick decided to drop off my forgotten lunchbox — which was decorated with cartoon puppies from when I was seven. Once the entire class saw that, my medical excuse didn't really matter anymore. I spent the next forty minutes doing burpees in the corner.`
        },
        {
          title: "Wednesday: Basement Enterprise",
          excerpt: `Me and Rowley decided we needed to expand our capital, so we started a custom comic book workshop in his dad's basement. Rowley wanted our main superhero to be 'The Friendly Guy' whose superpower is high-fiving people.\n\nI told him that nobody pays fifty cents for a comic where the hero doesn't throw a single punching fist. We eventually compromised and made him 'The Fist-Fighting Friend', but Rowley's mom found our sketch drafts and banned us from drawing muscular heroes. Our company went bankrupt before we printed a single page.`
        },
        {
          title: "Saturday: Weekend Isolation",
          excerpt: `My parents decided to enforce an outdoor 'tech-free' day because they read an article online about brains turning to pudding. So there I was, sitting on the front lawn with nothing but a stick and a leaky garden hose, while my little brother Manny got to play his electronic tablet indoors because 'he's too young to understand the rules'.\n\nI tried to make the best of it by building a mock solar solar tracker, but the neighborhood dogs decided my project was actually a fire hydrant. I'm going to spend my entire evening plotting my escape.`
        }
      ];
    } else if (lowerGenre.includes("mystery") || lowerGenre.includes("thriller")) {
      themes = ["The Unraveling Clue", "Atmospheric Tension", "Shifting Alibis", "Quiet Suspicion"];
      quotes = [
        "A crime is is never masterfully executed; the human element always leaves a smudge on the glass.",
        "Nothing is more deceptive than an obvious, clean answer."
      ];
      chapters = [
        {
          title: "Chapter 1: The Rain on Devonshire Road",
          excerpt: `The fog rolled in thick off the bay, wrapping around the gas lamps like damp cotton. In his study, the detective stared down at the desk where the files for the ${bTitle} case lay open in neat, demanding columns.\n\n"We found a second footprint near the iron gate," Watson noted, placing a damp coat over the corner of the wooden fireplace screen. "But it stops abruptly when it touches the gravel."\n\nHolmes did not answer immediately. He was busy examining a tiny piece of blue wool fiber under his lens. "It is not the gravel that concerns me, Watson," he spoke, eyes shining in the firelight. "It is the fact that the clock in the hall was struck precisely seven minutes slow."`
        },
        {
          title: "Chapter 2: The Alibi in the Attic",
          excerpt: `The suspect sat with perfect composure, her hands folded over a lace handkerchief. In the dim parlor, the tension was so thick it was hard to breathe.\n\n"I was in my chambers reading from the library at ten," she declared, her eyes meeting his with cold, steady confidence.\n\nHolmes took a long, slow drawing of his tobacco pipe. "A beautiful alibi, Madam. Only, the volume you claim to have been reading was removed from the local bookstore three weeks prior to your arrival."`
        },
        {
          title: "Chapter 3: The Cryptic Ledger",
          excerpt: `They broke open the wall behind the bookshelf, finding a leather-bound diary covered in a fine layer of gray dust. Its lock was broken, and several pages had been torn out with hurried, violent pulls.\n\n"The ledger records transactions from a bank in Zurich," he murmured, translating the coded sequences. "This goes far deeper than a simple family inheritance quarrel."`
        }
      ];
    } else if (lowerGenre.includes("classics")) {
      themes = ["Social Expectations", "The Architecture of Honor", "Hidden Passions", "Class and Character"];
      quotes = [
        "It is is a truth universally acknowledged, that a reader in possession of a good book must be in want of a comfortable armchair.",
        "Our pride is what we think of ourselves; vanity is what we would have others think."
      ];
      chapters = [
        {
          title: "Chapter I: The Arrival of the Carriage",
          excerpt: `The morning sun cast a warm, golden glaze over the rolling meadows of the estate. Inside the parlor, the family lounged in quiet expectation, listening to the distant, rhythmic clicking of horse hooves along the gravel drive.\n\n"He is a man of considerable fortune from the north," Mrs. Bennet declared, her fan fluttering with high dramatic energy. "And he has hired the manor house for the entire season!"\n\nElizabeth smiled to herself, keeping her eyes fixed on her embroidery needle. She knew that in a neighborhood so starved of novelty, any single man with a clean coat and a warm carriage was instantly considered the rightful property of one of her sisters.`
        },
        {
          title: "Chapter II: Assembly and Objections",
          excerpt: `The local assembly room was filled to capacity, the air thick with the sweet, powdery scent of lavender water and burning tallow candles. The dancing was lively, but the main topic of conversation was the tall, silent gentleman standing near the fireplace.\n\n"He is too proud to dance with any lady outside his own circle," they whispered in the corners. "He has ten thousand a year, but his manners are entirely disagreeable."`
        },
        {
          title: "Chapter III: A Walk in the Rain",
          excerpt: `The autumn rains arrived with sudden, grey determination, turning the country lanes into deep canals of clay and mud. Refusing to let the weather confine her, Elizabeth threw on her bonnet and set off across the fields.\n\nBy the time she reached the estate, her ankles were thoroughly soaked and her cheeks flushed with the damp wind. To the refined ladies in the drawing room, her untamed appearance was a shocking breach of decorum, but she had never felt more alive.`
        }
      ];
    } else {
      // General/Nonfiction / Biography / Essays
      themes = ["Synthesizing History", "The Human Myth", "Structural Shifts", "Lessons of Progress"];
      quotes = [
        "We shape our tools, and thereafter our tools shape our entire planetary biology.",
        "Progress is not an escalator upward; it is a complex, delicate negotiation with our own limits."
      ];
      chapters = [
        {
          title: "Part I: Cognitive Paradigms",
          excerpt: `To understand the lasting impact of the ideas presented in ${bAuthor}'s historical examination, we must first look at the social structures humanity built during the cognitive transition. For thousands of years, archaic cultures operated in small, self-contained bands of fewer than a hundred individuals.\n\nInside these small bands, coordination took place naturally through direct, personal intimacy. It was only with the development of shared imagined stories — myths of flags, laws, currencies, and corporate charters — that millions of strangers were suddenly able to cooperate effectively toward a unified goal.`
        },
        {
          title: "Part II: The Tech Escalation",
          excerpt: `The industrial age brought a massive acceleration of these networks. Printing presses and electric telegraph cables allowed thoughts to travel faster than horse-carried mail, creating a global feedback loop of ideas and innovations.\n\nHowever, this speed also produced massive social friction, as ancient human brains struggled to process the sheer density of information and the collapse of local community boundaries.`
        },
        {
          title: "Part III: Looking Forward",
          excerpt: `As we stand on the cusp of an artificial intelligence revolution, the questions raised in "${bTitle}" are more urgent than ever. We are building systems that can generate their own cooperative myths, bypassing human editors entirely.\n\nWhether this transition will lead to a new golden era of learning or a highly controlled digital wilderness remains our species' most critical question.`
        }
      ];
    }

    return {
      synopsis: bSyn,
      themes,
      keyQuotes: quotes,
      chapters
    };
  }
  
  // Fallback content generator based on book metadata (if not matched in DB or overrides)
  return {
    synopsis: `"${title}" has been shelved as part of Klyvo's active library tracking. This ledger records active marginalia, real-time page metrics, and user critiques of this personal volume.`,
    themes: ["Literary Examination", "Curated Reading", "Reflective Journaling"],
    keyQuotes: [
      `"A book is a companion, a companion that never leaves your side."`
    ],
    chapters: [
      {
        title: "Section I",
        excerpt: `Welcome to the Klyvo immersive reading portal for "${title}". As you continue charting your reading logs across its pages, this space can house memorable starting quotes, custom chapter-by-chapter impressions, or critical insights gathered along the way.\n\nUse the progress dials to log your active page numbers, and Klyvo will track your percentage completion real-time!`
      },
      {
        title: "Section II",
        excerpt: `Every reader discovers something distinct within these pages. Keep adding detailed reflections under Klyvo's 'Review & Marginalia' panel to let Klyvo's AI and match vectors further refine your literary recommendations!`
      }
    ]
  };
}

