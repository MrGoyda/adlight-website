// dictionaries/experts.ts

export interface ExpertProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  guarantee: string;
}

export const EXPERTS: Record<string, ExpertProfile> = {
  danijar: {
    id: "danijar",
    name: "Данияр Бауржанович",
    role: "Главный технолог ADLight",
    badge: "Собственное производство в Астане",
    guarantee: "Гарантия 1 год"
  },
  viktor: {
    id: "viktor",
    name: "Виктор Александрович",
    role: "Главный инженер-конструктор ADLight",
    badge: "Лицензия ГАСК I категории",
    guarantee: "Гарантия до 3 лет"
  },
  bahram: {
    id: "bahram",
    name: "Бахтияр Серикович",
    role: "Ведущий дизайнер фасадов ADLight",
    badge: "Более 150 оформленных фасадов",
    guarantee: "3D-визуализация бесплатно"
  }
};
