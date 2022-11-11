import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { getCookie, removeCookie, setCookie } from "../utils/cookie";
import Timer from "../components/Timer";

type Person = {
  Name: string;
  SSO_ID: string;
  Grade: string;
  Team: string;
  Security: string;
  Remove: string;
};

const Main = () => {
  const [userName, setUserName] = useState<string>("");
  const [userGrade, setUserGrade] = useState<string>("");
  const [userTeam, setUserTeam] = useState<string>("");
  const [ssoId, setSsoId] = useState<string>("");
  const [security, setSecutity] = useState<string>(
    "DIP에서 공유되는 문서 및 내용은 , 『부정경쟁방지법 및 영업비밀보호에 관한 법률』,『산업기술의 유출방지 및 보호에 관한 법률』에 따라 보호의 대상이 되는 영업비밀, 산업기술 등이 포함되었을 수 있습니다. 본 문서에 포함된 정보의 전부 또는 일부를 무단으로 사용하거나 제 3자에게 공개, 배포, 복사하는 것은 엄격히 금지됩니다.(캡처 및 사진 등) 본 문서는 현대자동차ㆍ기아의 정보자산으로 관련 법령에 의해 보호받습니다."
  );

  const GetSsoId = async () => {
    setSsoId(getCookie("sso_id"));
  };
  useEffect(() => {
    if (ssoId !== "") {
      GetSsoId().then(() => {
        axios
          .post("http://10.5.147.162:3000/sso/getinfo", {
            SSO_ID: ssoId,
          })
          .then((res) => {
            const obj = JSON.parse(res.data) as Person;
            setUserName(obj.Name);
            setUserGrade(obj.Grade);
            setUserTeam(obj.Team);
            setSecutity(obj.Security);

            if (obj.Remove === "removeCookie") {
              removeCookie("sso_id");
            }
          });
      });
    }
  }, [ssoId]);

  //클릭시 설치 팝업
  function RunProgram() {
    const url = "DIP:\\";
    const exec = document.createElement("a");
    exec.setAttribute("href", url);
    exec.click();
  }

  const DIPClick = () => {
    RunProgram();
  };

  const DIPdownClick = () => {
    const URL = "http://10.5.147.162:3000/launcher";
    fetch(URL, {
      method: "GET",
    })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "DIP_Launcher";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 60000);
        a.remove();
      })
      .catch((err) => {
        console.error("err: ", err);
      });
  };

  //보안문자 확인하기
  const [checkSecurity, setCheckSecurity] = useState<string>("");
  const [securityModal, setSecutityModal] = useState<boolean>(false);

  const SecurityText = () => {
    if (securityModal === false) {
      axios
        .post("http://10.5.147.162:3000/getkey ", {
          SSO_ID: ssoId,
        })
        .then((res) => {
          if (res.data === "error") {
            setCheckSecurity(
              "보안문자를 요청하지 않았거나 시간이 만료되었습니다."
            );
          } else {
            setCheckSecurity(res.data);
          }
        });
    }
    setSecutityModal((prev) => !prev);
  };

  const arr = Array.from(checkSecurity);

  //로그아웃
  const [logOutModal, setlogOutModal] = useState<boolean>(false);

  const LogOutClick = () => {
    setlogOutModal(true);
  };

  const LogOutOk = () => {
    axios.post("http://10.5.147.162:3000/logout ", {
      SSO_ID: ssoId,
    });
    window.location.replace("http://autoway.hyundai.net/");
  };

  return (
    <>
      {securityModal ? (
        <ModalLayOut>
          <ModalDiv>
            <div className="ModalDiv--Header">보안 문자 확인하기</div>

            <div className="ModalDiv--Main">
              <SecurityCodeContainer>
                {arr.length === 6 ? (
                  arr.map((value) => <SecurityCode>{value}</SecurityCode>)
                ) : (
                  <div style={{ color: "white" }}>{checkSecurity}</div>
                )}
              </SecurityCodeContainer>
              <CheckBtn onClick={SecurityText}>확인</CheckBtn>
            </div>
          </ModalDiv>
        </ModalLayOut>
      ) : null}

      {logOutModal ? (
        <ModalLayOut>
          <ModalDiv>
            <div className="ModalDiv--Header">로그아웃</div>

            <div className="ModalDiv--Main">
              <SecurityCodeContainer>
                <div style={{ color: "white" }}>로그아웃 되었습니다.</div>
              </SecurityCodeContainer>
              <CheckBtn onClick={LogOutOk}>확인</CheckBtn>
            </div>
          </ModalDiv>
        </ModalLayOut>
      ) : null}

      <VideoBackGround
        src="/sso/autologin/video/DIP_Web_BG_Fin.mp4"
        loop
        muted
        autoPlay
        playsInline
      />
      <Container>
        <LogOut onClick={LogOutClick}>로그아웃</LogOut>
        <SecurityTimeWrapper>
          <SecurityBtn onClick={SecurityText}>보안 문자 확인하기</SecurityBtn>
          <Timer ssoId={ssoId} />
        </SecurityTimeWrapper>
        <MainDiv>
          <Header>환영합니다</Header>

          <ExcuteSection>
            <Table>
              <tr>
                <td className="userInfo">
                  <p className="userInfo--text">이름</p>
                </td>

                <td className="userInfo2">
                  <p className="userInfo--text2">{userName}</p>
                </td>
              </tr>
              <tr>
                <td className="userInfo">
                  <p className="userInfo--text">소속</p>
                </td>
                <td className="userInfo2">
                  <p className="userInfo--text2">{userTeam}</p>
                </td>
              </tr>
              <tr>
                <td className="userInfo">
                  <p className="userInfo--text">직위</p>
                </td>
                <td className="userInfo2">
                  <p className="userInfo--text2">{userGrade}</p>
                </td>
              </tr>
            </Table>
            <ButtonWrapper>
              <Button id="callModule" onClick={DIPClick}>
                DIP 실행하기
              </Button>
              <Button onClick={DIPdownClick}>DIP 다운로드</Button>
            </ButtonWrapper>
          </ExcuteSection>
        </MainDiv>
        <SecurityFooter>{security}</SecurityFooter>
      </Container>
    </>
  );
};

export default Main;
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  user-select: none;
  overflow: hidden;
`;
const VideoBackGround = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
`;

const MainDiv = styled.main`
  width: 30rem;
  height: 22rem;
  border: 1px solid #def9ff;
  margin-top: 4rem;
`;

const Header = styled.header`
  width: 100%;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #7db6c9;
  font: normal normal normal 23px HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
`;
const ExcuteSection = styled.section`
  width: 100%;
  height: 18.5rem;
  background-color: rgb(42, 55, 69, 0.7);
  box-sizing: border-box;
  padding: 1.2rem;
`;

const Table = styled.table`
  width: 100%;
  height: 180px;
  margin: auto;
  border-collapse: collapse;
  td {
    border-bottom: 2px solid #78979b;
  }

  .userInfo {
    width: 25%;
    border-right: 2px solid #78979b;
    .userInfo--text {
      display: flex;
      justify-content: center;
      font: normal normal normal 18px HDharmony M;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }

  .userInfo2 {
    width: 75%;
    .userInfo--text2 {
      margin-left: 20px;
      font: normal normal normal 18px HDharmony M;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Button = styled.button`
  display: flex;
  width: calc(50% - 0.5rem);
  height: 50px;
  margin-top: 20px;
  border: 1px solid #fff;
  font: normal normal normal 18px HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
  background: #5c8ca8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SecurityFooter = styled.footer`
  border: 1px solid #ffffff;
  font: normal normal normal 24px HDharmony M;
  letter-spacing: 0.1px;
  color: white;
  font-weight: 500;
  text-align: center;
  padding: 0 2rem;
  box-sizing: border-box;
  font-size: 1rem;
  width: 70rem;
  height: 8rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  background-color: rgb(42, 55, 69, 0.7);
  opacity: 1;
`;

const LogOut = styled.button`
  position: absolute;
  top: 3rem;
  left: 4rem;
  display: flex;
  padding: 0.5rem 1rem;
  border: 1px solid #fff;
  font: normal normal normal 18px HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
  background: #5c8ca8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SecurityTimeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 3rem;
  right: 4rem;
`;

const SecurityBtn = styled.button`
  display: flex;
  padding: 0.5rem 1rem;
  border: 1px solid #fff;
  font: normal normal normal 18px HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
  background: #5c8ca8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 0.4rem;
`;

const TimeWrapper = styled.div`
  display: flex;
  background-color: rgb(42, 55, 69, 0.7);
  color: #ffffff;
  width: 10rem;
  padding: 0.4rem;
  font: normal normal normal 1.4rem HDharmony;
  letter-spacing: 0px;
  opacity: 1;
`;

const ModalLayOut = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(8px);
  z-index: 1;
  background-color: rgb(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalDiv = styled.div`
  width: 30rem;
  height: 15rem;
  border: 1px solid #def9ff;
  .ModalDiv--Header {
    width: 100%;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #7db6c9;
    font: normal normal normal 0.9rem HDharmony M;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .ModalDiv--Main {
    width: 100%;
    height: 12.5rem;
    background-color: rgb(42, 55, 69, 0.7);
    box-sizing: border-box;
    padding: 2rem;
    position: relative;
    display: flex;
    justify-content: center;
  }
`;

const SecurityCodeContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SecurityCode = styled.div`
  width: 2.5rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font: normal normal normal 1rem HDharmony M;
  color: #ffffff;
  background-color: gray;
  border: 1px solid #fff;
  border-radius: 0.5rem;
  margin-right: 0.3rem;
`;

const CheckBtn = styled.button`
  position: absolute;
  display: flex;
  padding: 0.5rem 1rem;
  border: 1px solid #fff;
  bottom: 1.5rem;
  width: 10rem;
  font: normal normal normal 18px HDharmony M;
  letter-spacing: 0px;
  color: #ffffff;
  background: #5c8ca8;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
