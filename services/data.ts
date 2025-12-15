
import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // PENS
  {
    id: 1,
    name: "Premium Gel Pen Set",
    description: "Set of 10 smooth-writing gel pens in assorted colors. Perfect for journaling and official use.",
    price: 250,
    category: "Pens",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 120,
    userReviews: []
  },
  {
    id: 6,
    name: "Classic Fountain Pen",
    description: "Elegant design with a fine nib. Includes 2 ink cartridges. A symbol of luxury.",
    price: 850,
    category: "Pens",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 55,
    userReviews: []
  },
  {
    id: 13,
    name: "Ballpoint Pen Box (50 pcs)",
    description: "Bulk pack of reliable blue ballpoint pens. Ideal for office and school distribution.",
    price: 400,
    category: "Pens",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 200,
    userReviews: []
  },
  {
    id: 14,
    name: "Fine Liner Set",
    description: "0.4mm fine tip markers for precision drawing and writing. Set of 12.",
    price: 350,
    category: "Pens",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 80,
    userReviews: []
  },
  {
    id: 15,
    name: "Calligraphy Pen Set",
    description: "Includes 3 nib sizes and black ink cartridges. Perfect for beginners.",
    price: 650,
    category: "Pens",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 40,
    userReviews: []
  },

  // REGISTERS & NOTEBOOKS
  {
    id: 32,
    name: "Classmate Long Register",
    description: "300 Pages, Soft Cover, Single Ruled. Ideal for school and college notes.",
    price: 140,
    category: "Registers",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 320,
    userReviews: []
  },
  {
    id: 33,
    name: "Rough Register Pack (3 pcs)",
    description: "Economy pack of rough registers for daily practice. 200 pages each.",
    price: 180,
    category: "Registers",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    rating: 4.3,
    reviews: 150,
    userReviews: []
  },
  {
    id: 2,
    name: "A5 Hardcover Notebook",
    description: "Eco-friendly paper, 200 pages, dotted grid. Durable and stylish.",
    price: 350,
    category: "Registers",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 85,
    userReviews: []
  },
  {
    id: 16,
    name: "Spiral Subject Register",
    description: "300 pages, single ruled, high-quality white paper. Great for college notes.",
    price: 180,
    category: "Registers",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800",
    rating: 4.4,
    reviews: 150,
    userReviews: []
  },
  {
    id: 17,
    name: "Pocket Diary 2024",
    description: "Leather-finish pocket diary with calendar and planner pages.",
    price: 120,
    category: "Registers",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 60,
    userReviews: []
  },

  // PAPERS & FILES
  {
    id: 34,
    name: "A4 Copier Paper (500 Sheets)",
    description: "75 GSM bright white multipurpose paper for printing and writing.",
    price: 380,
    category: "Files & Paper",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 500,
    userReviews: []
  },
  {
    id: 35,
    name: "Practical File (Physics/Chem)",
    description: "Hardbound practical notebook with interleaf pages for diagrams.",
    price: 120,
    category: "Files & Paper",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 200,
    userReviews: []
  },
  {
    id: 8,
    name: "Document File Folder",
    description: "Expandable file folder with 12 pockets. Keep your documents organized.",
    price: 299,
    category: "Files & Paper",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800",
    rating: 4.4,
    reviews: 89,
    userReviews: []
  },
  {
    id: 26,
    name: "Ring Binder",
    description: "A4 size 2-ring binder file. Durable PVC cover.",
    price: 150,
    category: "Files & Paper",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    rating: 4.3,
    reviews: 55,
    userReviews: []
  },
  {
    id: 27,
    name: "Clear Bag Folder",
    description: "L-shaped clear document folder, pack of 20.",
    price: 200,
    category: "Files & Paper",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 120,
    userReviews: []
  },

  // ART SUPPLIES
  {
    id: 3,
    name: "Artist Sketchbook",
    description: "Heavyweight paper suitable for ink, marker, and light watercolor.",
    price: 450,
    category: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 45,
    userReviews: []
  },
  {
    id: 10,
    name: "Acrylic Paint Set",
    description: "12 vibrant colors, non-toxic, quick-drying paints for canvas and wood.",
    price: 450,
    category: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 67,
    userReviews: []
  },
  {
    id: 19,
    name: "Watercolor Palette",
    description: "24 shades with mixing tray and brush. Professional grade.",
    price: 550,
    category: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 35,
    userReviews: []
  },
  {
    id: 20,
    name: "Canvas Board (10x12)",
    description: "Pack of 3 primed canvas boards ready for oil or acrylic painting.",
    price: 300,
    category: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 25,
    userReviews: []
  },
  {
    id: 21,
    name: "Drawing Pencils Set",
    description: "Graphite pencils ranging from 6H to 8B for shading and sketching.",
    price: 250,
    category: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 110,
    userReviews: []
  },

  // DESK ACCESSORIES
  {
    id: 4,
    name: "Office Desk Organizer",
    description: "Metal mesh organizer with multiple compartments for pens, clips, and notes.",
    price: 599,
    category: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 210,
    userReviews: []
  },
  {
    id: 11,
    name: "Sticky Notes Pack",
    description: "Neon colored sticky notes for reminders and bookmarks. Strong adhesive.",
    price: 120,
    category: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800",
    rating: 4.3,
    reviews: 150,
    userReviews: []
  },
  {
    id: 22,
    name: "Paper Clips Dispenser",
    description: "Magnetic paper clip holder with 100 colorful clips.",
    price: 150,
    category: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800",
    rating: 4.2,
    reviews: 45,
    userReviews: []
  },
  {
    id: 23,
    name: "Desktop Stapler",
    description: "Heavy duty stapler. Includes 1000 staples.",
    price: 220,
    category: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 130,
    userReviews: []
  },

  // MARKERS
  {
    id: 5,
    name: "Highlighter Pack (Pastel)",
    description: "Set of 6 pastel highlighters. Mild colors that don't bleed through paper.",
    price: 180,
    category: "Markers",
    image: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 300,
    userReviews: []
  },
  {
    id: 12,
    name: "Whiteboard Marker Set",
    description: "Pack of 4 (Red, Blue, Black, Green) erasable markers with low odor ink.",
    price: 200,
    category: "Markers",
    image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: 90,
    userReviews: []
  },
  {
    id: 24,
    name: "Permanent Markers (Black)",
    description: "Box of 10 bold black permanent markers. Waterproof and quick drying.",
    price: 250,
    category: "Markers",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 110,
    userReviews: []
  },

  // SCHOOL & EXAM ESSENTIALS
  {
    id: 9,
    name: "Geometry Box Set",
    description: "Complete mathematical drawing instruments box. Essential for school students.",
    price: 150,
    category: "Exam Essentials",
    image: "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 230,
    userReviews: []
  },
  {
    id: 36,
    name: "Exam Clipboard",
    description: "Transparent acrylic clipboard with strong grip. Allowed in exam halls.",
    price: 100,
    category: "Exam Essentials",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 90,
    userReviews: []
  },
  {
    id: 7,
    name: "Scientific Calculator",
    description: "Essential for engineering and math students. 240 functions.",
    price: 950,
    category: "Exam Essentials",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: 500,
    userReviews: []
  },
  {
    id: 25,
    name: "Correction Tape",
    description: "Instant correction tape, no drying time needed. 5mm x 12m.",
    price: 80,
    category: "Exam Essentials",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800",
    rating: 4.4,
    reviews: 70,
    userReviews: []
  },
  {
    id: 31,
    name: "Pencil Sharpener (Electric)",
    description: "Automatic pencil sharpener, battery operated.",
    price: 450,
    category: "Exam Essentials",
    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 30,
    userReviews: []
  }
];
