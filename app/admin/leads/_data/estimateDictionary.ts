export const ESTIMATE_DEFAULT_SERVICES = {
  ASSEMBLY: {
    name: "Сборка световой вывески / букв",
    costPrice: 15000,
    sellPrice: 22000,
    unit: "PIECE" as const,
  },
  INSTALLATION: {
    name: "Монтаж фасадной вывески",
    costPrice: 25000,
    sellPrice: 35000,
    unit: "PIECE" as const,
  },
  LOGISTICS: {
    name: "Доставка и логистика (Газель)",
    costPrice: 8000,
    sellPrice: 12000,
    unit: "PIECE" as const,
  },
  EQUIPMENT: {
    name: "Аренда автовышки (18м)",
    costPrice: 12000,
    sellPrice: 16000,
    unit: "PIECE" as const,
  },
};
