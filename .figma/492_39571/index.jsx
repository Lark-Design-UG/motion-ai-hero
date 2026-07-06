import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.content}>
      <div className={styles.frame380}>
        <div className={styles.frame2147229960}>
          <div className={styles.iconBitablegridOutli}>
            <img
              src="../image/mqg6bw25-43wavgh.svg"
              className={styles.iconBurnlifeMinuteOu}
            />
          </div>
          <p className={styles.projectDashboard}>Project Dashboard</p>
        </div>
      </div>
      <div className={styles.frame2147229943}>
        <div className={styles.frame2036085786}>
          <div className={styles.frame2036085787}>
            <div className={styles.frame2036085559}>
              <p className={styles.a222}>Goal</p>
              <p className={styles.a666}>36</p>
            </div>
            <div className={styles.frame2036085559}>
              <p className={styles.a222}>Completed</p>
              <p className={styles.a666}>24</p>
            </div>
          </div>
          <div className={styles.frame1321318741}>
            <div className={styles.frame2147229935}>
              <div className={styles.frame1321318745}>
                <p className={styles.a12}>12</p>
              </div>
              <p className={styles.dAys}>DAYS</p>
            </div>
            <p className={styles.a}>:</p>
            <div className={styles.frame2147229936}>
              <div className={styles.frame13213187452}>
                <p className={styles.a12}>03</p>
              </div>
              <p className={styles.hOurs}>HOURS</p>
            </div>
            <p className={styles.a}>:</p>
            <div className={styles.frame2147229937}>
              <div className={styles.frame13213187452}>
                <p className={styles.a12}>59</p>
              </div>
              <p className={styles.mInutes}>MINUTES</p>
            </div>
            <p className={styles.a}>:</p>
            <div className={styles.frame2147229938}>
              <div className={styles.frame13213187452}>
                <p className={styles.a12}>59</p>
              </div>
              <p className={styles.sEconds}>SECONDS</p>
            </div>
          </div>
        </div>
        <div className={styles.frame}>
          <p className={styles.a222}>Task by status</p>
          <div className={styles.frame2147229964}>
            <img
              src="../image/mqg6bw25-3i09tot.svg"
              className={styles.frame2036084017}
            />
            <div className={styles.frame2036083086}>
              <div className={styles.frame2036083499}>
                <img
                  src="../image/mqg6bw25-005z94v.svg"
                  className={styles.rectangle34}
                />
                <p className={styles.onGoing}>On going</p>
              </div>
              <div className={styles.frame2036083501}>
                <img
                  src="../image/mqg6bw25-h2i26pe.svg"
                  className={styles.rectangle34}
                />
                <p className={styles.onGoing}>Completed</p>
              </div>
              <div className={styles.frame2036083503}>
                <img
                  src="../image/mqg6bw25-jqicz4e.svg"
                  className={styles.rectangle34}
                />
                <p className={styles.onGoing}>Stalled</p>
              </div>
              <div className={styles.frame2036083502}>
                <img
                  src="../image/mqg6bw25-x3g5bo7.svg"
                  className={styles.rectangle34}
                />
                <p className={styles.onGoing}>Not yet started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
