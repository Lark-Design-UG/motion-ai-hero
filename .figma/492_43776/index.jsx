import React from 'react';
import { Tag, IconButton, Avatar } from '@universe-design/react';
import { MoreOutlined, CalendarLineOutlined, DownExpandOutlined } from '@universe-design/icons-react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame2147229950}>
      <div className={styles.frame1564969}>
        <img
          src="../image/mqgdgbqz-mxj2md8.svg"
          className={styles.iconBitablegridOutli}
        />
        <p className={styles.taskKanban}>Task Kanban</p>
      </div>
      <div className={styles.frame2147229953}>
        <div className={styles.frame2036085532}>
          <div className={styles.tag}>
            <div className={styles.frame1321315864}>
              <Tag
                color="purple-option"
                closable={true}
                className={styles.aDTagOption}
              >
                In progress
              </Tag>
            </div>
            <IconButton
              type="text"
              size="small"
              icon={<MoreOutlined className={styles.iconMoreOutlined} />}
              className={styles.aDIconButton}
            />
          </div>
          <div className={styles.kAnbanCard}>
            <p className={styles.text}>UX/UI design</p>
            <div className={styles.frame1321315606}>
              <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.field1}>Deadline:</p>
              <p className={styles.a0824}>08/24</p>
            </div>
            <div className={styles.frame1321315588}>
              <DownExpandOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.a0824}>Owner:</p>
              <Tag
                shape="round"
                color="neutral-avatar"
                size="small"
                icon={
                  <Avatar
                    color="blue"
                    size="extra-small"
                    className={styles.iconMoreOutlined}
                  />
                }
                className={styles.aDIconButton}
              >
                Perez
              </Tag>
            </div>
            <div className={styles.frame2147229954}>
              <div className={styles.frame2147223619}>
                <div className={styles.rectangle346241647} />
                <div className={styles.rectangle346241648} />
                <div className={styles.rectangle346241649} />
              </div>
              <div className={styles.frame21472236192}>
                <div className={styles.rectangle346241648} />
                <div className={styles.rectangle3462416472} />
              </div>
            </div>
          </div>
          <div className={styles.kAnbanCard2}>
            <p className={styles.text}>Design review</p>
            <div className={styles.frame1321315606}>
              <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.field1}>Deadline:</p>
              <p className={styles.a0824}>08/24</p>
            </div>
            <div className={styles.frame1321315588}>
              <DownExpandOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.a0824}>Owner:</p>
              <Tag
                shape="round"
                color="neutral-avatar"
                size="small"
                icon={
                  <Avatar
                    color="blue"
                    size="extra-small"
                    className={styles.iconMoreOutlined}
                  />
                }
                className={styles.aDIconButton}
              >
                Perez
              </Tag>
            </div>
            <div className={styles.frame21472299542}>
              <div className={styles.frame21472236193}>
                <div className={styles.rectangle3462416473} />
                <div className={styles.rectangle3462416482} />
                <div className={styles.rectangle3462416492} />
              </div>
              <div className={styles.frame21472236194}>
                <div className={styles.rectangle3462416482} />
                <div className={styles.rectangle3462416474} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame2036085533}>
          <div className={styles.frame13213158642}>
            <Tag color="red-option" closable={true} className={styles.aDTagOption}>
              Done
            </Tag>
          </div>
          <div className={styles.kAnbanCard3}>
            <p className={styles.text}>Project team briefing</p>
            <div className={styles.frame1321315606}>
              <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.field1}>Deadline:</p>
              <p className={styles.a0824}>08/20</p>
            </div>
            <div className={styles.frame1321315588}>
              <DownExpandOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.a0824}>Owner:</p>
              <Tag
                shape="round"
                color="neutral-avatar"
                size="small"
                icon={
                  <Avatar
                    color="blue"
                    size="extra-small"
                    className={styles.iconMoreOutlined}
                  />
                }
                className={styles.aDIconButton}
              >
                Perez
              </Tag>
            </div>
            <div className={styles.frame21472299543}>
              <div className={styles.frame2147223609}>
                <div className={styles.frame21472236195}>
                  <div className={styles.rectangle346241647} />
                  <div className={styles.rectangle346241649} />
                </div>
              </div>
              <div className={styles.frame21472236092}>
                <div className={styles.frame21472236196}>
                  <div className={styles.rectangle3462416475} />
                  <div className={styles.rectangle346241649} />
                </div>
              </div>
              <div className={styles.frame21472236093}>
                <div className={styles.frame21472236197}>
                  <div className={styles.rectangle3462416472} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.kAnbanCard2}>
            <p className={styles.text}>Design review</p>
            <div className={styles.frame1321315606}>
              <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.field1}>Deadline:</p>
              <p className={styles.a0824}>08/24</p>
            </div>
            <div className={styles.frame1321315588}>
              <DownExpandOutlined className={styles.iconCalendarLineOutl} />
              <p className={styles.a0824}>Owner:</p>
              <Tag
                shape="round"
                color="neutral-avatar"
                size="small"
                icon={
                  <Avatar
                    color="blue"
                    size="extra-small"
                    className={styles.iconMoreOutlined}
                  />
                }
                className={styles.aDIconButton}
              >
                Perez
              </Tag>
            </div>
            <div className={styles.frame21472299542}>
              <div className={styles.frame21472236193}>
                <div className={styles.rectangle3462416473} />
                <div className={styles.rectangle3462416482} />
                <div className={styles.rectangle3462416492} />
              </div>
              <div className={styles.frame21472236194}>
                <div className={styles.rectangle3462416482} />
                <div className={styles.rectangle3462416474} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frame2036085531}>
        <div className={styles.tag2}>
          <div className={styles.frame1321315864}>
            <Tag
              color="neutral-option"
              closable={true}
              className={styles.aDTagOption}
            >
              Pending
            </Tag>
          </div>
          <IconButton
            type="text"
            size="small"
            icon={<MoreOutlined className={styles.iconMoreOutlined} />}
            className={styles.aDIconButton}
          />
        </div>
        <div className={styles.kAnbanCard4}>
          <p className={styles.text}>Technical Development</p>
          <div className={styles.frame1321315606}>
            <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
            <p className={styles.field1}>Deadline:</p>
            <p className={styles.a0824}>08/27</p>
          </div>
          <div className={styles.frame13213155882}>
            <DownExpandOutlined className={styles.iconCalendarLineOutl} />
            <p className={styles.a0824}>Owner:</p>
            <Tag
              shape="round"
              color="neutral-avatar"
              size="small"
              icon={
                <Avatar
                  color="blue"
                  size="extra-small"
                  className={styles.iconMoreOutlined}
                />
              }
              className={styles.aDIconButton}
            >
              Cruz
            </Tag>
          </div>
        </div>
        <div className={styles.kAnbanCard4}>
          <p className={styles.text}>Bug fix</p>
          <div className={styles.frame1321315606}>
            <CalendarLineOutlined className={styles.iconCalendarLineOutl} />
            <p className={styles.field1}>Deadline:</p>
            <p className={styles.a0824}>08/27</p>
          </div>
          <div className={styles.frame13213155882}>
            <DownExpandOutlined className={styles.iconCalendarLineOutl} />
            <p className={styles.a0824}>Owner:</p>
            <Tag
              shape="round"
              color="neutral-avatar"
              size="small"
              icon={
                <Avatar
                  color="blue"
                  size="extra-small"
                  className={styles.iconMoreOutlined}
                />
              }
              className={styles.aDIconButton}
            >
              Cruz
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
