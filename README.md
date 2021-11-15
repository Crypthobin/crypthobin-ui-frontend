# 밥 그릇 프론트
- 밥 그릇 PQC 월렛의 프론트 코드입니다. :smile:
- `expo-cli`로 작성되었습니다. (expo 혹은 에뮬레이터 설치 필요)
## 실행방법
```
cd ./crypthobin-ui-frontend
```
1. 모듈 설치
```
npm install
```
2. 프로젝트 시작
```
npm start
```
## 더미 데이터 목록
*(경로: .../crypthobin-ui-frontend/data/...)*
- addressData.json: 내 주소록 목록 (name, address. isDel)
- blockData.json: 블록 목록 (index, miner, age, tx_num, reward)
- networkData.json: 블록체인 네트워크 정보 (user_num, block_num)
- txData.json: 내 트랜잭션 목록 (type, address, date, amount)
- txDataEmpty.json: 내 트랜잭션이 없을 때 테스트 용.
- walletData.json: 내 지갑 정보 (address, balance)
## 해야 할 것 :relieved:
- [ ] ~~splash~~ 및 아이콘 구성
- [x] ~~앱 로딩 시 이미지, 폰트 렌더링 처리~~
- [ ] 회원 가입 시 아이디, 비밀번호 자릿수 및 문자 포함 기준
- [x] ~~주소록 -> 삭제 기능, 예외 처리~~
- [ ] 다른 탭 이동 시 스택 초기화
- [ ] useNativeDriver
