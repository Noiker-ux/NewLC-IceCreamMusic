export const premiumPlansArray = [
  {
    src: "arrowsUp1",
    name: "Стандарт",
    desc: "Подписка для тех, кто хочет попробовать и не настроен серьезно на своё творчество.",
    price: 890,
    markers: [
      "Один релиз в месяц 😔",
      "Дистрибуция за 5 дней",
      "Идеально для новичков",
    ],
    border: false,
    system_name: "standard",
    freeReleases: 1,
  },
  {
    src: "arrowsUp3",
    name: "Энтерпрайз",
    desc: "Идеальное решение для настоящих артистов, настроеных на получение результатов.",
    price: 1490,
    markers: [
      "Безлимитные релизы",
      "Выгрузка на площадки от 1 часа",
      "Приоритетная поддержка с личным менеджером",
      "100% роялти",
      "Приоритетная модерация",
      "Премиальные функции",
    ],
    border: true,
    system_name: "enterprise",
    freeReleases: 6,
  },
  {
    src: "arrowsUp2",
    name: "PRO",
    desc: "План для тех, у кого строго ограничен бюджет но тем не менее он хочет быть услышанным.",
    price: 1190,
    markers: [
      "До 6 релизов в месяц",
      "Выгрузка на площадки до 3-х дней",
      "Персональная поддержка",
    ],
    border: false,
    system_name: "professional",
    freeReleases: Infinity,
  },
] as const;

export const premiumPlans: Record<
  (typeof premiumPlansArray)[number]["system_name"],
  (typeof premiumPlansArray)[number]
> = premiumPlansArray.reduce((result, p) => {
  return { ...result, [p.system_name]: p };
}, {} as any);
