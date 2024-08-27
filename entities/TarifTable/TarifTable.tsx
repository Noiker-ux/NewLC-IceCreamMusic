import style from "./TarifTable.module.css";
import ITarifTable from "./TarifTable.props";
import SuccessIcon from "../../public/InfoIcon/Success.svg";

const TarifTable = ({ data }: ITarifTable[]) => {
  return (
    <table className={style.table}>
      <tr>
        <td></td>
        <td>Стандарт</td>
        <td>Энтерпрайз</td>
        <td>PRO</td>
      </tr>

      {data.map((t) => (
        <tr key={t.aspect}>
          <td>{t.aspect}</td>
          <td>
            {typeof t.standart == "string" ? (
              t.standart
            ) : typeof t.standart == "boolean" && t.standart ? (
              <SuccessIcon className={style.success} />
            ) : (
              "-"
            )}
          </td>
          <td>
            {typeof t.enterprize == "string" ? (
              t.enterprize
            ) : typeof t.enterprize == "boolean" && t.enterprize ? (
              <SuccessIcon className={style.success} />
            ) : (
              "-"
            )}
          </td>
          <td>
            {typeof t.pro == "string" ? (
              t.pro
            ) : typeof t.pro == "boolean" && t.pro ? (
              <SuccessIcon className={style.success} />
            ) : (
              "-"
            )}
          </td>
        </tr>
      ))}
    </table>
  );
};
export default TarifTable;
