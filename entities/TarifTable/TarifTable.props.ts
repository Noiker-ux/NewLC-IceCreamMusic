export default interface ITarifTable {
  aspect: string;
  standart: string | boolean;
  enterprize: string | boolean;
  pro: string | boolean;
}

export const ArrayTarifTable: ITarifTable[] = [
  {
    aspect: "Загрузка в социальные сети",
    standart: true,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Загрузка на стриминговые платформы",
    standart: true,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Доход от прослушиваний",
    standart: "80%",
    enterprize: "100%",
    pro: "85%",
  },
  {
    aspect: "Среднее время модерации",
    standart: "36 часов",
    enterprize: "6 часов",
    pro: "12 часов",
  },
  {
    aspect: "Возможность устанавливать дату релиза",
    standart: true,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Среднее время отгрузки",
    standart: "24 часов",
    enterprize: "5 часов",
    pro: "10 часов",
  },
  {
    aspect: "Количество релизов в месяц",
    standart: "1",
    enterprize: "Безлимитно",
    pro: "6",
  },
  {
    aspect: "Еженедельные отчеты",
    standart: true,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Ежедневный анализ музыкальной карьеры",
    standart: true,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Дневная аналитика трендов и прослушиваний по трекам",
    standart: false,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Приоритетная поддержка с личным менеджером",
    standart: false,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Создание мультиссылок",
    standart: false,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Официально верифицированные финансовые отчеты",
    standart: false,
    enterprize: true,
    pro: true,
  },
  {
    aspect: "Возможность указывать свой лейбл (P-Line/Imprint)",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Подача на промо при помощи нейросети",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Приоритетная модерация",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Приоритетная загрузка",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Подтверждение страницы Spotify (синяя галочка)",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Подтверждение страницы Apple Music",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Уникальные смарт-ссылки",
    standart: false,
    enterprize: true,
    pro: false,
  },
  {
    aspect: "Добавление текста к трекам",
    standart: false,
    enterprize: true,
    pro: false,
  },
];
