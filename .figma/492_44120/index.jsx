import React from 'react';
import { NewJoinMeetingFilled, MoreOutlined, BuzzFilled, DownExpandOutlined, MoreCloseOutlined } from '@universe-design/icons-react';
import { IconButton } from '@universe-design/react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.group2036085762}>
      <img src="../image/mqi2atrf-8oiu19o.svg" className={styles.frame} />
      <div className={styles.autoWrapper4}>
        <div className={styles.frame4}>
          <div className={styles.frame2036083498}>
            <div className={styles.frame2}>
              <div className={styles.instance}>
                <NewJoinMeetingFilled className={styles.iconNewJoinMeetingFi} />
              </div>
            </div>
            <div className={styles.frame2036083442}>
              <p className={styles.whenTaskDeadlineIsRe}>
                When task deadline is reached
              </p>
              <div className={styles.rectangle2194} />
            </div>
          </div>
          <div className={styles.frame2036083497}>
            <IconButton
              type="text"
              icon={<MoreOutlined className={styles.iconNewJoinMeetingFi} />}
              className={styles.aDIconButton}
            />
          </div>
          <div className={styles.frame3}>
            <BuzzFilled className={styles.iconBuzzFilled} />
          </div>
        </div>
        <div className={styles.autoWrapper}>
          <img src="../image/mqi2atrf-6ftyjrn.svg" className={styles.vector25} />
          <img src="../image/mqi2atrf-a62obqk.svg" className={styles.vector26} />
          <div className={styles.frame2036083479}>
            <DownExpandOutlined className={styles.iconDownExpandOutlin} />
          </div>
          <div className={styles.frame2036083480}>
            <MoreCloseOutlined className={styles.iconDownExpandOutlin} />
          </div>
          <div className={styles.frame8}>
            <div className={styles.frame20360834982}>
              <div className={styles.frame6}>
                <div className={styles.frame5}>
                  <img
                    src="../image/mqi2atrg-podpho6.svg"
                    className={styles.iconNewJoinMeetingFi}
                  />
                </div>
              </div>
              <div className={styles.frame20360834422}>
                <p className={styles.checkIfStatusIsIncom}>
                  Check if status is incomplete
                </p>
                <div className={styles.rectangle21942} />
              </div>
            </div>
            <div className={styles.frame20360834972}>
              <IconButton
                type="text"
                icon={<MoreOutlined className={styles.iconNewJoinMeetingFi} />}
                className={styles.aDIconButton}
              />
            </div>
            <div className={styles.frame7}>
              <img
                src="../image/mqi2atrg-31gruej.svg"
                className={styles.frame2036083607}
              />
            </div>
          </div>
        </div>
        <div className={styles.autoWrapper3}>
          <div className={styles.autoWrapper2}>
            <div className={styles.vector15}>
              <img
                src="../image/mqi2atrf-aehgi23.svg"
                className={styles.vector27}
              />
            </div>
            <div className={styles.frame20360834983}>
              <div className={styles.frame9}>
                <div className={styles.iconTask1}>
                  <img
                    src="../image/mqi2atrf-2o6dvhi.svg"
                    className={styles.iconTabChatColorfulD}
                  />
                </div>
              </div>
              <div className={styles.frame20360834423}>
                <p className={styles.sendRisk}>Send risk</p>
                <div className={styles.rectangle21943} />
              </div>
            </div>
          </div>
          <div className={styles.group2117130304}>
            <img src="../image/mqi2atrg-wbbyiju.svg" className={styles.vector152} />
            <div className={styles.frame20360834984}>
              <div className={styles.frame10}>
                <div className={styles.instance2}>
                  <NewJoinMeetingFilled className={styles.iconNewJoinMeetingFi} />
                </div>
                <img
                  src="../image/mqi2atrg-8g3jbwq.svg"
                  className={styles.iconTask12}
                />
              </div>
              <div className={styles.frame20360834424}>
                <p className={styles.whenTaskDeadlineIsRe}>Complete Task</p>
                <div className={styles.rectangle21943} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
