import React, { useEffect, useRef } from "react";
import { useTimer } from "react-timer-hook";
import styled from "styled-components";
import axios from "axios";

interface SsoIdProps {
  ssoId: string;
}
const Timer = ({ ssoId }: SsoIdProps, { expiryTimestamp }: any) => {
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      alert("시간이 만료되었습니다.");
      window.location.replace("http://autoway.hyundai.net/");
    },
  });

  const extendRef = useRef<HTMLButtonElement>(null);

  const ExtendTimeClick = () => {
    axios.post("http://10.5.147.162:3000/timecontinuation ", {
      SSO_ID: ssoId,
    });
  };

  useEffect(() => {
    extendRef.current?.click();
  }, []);
  return (
    <TimeCheck>
      <span>
        {minutes} : {seconds}
      </span>
      <TimeExtendBtn
        ref={extendRef}
        onClick={() => {
          const time = new Date();
          time.setSeconds(time.getSeconds() + 3599);
          restart(time);
          ExtendTimeClick();
        }}
      >
        시간연장
      </TimeExtendBtn>
    </TimeCheck>
  );
};

export default Timer;

const TimeCheck = styled.div`
  display: flex;
  justify-content: space-between;

  background-color: rgb(42, 55, 69, 0.7);
  color: #ffffff;
  width: 10rem;
  padding: 0.4rem;
  font: normal normal normal 1.4rem HDharmony;
  letter-spacing: 0px;
  opacity: 1;
  & > span {
    display: flex;
    justify-content: center;
    font: normal normal normal 1.3rem HDharmony;
    width: 55%;
  }
`;

const TimeExtendBtn = styled.button`
  display: flex;
  border: 1px solid #fff;
  font: normal normal normal 0.8rem HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
  background: #5c8ca8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
