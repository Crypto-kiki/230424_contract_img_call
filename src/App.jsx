import { useEffect, useState } from "react";
import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  NFT_ABI,
  NFT_ADDRESS,
} from "./web3.config";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const nftContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

function App() {
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState();
  const [name, setName] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [symbol, setSymbol] = useState();

  const onClickAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const onClickLogOut = () => {
    setAccount("");
  };

  /* console 조회해보기
  useEffect(() => {
    console.log(contract);
    console.log(web3);
  }, []);
*/
  const onClickBalance = async () => {
    try {
      if (!account) {
        alert("지갑을 연결해주세요");
        return;
      }

      if (!contract) {
        alert("조회 가능한 컨트렉트 주소가 없습니다.");
      }

      const balance = await contract.methods.balanceOf(account).call();
      const name = await contract.methods.name().call();
      const totalSupply = await contract.methods.totalSupply().call();
      const symbol = await contract.methods.symbol().call();

      setMyBalance(parseInt(web3.utils.fromWei(balance)));
      setName(name);
      setTotalSupply(parseInt(web3.utils.fromWei(totalSupply)));
      setSymbol(symbol);

      console.log(balance);
      console.log(name);
      console.log(totalSupply);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMint = async () => {
    try {
      if (!account) return;
      const result = await nftContract.methods
        .mintNft(
          "https://gateway.pinata.cloud/ipfs/QmdhBnv2DDVKrM5wYY417ns1D1n3QZYPx7HyvZqVEisiQo"
        )
        .send({ from: account });

      if (!result.status) return;

      const balanceOf = await nftContract.methods.balanceOf(account).call();
      console.log(balanceOf);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(nftContract);
  }, []);

  return (
    <div className="bg-red-100 min-h-screen flex justify-center items-center">
      {account ? (
        <div>
          <div className="text-main font-semibold text-2xl">
            {account.substring(0, 4)}...
            {account.substring(account.length - 4)}
            <button className="ml-4 btn-style" onClick={onClickLogOut}>
              로그아웃
            </button>
          </div>
          <div className="flex items-center mt-4">
            {myBalance && (
              <div>
                {name} {symbol} {myBalance} 개
                <div>총 발행량: {totalSupply} 개</div>
              </div>
            )}
            <button className="btn-style ml-2" onClick={onClickBalance}>
              잔액 조회
            </button>
          </div>
          <div className="flex items-center mt-4">
            <button className="ml-2 btn-style" onClick={onClickMint}>
              민팅
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-style" onClick={onClickAccount}>
          <img
            className="w-12"
            src={`${process.env.PUBLIC_URL}/images/metamask.png`}
          />
        </button>
      )}
    </div>
  );
}

export default App;
