export default function moneyFormatter(money: number) {
  return money.toLocaleString("ru-RU") + " ₽";
}
