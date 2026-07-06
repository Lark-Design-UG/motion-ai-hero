import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.input}>
      <p className={styles.generateProjectRepor}>Generate project report</p>
      <div className={styles.inputAction}>
        <div className={styles.leftGroup}>
          <div className={styles.pCButton}>
            <img
              src="../image/mqg2g9s6-inbq73a.svg"
              className={styles.minoIconAddOutlined}
            />
          </div>
          <div className={styles.pCButton2}>
            <img
              src="../image/mqg2g9s6-ytd05po.svg"
              className={styles.minoIconKnowledgeOut}
            />
          </div>
          <div className={styles.pCButton2}>
            <img
              src="../image/mqg2g9s6-mi64kyr.svg"
              className={styles.minoIconKnowledgeOut}
            />
          </div>
        </div>
        <div className={styles.rightGroup}>
          <div className={styles.pCButton3}>
            <img
              src="../image/mqg2g9s6-2vuhdwb.svg"
              className={styles.minoIconKnowledgeOut}
            />
          </div>
          <img
            src="../image/mqg2g9s6-90u6akc.svg"
            className={styles.iconToastSend}
          />
        </div>
      </div>
    </div>
  );
}

export default Component;
