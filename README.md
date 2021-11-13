# 밥 그릇 프론트
- 밥 그릇 PQC 월렛의 프론트 코드입니다.
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
- addressData.json: 내 주소록 목록 (name, address)
- blockData.json: 블록 목록 (index, miner, age, tx_num, reward)
- networkData.json: 블록체인 네트워크 정보 (user_num, block_num)
- txData.json: 내 트랜잭션 목록 (type, address, date, amount)
- txDataEmpty.json: 내 트랜잭션이 없을 때 테스트 용.
- walletData.json: 내 지갑 정보 (address, balance)
