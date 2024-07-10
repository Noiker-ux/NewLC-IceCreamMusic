export default interface INewsCardProps {
  id: number;
  dateCreate: Date;
  title: string;
  anons: string;
  preview: string;
  view:
    | "MeetTheFounder"
    | "StrategyCard"
    | "AestheticCard"
    | "CoomingCard"
    | "NewDrop";
}

// MeetCard - Карточка встречи
// StrategyCard - Стратегическая карточка
// AestheticCard - Эстетическая карточка
// CoomingCard - Визитная карточка
// NewDrop - Новый дроп
