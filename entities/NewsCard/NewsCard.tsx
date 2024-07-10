import MyText from '@/shared/MyText/MyText';

import dateFormatter from '@/utils/dateFormatter';
import { useState } from 'react';
import classNames from 'classnames';
import INewsCardProps from './NewsCard.props';
import MyTitle from '@/shared/MyTitle/MyTitle';

import Image from 'next/image';
// Styles
import style from './NewsCard.module.css';
import mtf from './designs/MeetTheFounder.module.css';
import strtg from './designs/StrategyCard.module.css';

const NewsCard = ({
	id,
	dateCreate,
	title,
	anons,
	preview,
	view,
}: INewsCardProps) => {
	const formatterDate = dateFormatter(dateCreate);

	switch (view) {
		case 'MeetTheFounder':
			return (
				<div className={classNames(style.newsCard, mtf[`newsCard-${view}`])}>
					<MyTitle className={mtf[`title-${view}`]} Tag='h2'>
						{title}
					</MyTitle>
					<div className={mtf[`body-${view}`]}>
						<MyText className={mtf[`anons-${view}`]}>{anons}</MyText>
						<Image
							className={mtf[`preview-${view}`]}
							alt='Превью картинка'
							src={preview}
							width={150}
							height={150}
						/>
					</div>
					<MyText className={mtf[`date-${view}`]}>{formatterDate}</MyText>
				</div>
			);
		case 'StrategyCard':
			return (
				<div className={classNames(style.newsCard, strtg[`newsCard-${view}`])}>
					<Image
						className={strtg[`preview-${view}`]}
						alt='Превью картинка'
						src={preview}
						width={150}
						height={150}
					/>
				</div>
			);
		default:
			break;
	}
};
export default NewsCard;
