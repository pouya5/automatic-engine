import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton";

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawal,
  } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{fromNano(contract_balance)}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
      </div>

      {connected && (
        <a onClick={() => {
          sendIncrement()
        }}>
          Increment by 5
        </a>
      )}

      <br/>
      
      {connected && (
        <a onClick={() => {
          sendDeposit()
        }}>
          Request deposit of 1 TON
        </a>
      )}

      <br/>

      {connected && (
        <a onClick={() => {
          sendWithdrawal()
        }}>
          Request Withdraw of 0.7 TON
        </a>
      )}

    </div>
  );
}

export default App;