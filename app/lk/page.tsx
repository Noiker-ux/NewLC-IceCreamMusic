import Image from 'next/image';
import styles from './page.module.css';
import MyInput from '@/shared/MyInput/MyInput';
import MyTitle from '@/shared/MyTitle/MyTitle';
import Logo from '@/shared/Logo/Logo';
import NewsCard from '@/entities/NewsCard/NewsCard';
import { dataNews } from '@/data/dataNews';

export default function Home() {
	return (
		<>
			<MyTitle Tag={'h3'}>Новости</MyTitle>
			<div className={styles.news}>
				{dataNews.map((newsItem) => (
					<NewsCard
						id={newsItem.id}
						anons={newsItem.anons}
						dateCreate={newsItem.dateCreate}
						preview={newsItem.preview}
						title={newsItem.title}
						view={newsItem.view}
						key={newsItem.id}
					/>
				))}
			</div>
		</>
	);
}
