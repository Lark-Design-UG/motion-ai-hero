import React from 'react';
import { Checkbox } from '@universe-design/react';
import { CalendarDateOutlined, ChangeTodoOutlined } from '@universe-design/icons-react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame2147223758}>
      <div className={styles.frame2147229951}>
        <img
          src="../image/mqgd5z1v-x1ghcts.svg"
          className={styles.frame2053140079}
        />
        <p className={styles.title}>Tasks</p>
      </div>
      <div className={styles.frame2147223759}>
        <div className={styles.frame1321315775}>
          <div className={styles.aTableCell}>
            <Checkbox checked={true} className={styles.aDCheckbox} />
          </div>
          <div className={styles.frame1321315833}>
            <p className={styles.field2Unrevised}>
              Provide copywriting for the new product page
            </p>
            <div className={styles.frame2147223762}>
              <div className={styles.frame2147223761}>
                <div className={styles.frame2147223742}>
                  <img
                    src="../image/mqgd5z1w-ghg8vq1.png"
                    className={styles.ellipse38601}
                  />
                  <p className={styles.field2Unrevised2}>Mei Li</p>
                </div>
                <CalendarDateOutlined className={styles.iconCalendarDateOutl} />
              </div>
              <ChangeTodoOutlined className={styles.iconCalendarDateOutl} />
            </div>
          </div>
        </div>
        <div className={styles.frame13213157752}>
          <div className={styles.aTableCell2}>
            <div className={styles.spacer}>
              <Checkbox className={styles.aDCheckbox2} />
            </div>
          </div>
          <div className={styles.frame13213158332}>
            <div className={styles.rectangle279337088} />
            <div className={styles.rectangle279337089} />
          </div>
        </div>
        <div className={styles.frame13213157753}>
          <div className={styles.aTableCell2}>
            <div className={styles.spacer}>
              <Checkbox className={styles.aDCheckbox2} />
            </div>
          </div>
          <div className={styles.frame13213158333}>
            <div className={styles.rectangle2793370892} />
            <div className={styles.rectangle2793370882} />
          </div>
        </div>
        <div className={styles.frame13213157754}>
          <div className={styles.aTableCell2}>
            <div className={styles.spacer}>
              <Checkbox className={styles.aDCheckbox2} />
            </div>
          </div>
          <div className={styles.frame13213158334}>
            <div className={styles.rectangle2793370883} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
