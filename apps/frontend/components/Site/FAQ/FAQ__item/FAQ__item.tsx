import IFAQ from '@/data/site/FAQ/FAQ.interface';
import style from './FAQ__item.module.css';
export const FAQ__item = ({ answer, question }: IFAQ) => {
	return (
		<div className={style.faq__item}>
			<h3 className={style.question}>{question}</h3>
			<p className={style.answer}>{answer}</p>
		</div>
	);
};
