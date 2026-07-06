import React from 'react';
import { TodoColorful, SpaceFilled, ExpandOutlined, CopyOutlined } from '@universe-design/icons-react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame2147229948}>
      <div className={styles.frame2147229947}>
        <div className={styles.frame2147224628}>
          <TodoColorful className={styles.iconTodoColorful} />
          <p className={styles.txt}>Messenger</p>
        </div>
        <div className={styles.larkPcPlatformChatMe}>
          <img
            src="../image/mqgfpq1y-j7ie2uf.png"
            className={styles.frame2036083547}
          />
          <div className={styles.frame2147229946}>
            <div className={styles.larkPcPlatformChatNa}>
              <p className={styles.name}>AnyGen AI Teammate</p>
              <div className={styles.tag}>
                <p className={styles.text}>BOT</p>
              </div>
            </div>
            <div className={styles.larkPcPlatformImChat}>
              <p className={styles.text2}>
                Your project report is ready to review.
              </p>
            </div>
            <div className={styles.frame1321314299}>
              <div className={styles.frame2147224830}>
                <SpaceFilled className={styles.iconSpaceFilled} />
                <p className={styles.title}>2026 Q3 Project weekly report</p>
              </div>
              <div className={styles.group2147229844}>
                <img
                  src="../image/mqgfpq1y-xchj4m9.png"
                  className={styles.unsplashCkh9F7Wjn9U}
                />
                <p className={styles.aSecondLevelSubpa}>weekly report</p>
                <p className={styles.aSecondLevelSubpa2}>2026 Q3</p>
              </div>
              <div className={styles.actionInfo}>
                <div className={styles.line417} />
                <div className={styles.frame1321314521}>
                  <p className={styles.youCanView}>You can view</p>
                  <div className={styles.frame1321317380}>
                    <ExpandOutlined className={styles.iconExpandOutlined} />
                    <CopyOutlined className={styles.iconExpandOutlined} />
                  </div>
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
