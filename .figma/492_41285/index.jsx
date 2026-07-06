import React from 'react';
import { OrganizationOutlined, NewJoinMeetingFilled, MoreOutlined, BuzzFilled, DownExpandOutlined, MoreCloseOutlined } from '@universe-design/icons-react';
import { IconButton } from '@universe-design/react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame2147229933}>
      <div className={styles.frame1564969}>
        <div className={styles.frame2053140079}>
          <OrganizationOutlined className={styles.iconOrganizationOutl} />
        </div>
        <p className={styles.taskManagementFlow}>Task Management Flow</p>
      </div>
      <div className={styles.frame2147229845}>
        <div className={styles.group2036085762}>
          <img src="../image/mqgd8b0a-d4la4xd.svg" className={styles.frame} />
          <div className={styles.autoWrapper3}>
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
              <img
                src="../image/mqgd8b0a-tx5x2cw.svg"
                className={styles.vector25}
              />
              <img
                src="../image/mqgd8b0a-xby06om.svg"
                className={styles.vector26}
              />
              <div className={styles.frame2036083479}>
                <DownExpandOutlined className={styles.iconDownExpandOutlin} />
              </div>
              <div className={styles.frame2036083480}>
                <MoreCloseOutlined className={styles.iconMoreCloseOutline} />
              </div>
              <div className={styles.group2117130304}>
                <img
                  src="../image/mqgd8b0b-227cm38.svg"
                  className={styles.vector15}
                />
                <div className={styles.frame20360834982}>
                  <div className={styles.frame5}>
                    <div className={styles.instance2}>
                      <NewJoinMeetingFilled
                        className={styles.iconNewJoinMeetingFi}
                      />
                    </div>
                    <img
                      src="../image/mqgd8b0b-4mvckgx.svg"
                      className={styles.iconTask1}
                    />
                  </div>
                  <div className={styles.frame20360834422}>
                    <p className={styles.whenTaskDeadlineIsRe}>Complete Task</p>
                    <div className={styles.rectangle21942} />
                  </div>
                </div>
              </div>
              <div className={styles.frame9}>
                <div className={styles.frame20360834983}>
                  <div className={styles.frame7}>
                    <div className={styles.frame6}>
                      <img
                        src="../image/mqgd8b0b-01l7ve7.svg"
                        className={styles.iconNewJoinMeetingFi}
                      />
                    </div>
                  </div>
                  <div className={styles.frame20360834423}>
                    <p className={styles.checkIfStatusIsIncom}>
                      Check if status is incomplete
                    </p>
                    <div className={styles.rectangle21943} />
                  </div>
                </div>
                <div className={styles.frame20360834972}>
                  <IconButton
                    type="text"
                    icon={<MoreOutlined className={styles.iconNewJoinMeetingFi} />}
                    className={styles.aDIconButton}
                  />
                </div>
                <div className={styles.frame8}>
                  <img
                    src="../image/mqgd8b0b-0uuhu5v.svg"
                    className={styles.frame2036083607}
                  />
                </div>
              </div>
            </div>
            <div className={styles.autoWrapper2}>
              <img
                src="../image/mqgd8b0a-7cf1mie.svg"
                className={styles.vector152}
              />
              <div className={styles.frame20360834984}>
                <div className={styles.frame10}>
                  <div className={styles.iconTask12}>
                    <img
                      src="../image/mqgd8b0b-57pev7q.svg"
                      className={styles.iconTabChatColorfulD}
                    />
                  </div>
                </div>
                <div className={styles.frame20360834424}>
                  <p className={styles.sendRisk}>Send risk</p>
                  <div className={styles.rectangle21944} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
