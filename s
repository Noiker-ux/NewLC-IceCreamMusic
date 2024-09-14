      {/* <div className={style.main_info}>
        <div className={style.wrapper}>
          <div>
            <MyTitle className={style.title} Tag={"h2"}>
              Обложка
            </MyTitle>
            <MyText className={style.desc}>
              Добавьте обложку к вашему релизу
            </MyText>
          </div>
          <MyInpFile />
          <div className={style.info_preview}>
            <MyText className={style.info_previewItem}>
              Минимальный размер изображения: 3000x3000px
              <br />
              Максимальный размер изображения: 6000x6000px
              <br />
              Максимальный размер файла: 30MB
            </MyText>
          </div>
        </div>
        <div className={classNames(style.wrapper, style.mainData)}>
          <MyTitle className={style.title} Tag={"h2"}>
            Основные данные
          </MyTitle>
          <MyText className={style.desc}>
            Заполните общую информацию по вашему релизу
          </MyText>
          <div className={style.mainInputs}>
            <div className={style.w50}>
              <div>
                <MyInput
                  className={style.inp}
                  type={"text"}
                  inpLk
                  label={"Название релиза"}
                  placeholder="Введите название релиза"
                />
                <MyText className={style.inpDesc}>
                  Название релиза не должно содержать грубых и политических
                  высказываний
                </MyText>
              </div>
              <MyInput
                className={style.inp}
                type={"text"}
                inpLk
                label={"Никнейм артиста (исполнителя)"}
                placeholder="Введите никнейм артиста"
              />

              <MyInput
                className={style.inp}
                type={"text"}
                inpLk
                label={"Жанр"}
                placeholder="Hip-hop/Rap"
              />
            </div>
            <div className={style.w50}>
              <div>
                <MyInput
                  className={style.inp}
                  type={"text"}
                  inpLk
                  label={"Версия релиза"}
                  placeholder="Введите версию релиза"
                />
                <MyText className={style.inpDesc}>
                  Например, Remix, prod by и т.д. Можно оставить пустым
                </MyText>
              </div>

              <MyInput
                className={style.inp}
                type={"date"}
                inpLk
                label={"Дата релиза"}
              />

              <MyInput
                className={style.inp}
                type={"text"}
                inpLk
                label={"Тип"}
                placeholder="Сингл"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(style.wrapper, style.trackList)}>
        <div>
          <MyTitle className={style.title} Tag={"h2"}>
            Трек-лист
          </MyTitle>
          <MyText className={style.desc}>
            Загрузите релизы и укажите дополнительную информацию к каждому
            творению
          </MyText>
        </div>
        <div className={style.tracks}>
          <div onClick={() => setActive(true)}>asd</div>

          <ModalPopup
            active={active}
            setActive={setActive}
            title={"Форма релиза"}
            width={"60%"}
            height={"auto"}
          >
            <div className={style.popup}>
              <MyInput
                type={"text"}
                label={"Название трека"}
                inpLk
                placeholder="Название"
                className={style.inp}
              />
              <div className={style.row}>
                <MyInput
                  type={"text"}
                  label={"ФИО битмейкера"}
                  inpLk
                  placeholder="Иванов Иван Иванович"
                  className={style.inp}
                />
                <MyInput
                  type={"text"}
                  label={"ФИО автора"}
                  inpLk
                  placeholder="Петров Петр Петрович"
                  className={style.inp}
                />
              </div>
              <MyTextArea className={style.popupTextarea} label="Текст песни" />
              <div className={style.row}>
                <MyInput
                  type={"text"}
                  label={"Отрывок для TikTok"}
                  inpLk
                  placeholder="00:41 - 01:41"
                  className={style.inp}
                />
                <MyInput
                  type={"text"}
                  label={"Нецензурная лексика"}
                  inpLk
                  placeholder="Нет"
                  className={style.inp}
                />
              </div>
              <label htmlFor="track">
                <div className={style.inpTract_wrap}>
                  <MyText className={style.inpTract_wrapTitle}>
                    Нажмите чтобы занрузить аудиофайл
                  </MyText>
                  <MyText className={style.inpTract_wrapDesc}>
                    (Файл должен быть формата 44100кгц. wav, 16-24 бит)
                  </MyText>
                </div>
                <input className={style.inpTract} id="track" type="file" />
              </label>
              <div className={style.addbtn}>Добавить</div>
            </div>
          </ModalPopup>
        </div>
      </div> */}