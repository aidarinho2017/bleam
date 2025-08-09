import { CatalogueItem, Contact, PurchaseRecord } from "./types";

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Айдос Бек",
    phone: "+7 701 123 4567",
    email: "aidos.bek@example.kz",
    lastActivity: new Date().toISOString(),
    purchaseHistory: [
      { product: "Ерлер жейде (M)", quantity: 1, date: new Date().toISOString() },
      { product: "Джинсы Classic (32)", quantity: 1, date: new Date().toISOString() },
    ],
    notes: "VIP клиент, предпочитает WhatsApp",
  },
  {
    id: "2",
    name: "Алтынай Салым",
    phone: "+7 777 555 2211",
    email: "altynai.s@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "3",
    name: "Жанар Қуат",
    phone: "+7 702 987 6543",
    email: "zhanar.k@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 3).toISOString(),
    purchaseHistory: [
      { product: "Әйелдер көйлегі (S)", quantity: 2, date: new Date().toISOString() },
      { product: "Пальто нәзік (M)", quantity: 1, date: new Date().toISOString() },
      { product: "Кардиган жұмсақ (L)", quantity: 1, date: new Date().toISOString() },
      { product: "Белдік былғары", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "4",
    name: "Нұрсұлтан Ерлан",
    phone: "+7 705 111 2233",
    email: "nursultan.y@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 10).toISOString(),
    purchaseHistory: [
      { product: "Куртка жеңіл (L)", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "5",
    name: "Айгерім Тас",
    phone: "+7 706 333 5566",
    email: "aigerim.t@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 1).toISOString(),
    purchaseHistory: [
      { product: "Юбка плиссе (M)", quantity: 1, date: new Date().toISOString() },
      { product: "Трикотаж свитер (S)", quantity: 2, date: new Date().toISOString() },
    ],
  },
  {
    id: "6",
    name: "Еркебұлан Саин",
    phone: "+7 707 444 7788",
    email: "erkebulan.s@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 6).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "7",
    name: "Динара Аман",
    phone: "+7 708 999 0001",
    email: "dinara.a@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 15).toISOString(),
    purchaseHistory: [
      { product: "Жіңішке шалбар (M)", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "8",
    name: "Рүстем Нұр",
    phone: "+7 747 222 3344",
    email: "rustem.n@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 5).toISOString(),
    purchaseHistory: [
      { product: "Ерлер пиджак (L)", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "9",
    name: "Меруерт Жан",
    phone: "+7 771 112 2233",
    email: "meruert.j@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 20).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "10",
    name: "Ернар Әли",
    phone: "+7 775 555 6677",
    email: "ernar.a@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 8).toISOString(),
    purchaseHistory: [
      { product: "Футболка basic (XL)", quantity: 2, date: new Date().toISOString() },
      { product: "Капюшон hoodie (L)", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "11",
    name: "Санжар Өмір",
    phone: "+7 700 321 2323",
    email: "sanzhar.o@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 4).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "12",
    name: "Аружан Тал",
    phone: "+7 776 909 1010",
    email: "aruzhan.t@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 12).toISOString(),
    purchaseHistory: [
      { product: "Көкірекше (S)", quantity: 1, date: new Date().toISOString() },
    ],
  },
];

export const mockCatalogue: CatalogueItem[] = [
  { id: "SKU-1001", name: "Ерлер жейде", price: 14990, sizes: [
    { size: "S", available: 12 },
    { size: "M", available: 18 },
    { size: "L", available: 10 },
    { size: "XL", available: 6 },
  ] },
  { id: "SKU-1002", name: "Әйелдер көйлегі", price: 24990, sizes: [
    { size: "XS", available: 5 },
    { size: "S", available: 9 },
    { size: "M", available: 7 },
  ] },
  { id: "SKU-1003", name: "Джинсы Classic", price: 19990, sizes: [
    { size: "S", available: 8 },
    { size: "M", available: 14 },
    { size: "L", available: 9 },
  ] },
  { id: "SKU-1004", name: "Куртка жеңіл", price: 29990, sizes: [
    { size: "M", available: 7 },
    { size: "L", available: 5 },
    { size: "XL", available: 3 },
  ] },
  { id: "SKU-1005", name: "Юбка плиссе", price: 15990, sizes: [
    { size: "S", available: 6 },
    { size: "M", available: 11 },
  ] },
  { id: "SKU-1006", name: "Трикотаж свитер", price: 17990, sizes: [
    { size: "S", available: 10 },
    { size: "M", available: 10 },
    { size: "L", available: 10 },
  ] },
  { id: "SKU-1007", name: "Жіңішке шалбар", price: 16990, sizes: [
    { size: "M", available: 12 },
    { size: "L", available: 8 },
  ] },
  { id: "SKU-1008", name: "Ерлер пиджак", price: 34990, sizes: [
    { size: "L", available: 4 },
    { size: "XL", available: 2 },
  ] },
  { id: "SKU-1009", name: "Футболка basic", price: 9990, sizes: [
    { size: "M", available: 30 },
    { size: "L", available: 25 },
    { size: "XL", available: 10 },
  ] },
  { id: "SKU-1010", name: "Капюшон hoodie", price: 22990, sizes: [
    { size: "M", available: 9 },
    { size: "L", available: 7 },
    { size: "XL", available: 5 },
  ] },
  { id: "SKU-1011", name: "Көкірекше", price: 13990, sizes: [
    { size: "S", available: 8 },
    { size: "M", available: 6 },
  ] },
];

export const mockSales: PurchaseRecord[] = [
  {
    id: "SALE-2001",
    salesperson: "Айару",
    items: [
      { itemId: "SKU-1009", name: "Футболка basic", quantity: 3 },
      { itemId: "SKU-1003", name: "Джинсы Classic", quantity: 1 },
    ],
    price: 3 * 9990 + 19990,
    date: new Date().toISOString(),
  },
  {
    id: "SALE-2002",
    salesperson: "Ерасыл",
    items: [
      { itemId: "SKU-1001", name: "Ерлер жейде", quantity: 2 },
    ],
    price: 2 * 14990,
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "SALE-2003",
    salesperson: "Меруерт",
    items: [
      { itemId: "SKU-1002", name: "Әйелдер көйлегі", quantity: 1 },
      { itemId: "SKU-1005", name: "Юбка плиссе", quantity: 1 },
    ],
    price: 24990 + 15990,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "SALE-2004",
    salesperson: "Нұрсұлтан",
    items: [
      { itemId: "SKU-1004", name: "Куртка жеңіл", quantity: 1 },
    ],
    price: 29990,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "SALE-2005",
    salesperson: "Айгерім",
    items: [
      { itemId: "SKU-1006", name: "Трикотаж свитер", quantity: 2 },
    ],
    price: 2 * 17990,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "SALE-2006",
    salesperson: "Рүстем",
    items: [
      { itemId: "SKU-1008", name: "Ерлер пиджак", quantity: 1 },
    ],
    price: 34990,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "SALE-2007",
    salesperson: "Санжар",
    items: [
      { itemId: "SKU-1007", name: "Жіңішке шалбар", quantity: 1 },
      { itemId: "SKU-1009", name: "Футболка basic", quantity: 2 },
    ],
    price: 16990 + 2 * 9990,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "SALE-2008",
    salesperson: "Аружан",
    items: [
      { itemId: "SKU-1010", name: "Капюшон hoodie", quantity: 1 },
      { itemId: "SKU-1011", name: "Көкірекше", quantity: 1 },
    ],
    price: 22990 + 13990,
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "SALE-2009",
    salesperson: "Ернар",
    items: [
      { itemId: "SKU-1003", name: "Джинсы Classic", quantity: 1 },
    ],
    price: 19990,
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "SALE-2010",
    salesperson: "Жанар",
    items: [
      { itemId: "SKU-1002", name: "Әйелдер көйлегі", quantity: 1 },
    ],
    price: 24990,
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "SALE-2011",
    salesperson: "Алтынай",
    items: [
      { itemId: "SKU-1001", name: "Ерлер жейде", quantity: 1 },
      { itemId: "SKU-1005", name: "Юбка плиссе", quantity: 1 },
    ],
    price: 14990 + 15990,
    date: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: "SALE-2012",
    salesperson: "Еркебұлан",
    items: [
      { itemId: "SKU-1009", name: "Футболка basic", quantity: 1 },
      { itemId: "SKU-1010", name: "Капюшон hoodie", quantity: 1 },
    ],
    price: 9990 + 22990,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];
